/**
 * @name DenoSass
 * @description A Deno module for compiling Sass to CSS in WASM
 * @author Nassim Zen
 */ import { denosass, emptyDirSync, ensureDirSync, path, walkSync } from './deps.ts';
export const warn = (msg)=>console.warn(`🟡 %c[%cSass%c]%c ${msg}`, 'color: yellow', 'color: orange', 'color: yellow', 'color: yellow;');
export const error = (msg)=>console.error(`🛑 %c[%cSass%c]%c ${msg}`, 'color: yellow', 'color: red', 'color: yellow', 'color: red;');
export const log = (msg)=>console.log(`🔵%c[%cSass%c]%c ${msg}`, 'color: red', 'color: cyan', 'color: red', 'color: gray;');
/**
 * @name exists
 * @description Checks if a file/dir exists
 * @param filepath : string / path to a file/folder
 * @param check : Determine if we check for a Dir or a File
 * @returns boolean
 */ const exists = (filepath, check)=>{
    try {
        const pathurl = new URL(filepath, `file://${Deno.cwd()}/`);
        const file = Deno.statSync(pathurl);
        if (check === 'file') return file.isFile;
        else if (check === 'dir') return file.isDirectory;
        else return file.isFile;
    } catch (_error) {
        return false;
    }
};
class Sass {
    #input;
    // deno-lint-ignore no-explicit-any
    #inputFormat;
    #current;
    #mode;
    output;
    //
    // Modes :
    // 1 = StringMode , the input is a String
    // 2 = SetMode, the input was a list of Element
    #outmode;
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    options;
    constructor(input, options = {
        load_paths: [
            Deno.cwd()
        ],
        style: 'compressed',
        quiet: true
    }){
        this.#input = input;
        this.#current = '';
        this.#mode = 'file';
        this.#outmode = 0;
        this.output = '';
        this.options = {
            load_paths: options.load_paths || [
                Deno.cwd()
            ],
            style: options.style || 'compressed',
            quiet: options.quiet || true
        };
        return this.#checkType();
    }
    /**
   * @name to_string
   * @param format SassFormats "compressed" | "expanded"
   * @returns Sass.output
   */ to_string(format) {
        if (this.#outmode === 0) {
            error(`No Output mode has been set during the process.`);
            return false;
        }
        if (typeof format !== 'undefined') this.options.style = format;
        if (typeof this.#current === 'string' || this.#current instanceof Map) {
            if (this.#outmode === 1) {
                if (this.#mode === 'string') {
                    this.output = denosass.str(this.#current, this.options);
                } else {
                    this.output = denosass.file(this.#current, this.options);
                }
            } else if (this.#outmode === 2) {
                this.output = [
                    ...this.#current
                ].reduce((acc, file)=>{
                    acc.set(file[0], denosass.file(file[1], this.options));
                    return acc;
                }, new Map());
            }
        } else {
            error('Invalid output data this.#current is not set to a valid value.');
            Deno.exit(1);
        }
        return this.output;
    }
    /**
   * @name to_buffer
   * @param format SassFormats : "compressed" | "expanded"
   * @returns Sass
   */ to_buffer(format) {
        if (this.#outmode === 0) {
            error(`No Output mode has been set during the process.`);
            return false;
        }
        if (typeof format !== 'undefined') this.options.style = format;
        if (this.#outmode === 1) {
            if (this.#mode === 'string') {
                this.output = this.encoder.encode(denosass.str(this.#current, this.options));
            } else {
                this.output = this.encoder.encode(denosass.file(this.#current, this.options));
            }
        } else if (this.#outmode === 2) {
            this.output = [
                ...this.#current
            ].reduce((acc, file)=>{
                acc.set(file[0], this.encoder.encode(denosass.file(file[1], this.options)));
                return acc;
            }, new Map());
        } else {
        //
        }
        return this.output;
    }
    /**
   * @name to_file
   * @description Outputs the finished data to file following output options
   */ to_file(outputOptions) {
        if (outputOptions.destDir.length <= 0) {
            error(`The output dir string is empty`);
            Deno.exit(1);
        }
        const outDirpath = path.normalize(outputOptions.destDir);
        let outFileExt = '';
        if (exists(outDirpath, 'dir')) {
            emptyDirSync(outDirpath);
        } else {
            ensureDirSync(outDirpath);
        }
        switch(outputOptions.format){
            case 'compressed':
                outFileExt = '.min.css';
                break;
            case 'expanded':
                outFileExt = '.css';
                break;
            default:
                outFileExt = '.min.css';
                break;
        }
        // Processing the data
        this.to_string(outputOptions.format);
        if (outputOptions.destFile) {
            const filepath = path.format({
                root: './',
                dir: outDirpath,
                name: outputOptions.destFile,
                ext: outFileExt
            });
            const fileURL = new URL(filepath, `file://${Deno.cwd()}/`);
            if (exists(filepath, 'file')) {
                Deno.removeSync(fileURL);
            }
            if (this.output instanceof Map) {
                this.output.forEach((ParsedCSs)=>{
                    Deno.writeTextFileSync(fileURL, typeof ParsedCSs !== 'string' ? this.decoder.decode(ParsedCSs) : ParsedCSs, {
                        append: true,
                        create: true,
                        mode: 644
                    });
                });
            } else {
                Deno.writeTextFileSync(fileURL, typeof this.output !== 'string' ? this.decoder.decode(this.output) : this.output, {
                    append: false,
                    create: true,
                    mode: 644
                });
            }
        } else {
            if (this.output instanceof Map) {
                this.output.forEach((ParsedCSs, filename)=>{
                    const filepath = path.format({
                        root: './',
                        dir: outDirpath,
                        name: filename,
                        ext: outFileExt
                    });
                    const fileURL = new URL(filepath, `file://${Deno.cwd()}/`);
                    if (exists(filepath, 'file')) {
                        Deno.removeSync(fileURL);
                    }
                    Deno.writeTextFileSync(fileURL, typeof ParsedCSs !== 'string' ? this.decoder.decode(ParsedCSs) : ParsedCSs, {
                        append: false,
                        create: true,
                        mode: 644
                    });
                });
            } else {
                const filepath = path.format({
                    root: './',
                    dir: outDirpath,
                    name: 'untitled',
                    ext: outFileExt
                });
                const fileURL = new URL(filepath, `file://${Deno.cwd()}/`);
                if (exists(filepath, 'file')) {
                    Deno.removeSync(fileURL);
                }
                Deno.writeTextFileSync(fileURL, typeof this.output !== 'string' ? this.decoder.decode(this.output) : this.output, {
                    append: false,
                    create: true,
                    mode: 644
                });
            }
        }
        return true;
    }
    /** */ #checkType() {
        if (!(this.#input instanceof Uint8Array)) {
            switch(typeof this.#input){
                case 'string':
                    {
                        if (exists(this.#input, 'file')) {
                            return this.#processFile();
                        } else if (exists(this.#input, 'dir')) {
                            return this.#processDir();
                        } else {
                            this.#mode = 'string';
                            this.#outmode = 1;
                            this.#current = this.#input;
                        }
                    }
                    break;
                case 'object':
                    {
                        return this.#processObject();
                    }
                default:
                    return this;
            }
        } else {
            this.#input = new TextDecoder().decode(this.#input);
            this.#checkType();
        }
        return this;
    }
    #processFile() {
        const FilePath = new URL(this.#input, `file://${Deno.cwd()}/`);
        const file = Deno.statSync(FilePath);
        if (file.size === 0) {
            error(`The file you want to read is empty.`);
        }
        this.#outmode = 1;
        this.#current = this.#input;
        return this;
    }
    #processDir() {
        if (!(this.#current instanceof Map)) {
            this.#current = new Map();
        }
        for (const entry of walkSync(this.#input, {
            maxDepth: 1,
            includeDirs: false,
            exts: [
                '.scss',
                '.sass'
            ]
        })){
            this.#current.set(path.parse(entry.path).name, entry.path);
        }
        this.#outmode = 2;
        return this;
    }
    #processObject() {
        const urls = this.#input;
        if (!(this.#current instanceof Map)) {
            this.#current = new Map();
        }
        urls.map((filePath)=>{
            if (exists(filePath, 'dir')) {
                this.#current = this.#current;
                this.#current.delete(filePath);
                for (const entry of walkSync(filePath, {
                    maxDepth: 1,
                    exts: [
                        '.scss',
                        '.sass'
                    ]
                })){
                    this.#current.set(path.parse(entry.path).name, entry.path);
                }
            } else if (exists(filePath, 'file')) {
                const fileURL = path.parse(filePath);
                this.#current = this.#current;
                this.#current.set(fileURL.name, filePath);
            } else {
                warn(`The File ${filePath.trim()} does not exist or is not a valid file`);
            }
        });
        this.#outmode = 2;
        return this;
    }
}
/**
 * @name sass
 * @description Compile sass from the input
 * @param input string[]
 * @param _options unknown
 * @returns Sass
 */ export function sass(input, options) {
    return new Sass(input, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvZGVub3Nhc3NAMS4wLjQvc3JjL21vZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBuYW1lIERlbm9TYXNzXG4gKiBAZGVzY3JpcHRpb24gQSBEZW5vIG1vZHVsZSBmb3IgY29tcGlsaW5nIFNhc3MgdG8gQ1NTIGluIFdBU01cbiAqIEBhdXRob3IgTmFzc2ltIFplblxuICovXG5pbXBvcnQge1xuICBkZW5vc2FzcyxcbiAgZW1wdHlEaXJTeW5jLFxuICBlbnN1cmVEaXJTeW5jLFxuICBwYXRoLFxuICB3YWxrU3luYyxcbn0gZnJvbSAnLi9kZXBzLnRzJztcbmltcG9ydCB7XG4gIEV4cG9ydE9wdGlvbnMsXG4gIElucHV0VHlwZSxcbiAgU2Fzc0Zvcm1hdHMsXG4gIFNhc3NPYmplY3QsXG4gIFNhc3NPcHRpb25zLFxufSBmcm9tICcuL3R5cGVzL21vZHVsZS50eXBlcy50cyc7XG5leHBvcnQgY29uc3Qgd2FybiA9IChtc2c6IHN0cmluZykgPT5cbiAgY29uc29sZS53YXJuKFxuICAgIGDwn5+hICVjWyVjU2FzcyVjXSVjICR7bXNnfWAsXG4gICAgJ2NvbG9yOiB5ZWxsb3cnLFxuICAgICdjb2xvcjogb3JhbmdlJyxcbiAgICAnY29sb3I6IHllbGxvdycsXG4gICAgJ2NvbG9yOiB5ZWxsb3c7JyxcbiAgKTtcbmV4cG9ydCBjb25zdCBlcnJvciA9IChtc2c6IHN0cmluZykgPT5cbiAgY29uc29sZS5lcnJvcihcbiAgICBg8J+bkSAlY1slY1Nhc3MlY10lYyAke21zZ31gLFxuICAgICdjb2xvcjogeWVsbG93JyxcbiAgICAnY29sb3I6IHJlZCcsXG4gICAgJ2NvbG9yOiB5ZWxsb3cnLFxuICAgICdjb2xvcjogcmVkOycsXG4gICk7XG5leHBvcnQgY29uc3QgbG9nID0gKG1zZzogc3RyaW5nKSA9PlxuICBjb25zb2xlLmxvZyhcbiAgICBg8J+UtSVjWyVjU2FzcyVjXSVjICR7bXNnfWAsXG4gICAgJ2NvbG9yOiByZWQnLFxuICAgICdjb2xvcjogY3lhbicsXG4gICAgJ2NvbG9yOiByZWQnLFxuICAgICdjb2xvcjogZ3JheTsnLFxuICApO1xuXG4vKipcbiAqIEBuYW1lIGV4aXN0c1xuICogQGRlc2NyaXB0aW9uIENoZWNrcyBpZiBhIGZpbGUvZGlyIGV4aXN0c1xuICogQHBhcmFtIGZpbGVwYXRoIDogc3RyaW5nIC8gcGF0aCB0byBhIGZpbGUvZm9sZGVyXG4gKiBAcGFyYW0gY2hlY2sgOiBEZXRlcm1pbmUgaWYgd2UgY2hlY2sgZm9yIGEgRGlyIG9yIGEgRmlsZVxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5jb25zdCBleGlzdHMgPSAoZmlsZXBhdGg6IHN0cmluZywgY2hlY2s6ICdmaWxlJyB8ICdkaXInKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aHVybCA9IG5ldyBVUkwoZmlsZXBhdGgsIGBmaWxlOi8vJHtEZW5vLmN3ZCgpfS9gKTtcbiAgICBjb25zdCBmaWxlID0gRGVuby5zdGF0U3luYyhwYXRodXJsKTtcbiAgICBpZiAoY2hlY2sgPT09ICdmaWxlJykgcmV0dXJuIGZpbGUuaXNGaWxlO1xuICAgIGVsc2UgaWYgKGNoZWNrID09PSAnZGlyJykgcmV0dXJuIGZpbGUuaXNEaXJlY3Rvcnk7XG4gICAgZWxzZSByZXR1cm4gZmlsZS5pc0ZpbGU7XG4gIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuY2xhc3MgU2FzcyBpbXBsZW1lbnRzIFNhc3NPYmplY3Qge1xuICAjaW5wdXQ6IElucHV0VHlwZTtcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgI2lucHV0Rm9ybWF0OiBhbnk7XG4gICNjdXJyZW50OiBVUkwgfCBzdHJpbmcgfCBNYXA8c3RyaW5nLCBzdHJpbmc+O1xuICAjbW9kZTogJ3N0cmluZycgfCAnZmlsZSc7XG4gIHB1YmxpYyBvdXRwdXQ6IHN0cmluZyB8IE1hcDxzdHJpbmcsIHN0cmluZyB8IFVpbnQ4QXJyYXk+IHwgVWludDhBcnJheTtcbiAgLy9cbiAgLy8gTW9kZXMgOlxuICAvLyAxID0gU3RyaW5nTW9kZSAsIHRoZSBpbnB1dCBpcyBhIFN0cmluZ1xuICAvLyAyID0gU2V0TW9kZSwgdGhlIGlucHV0IHdhcyBhIGxpc3Qgb2YgRWxlbWVudFxuICAjb3V0bW9kZTogMCB8IDEgfCAyO1xuICBwcml2YXRlIHJlYWRvbmx5IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgcHJpdmF0ZSByZWFkb25seSBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG4gIHB1YmxpYyBvcHRpb25zOiBTYXNzT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbnB1dDogSW5wdXRUeXBlLFxuICAgIG9wdGlvbnM6IFNhc3NPcHRpb25zID0ge1xuICAgICAgbG9hZF9wYXRoczogW0Rlbm8uY3dkKCldLFxuICAgICAgc3R5bGU6ICdjb21wcmVzc2VkJyxcbiAgICAgIHF1aWV0OiB0cnVlLFxuICAgIH0sXG4gICkge1xuICAgIHRoaXMuI2lucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy4jY3VycmVudCA9ICcnO1xuICAgIHRoaXMuI21vZGUgPSAnZmlsZSc7XG4gICAgdGhpcy4jb3V0bW9kZSA9IDA7XG4gICAgdGhpcy5vdXRwdXQgPSAnJztcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBsb2FkX3BhdGhzOiBvcHRpb25zLmxvYWRfcGF0aHMgfHwgW0Rlbm8uY3dkKCldLFxuICAgICAgc3R5bGU6IG9wdGlvbnMuc3R5bGUgfHwgJ2NvbXByZXNzZWQnLFxuICAgICAgcXVpZXQ6IG9wdGlvbnMucXVpZXQgfHwgdHJ1ZSxcbiAgICB9O1xuICAgIHJldHVybiB0aGlzLiNjaGVja1R5cGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSB0b19zdHJpbmdcbiAgICogQHBhcmFtIGZvcm1hdCBTYXNzRm9ybWF0cyBcImNvbXByZXNzZWRcIiB8IFwiZXhwYW5kZWRcIlxuICAgKiBAcmV0dXJucyBTYXNzLm91dHB1dFxuICAgKi9cbiAgcHVibGljIHRvX3N0cmluZyhmb3JtYXQ/OiBTYXNzRm9ybWF0cykge1xuICAgIGlmICh0aGlzLiNvdXRtb2RlID09PSAwKSB7XG4gICAgICBlcnJvcihgTm8gT3V0cHV0IG1vZGUgaGFzIGJlZW4gc2V0IGR1cmluZyB0aGUgcHJvY2Vzcy5gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgIT09ICd1bmRlZmluZWQnKSB0aGlzLm9wdGlvbnMuc3R5bGUgPSBmb3JtYXQ7XG4gICAgaWYgKHR5cGVvZiB0aGlzLiNjdXJyZW50ID09PSAnc3RyaW5nJyB8fCB0aGlzLiNjdXJyZW50IGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICBpZiAodGhpcy4jb3V0bW9kZSA9PT0gMSkge1xuICAgICAgICBpZiAodGhpcy4jbW9kZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLm91dHB1dCA9IGRlbm9zYXNzLnN0cihcbiAgICAgICAgICAgIHRoaXMuI2N1cnJlbnQgYXMgc3RyaW5nLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vdXRwdXQgPSBkZW5vc2Fzcy5maWxlKFxuICAgICAgICAgICAgdGhpcy4jY3VycmVudCBhcyBzdHJpbmcsXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLiNvdXRtb2RlID09PSAyKSB7XG4gICAgICAgIHRoaXMub3V0cHV0ID0gWy4uLih0aGlzLiNjdXJyZW50IGFzIE1hcDxzdHJpbmcsIHN0cmluZz4pXVxuICAgICAgICAgIC5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjLCBmaWxlKSA9PiB7XG4gICAgICAgICAgICAgIGFjYy5zZXQoXG4gICAgICAgICAgICAgICAgZmlsZVswXSxcbiAgICAgICAgICAgICAgICBkZW5vc2Fzcy5maWxlKGZpbGVbMV0sIHRoaXMub3B0aW9ucyksXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKSxcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcihcbiAgICAgICAgJ0ludmFsaWQgb3V0cHV0IGRhdGEgdGhpcy4jY3VycmVudCBpcyBub3Qgc2V0IHRvIGEgdmFsaWQgdmFsdWUuJyxcbiAgICAgICk7XG4gICAgICBEZW5vLmV4aXQoMSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm91dHB1dCBhcyBmYWxzZSB8IHN0cmluZyB8IE1hcDxzdHJpbmcsIHN0cmluZz47XG4gIH1cbiAgLyoqXG4gICAqIEBuYW1lIHRvX2J1ZmZlclxuICAgKiBAcGFyYW0gZm9ybWF0IFNhc3NGb3JtYXRzIDogXCJjb21wcmVzc2VkXCIgfCBcImV4cGFuZGVkXCJcbiAgICogQHJldHVybnMgU2Fzc1xuICAgKi9cbiAgcHVibGljIHRvX2J1ZmZlcihmb3JtYXQ/OiBTYXNzRm9ybWF0cykge1xuICAgIGlmICh0aGlzLiNvdXRtb2RlID09PSAwKSB7XG4gICAgICBlcnJvcihgTm8gT3V0cHV0IG1vZGUgaGFzIGJlZW4gc2V0IGR1cmluZyB0aGUgcHJvY2Vzcy5gKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgIT09ICd1bmRlZmluZWQnKSB0aGlzLm9wdGlvbnMuc3R5bGUgPSBmb3JtYXQ7XG4gICAgaWYgKHRoaXMuI291dG1vZGUgPT09IDEpIHtcbiAgICAgIGlmICh0aGlzLiNtb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLm91dHB1dCA9IHRoaXMuZW5jb2Rlci5lbmNvZGUoXG4gICAgICAgICAgZGVub3Nhc3Muc3RyKHRoaXMuI2N1cnJlbnQgYXMgc3RyaW5nLCB0aGlzLm9wdGlvbnMpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vdXRwdXQgPSB0aGlzLmVuY29kZXIuZW5jb2RlKFxuICAgICAgICAgIGRlbm9zYXNzLmZpbGUodGhpcy4jY3VycmVudCBhcyBzdHJpbmcsIHRoaXMub3B0aW9ucyksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLiNvdXRtb2RlID09PSAyKSB7XG4gICAgICB0aGlzLm91dHB1dCA9IFsuLi4odGhpcy4jY3VycmVudCBhcyBNYXA8c3RyaW5nLCBzdHJpbmc+KV0ucmVkdWNlKFxuICAgICAgICAoYWNjLCBmaWxlKSA9PiB7XG4gICAgICAgICAgYWNjLnNldChcbiAgICAgICAgICAgIGZpbGVbMF0sXG4gICAgICAgICAgICB0aGlzLmVuY29kZXIuZW5jb2RlKFxuICAgICAgICAgICAgICBkZW5vc2Fzcy5maWxlKGZpbGVbMV0sIHRoaXMub3B0aW9ucyksXG4gICAgICAgICAgICApLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSxcbiAgICAgICAgbmV3IE1hcDxzdHJpbmcsIFVpbnQ4QXJyYXk+KCksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vdXRwdXQgYXNcbiAgICAgIHwgZmFsc2VcbiAgICAgIHwgVWludDhBcnJheVxuICAgICAgfCBNYXA8c3RyaW5nLCBzdHJpbmcgfCBVaW50OEFycmF5PjtcbiAgfVxuICAvKipcbiAgICogQG5hbWUgdG9fZmlsZVxuICAgKiBAZGVzY3JpcHRpb24gT3V0cHV0cyB0aGUgZmluaXNoZWQgZGF0YSB0byBmaWxlIGZvbGxvd2luZyBvdXRwdXQgb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHRvX2ZpbGUob3V0cHV0T3B0aW9uczogRXhwb3J0T3B0aW9ucykge1xuICAgIGlmIChvdXRwdXRPcHRpb25zLmRlc3REaXIubGVuZ3RoIDw9IDApIHtcbiAgICAgIGVycm9yKGBUaGUgb3V0cHV0IGRpciBzdHJpbmcgaXMgZW1wdHlgKTtcbiAgICAgIERlbm8uZXhpdCgxKTtcbiAgICB9XG4gICAgY29uc3Qgb3V0RGlycGF0aCA9IHBhdGgubm9ybWFsaXplKG91dHB1dE9wdGlvbnMuZGVzdERpcik7XG4gICAgbGV0IG91dEZpbGVFeHQgPSAnJztcbiAgICBpZiAoZXhpc3RzKG91dERpcnBhdGgsICdkaXInKSkge1xuICAgICAgZW1wdHlEaXJTeW5jKG91dERpcnBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnN1cmVEaXJTeW5jKG91dERpcnBhdGgpO1xuICAgIH1cbiAgICBzd2l0Y2ggKG91dHB1dE9wdGlvbnMuZm9ybWF0KSB7XG4gICAgICBjYXNlICdjb21wcmVzc2VkJzpcbiAgICAgICAgb3V0RmlsZUV4dCA9ICcubWluLmNzcyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXhwYW5kZWQnOlxuICAgICAgICBvdXRGaWxlRXh0ID0gJy5jc3MnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG91dEZpbGVFeHQgPSAnLm1pbi5jc3MnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUHJvY2Vzc2luZyB0aGUgZGF0YVxuICAgIHRoaXMudG9fc3RyaW5nKG91dHB1dE9wdGlvbnMuZm9ybWF0KTtcbiAgICBpZiAob3V0cHV0T3B0aW9ucy5kZXN0RmlsZSkge1xuICAgICAgY29uc3QgZmlsZXBhdGggPSBwYXRoLmZvcm1hdCh7XG4gICAgICAgIHJvb3Q6ICcuLycsXG4gICAgICAgIGRpcjogb3V0RGlycGF0aCxcbiAgICAgICAgbmFtZTogb3V0cHV0T3B0aW9ucy5kZXN0RmlsZSxcbiAgICAgICAgZXh0OiBvdXRGaWxlRXh0LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmaWxlVVJMID0gbmV3IFVSTChmaWxlcGF0aCwgYGZpbGU6Ly8ke0Rlbm8uY3dkKCl9L2ApO1xuICAgICAgaWYgKGV4aXN0cyhmaWxlcGF0aCwgJ2ZpbGUnKSkge1xuICAgICAgICBEZW5vLnJlbW92ZVN5bmMoZmlsZVVSTCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vdXRwdXQgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgdGhpcy5vdXRwdXQuZm9yRWFjaCgoUGFyc2VkQ1NzKSA9PiB7XG4gICAgICAgICAgRGVuby53cml0ZVRleHRGaWxlU3luYyhcbiAgICAgICAgICAgIGZpbGVVUkwsXG4gICAgICAgICAgICB0eXBlb2YgUGFyc2VkQ1NzICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICA/IHRoaXMuZGVjb2Rlci5kZWNvZGUoUGFyc2VkQ1NzKVxuICAgICAgICAgICAgICA6IFBhcnNlZENTcyxcbiAgICAgICAgICAgIHsgYXBwZW5kOiB0cnVlLCBjcmVhdGU6IHRydWUsIG1vZGU6IDY0NCB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGVuby53cml0ZVRleHRGaWxlU3luYyhcbiAgICAgICAgICBmaWxlVVJMLFxuICAgICAgICAgIHR5cGVvZiB0aGlzLm91dHB1dCAhPT0gJ3N0cmluZydcbiAgICAgICAgICAgID8gdGhpcy5kZWNvZGVyLmRlY29kZSh0aGlzLm91dHB1dClcbiAgICAgICAgICAgIDogdGhpcy5vdXRwdXQsXG4gICAgICAgICAgeyBhcHBlbmQ6IGZhbHNlLCBjcmVhdGU6IHRydWUsIG1vZGU6IDY0NCB9LFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vdXRwdXQgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgdGhpcy5vdXRwdXQuZm9yRWFjaCgoUGFyc2VkQ1NzLCBmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGVwYXRoID0gcGF0aC5mb3JtYXQoe1xuICAgICAgICAgICAgcm9vdDogJy4vJyxcbiAgICAgICAgICAgIGRpcjogb3V0RGlycGF0aCxcbiAgICAgICAgICAgIG5hbWU6IGZpbGVuYW1lLFxuICAgICAgICAgICAgZXh0OiBvdXRGaWxlRXh0LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnN0IGZpbGVVUkwgPSBuZXcgVVJMKGZpbGVwYXRoLCBgZmlsZTovLyR7RGVuby5jd2QoKX0vYCk7XG4gICAgICAgICAgaWYgKGV4aXN0cyhmaWxlcGF0aCwgJ2ZpbGUnKSkge1xuICAgICAgICAgICAgRGVuby5yZW1vdmVTeW5jKGZpbGVVUkwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBEZW5vLndyaXRlVGV4dEZpbGVTeW5jKFxuICAgICAgICAgICAgZmlsZVVSTCxcbiAgICAgICAgICAgIHR5cGVvZiBQYXJzZWRDU3MgIT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgID8gdGhpcy5kZWNvZGVyLmRlY29kZShQYXJzZWRDU3MpXG4gICAgICAgICAgICAgIDogUGFyc2VkQ1NzLFxuICAgICAgICAgICAgeyBhcHBlbmQ6IGZhbHNlLCBjcmVhdGU6IHRydWUsIG1vZGU6IDY0NCB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlsZXBhdGggPSBwYXRoLmZvcm1hdCh7XG4gICAgICAgICAgcm9vdDogJy4vJyxcbiAgICAgICAgICBkaXI6IG91dERpcnBhdGgsXG4gICAgICAgICAgbmFtZTogJ3VudGl0bGVkJyxcbiAgICAgICAgICBleHQ6IG91dEZpbGVFeHQsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBmaWxlVVJMID0gbmV3IFVSTChmaWxlcGF0aCwgYGZpbGU6Ly8ke0Rlbm8uY3dkKCl9L2ApO1xuICAgICAgICBpZiAoZXhpc3RzKGZpbGVwYXRoLCAnZmlsZScpKSB7XG4gICAgICAgICAgRGVuby5yZW1vdmVTeW5jKGZpbGVVUkwpO1xuICAgICAgICB9XG4gICAgICAgIERlbm8ud3JpdGVUZXh0RmlsZVN5bmMoXG4gICAgICAgICAgZmlsZVVSTCxcbiAgICAgICAgICB0eXBlb2YgdGhpcy5vdXRwdXQgIT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IHRoaXMuZGVjb2Rlci5kZWNvZGUodGhpcy5vdXRwdXQpXG4gICAgICAgICAgICA6IHRoaXMub3V0cHV0LFxuICAgICAgICAgIHsgYXBwZW5kOiBmYWxzZSwgY3JlYXRlOiB0cnVlLCBtb2RlOiA2NDQgfSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgLyoqICovXG4gICNjaGVja1R5cGUoKSB7XG4gICAgaWYgKCEodGhpcy4jaW5wdXQgaW5zdGFuY2VvZiBVaW50OEFycmF5KSkge1xuICAgICAgc3dpdGNoICh0eXBlb2YgdGhpcy4jaW5wdXQpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAoZXhpc3RzKHRoaXMuI2lucHV0LCAnZmlsZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLiNwcm9jZXNzRmlsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChleGlzdHModGhpcy4jaW5wdXQsICdkaXInKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy4jcHJvY2Vzc0RpcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy4jbW9kZSA9ICdzdHJpbmcnO1xuICAgICAgICAgICAgICB0aGlzLiNvdXRtb2RlID0gMTtcbiAgICAgICAgICAgICAgdGhpcy4jY3VycmVudCA9IHRoaXMuI2lucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0Jzoge1xuICAgICAgICAgIHJldHVybiB0aGlzLiNwcm9jZXNzT2JqZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4jaW5wdXQgPSBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUodGhpcy4jaW5wdXQpO1xuICAgICAgdGhpcy4jY2hlY2tUeXBlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gICNwcm9jZXNzRmlsZSgpIHtcbiAgICBjb25zdCBGaWxlUGF0aCA9IG5ldyBVUkwoXG4gICAgICB0aGlzLiNpbnB1dCBhcyBzdHJpbmcsXG4gICAgICBgZmlsZTovLyR7RGVuby5jd2QoKX0vYCxcbiAgICApO1xuICAgIGNvbnN0IGZpbGUgPSBEZW5vLnN0YXRTeW5jKEZpbGVQYXRoKTtcbiAgICBpZiAoZmlsZS5zaXplID09PSAwKSB7XG4gICAgICBlcnJvcihgVGhlIGZpbGUgeW91IHdhbnQgdG8gcmVhZCBpcyBlbXB0eS5gKTtcbiAgICB9XG4gICAgdGhpcy4jb3V0bW9kZSA9IDE7XG4gICAgdGhpcy4jY3VycmVudCA9IHRoaXMuI2lucHV0IGFzIHN0cmluZztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAjcHJvY2Vzc0RpcigpIHtcbiAgICBpZiAoISh0aGlzLiNjdXJyZW50IGluc3RhbmNlb2YgTWFwKSkge1xuICAgICAgdGhpcy4jY3VycmVudCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gICAgfVxuICAgIGZvciAoXG4gICAgICBjb25zdCBlbnRyeSBvZiB3YWxrU3luYyh0aGlzLiNpbnB1dCBhcyBzdHJpbmcsIHtcbiAgICAgICAgbWF4RGVwdGg6IDEsXG4gICAgICAgIGluY2x1ZGVEaXJzOiBmYWxzZSxcbiAgICAgICAgZXh0czogWycuc2NzcycsICcuc2FzcyddLFxuICAgICAgfSlcbiAgICApIHtcbiAgICAgIHRoaXMuI2N1cnJlbnQuc2V0KHBhdGgucGFyc2UoZW50cnkucGF0aCkubmFtZSwgZW50cnkucGF0aCk7XG4gICAgfVxuICAgIHRoaXMuI291dG1vZGUgPSAyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gICNwcm9jZXNzT2JqZWN0KCkge1xuICAgIGNvbnN0IHVybHMgPSB0aGlzLiNpbnB1dCBhcyBzdHJpbmdbXTtcbiAgICBpZiAoISh0aGlzLiNjdXJyZW50IGluc3RhbmNlb2YgTWFwKSkge1xuICAgICAgdGhpcy4jY3VycmVudCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gICAgfVxuICAgIHVybHMubWFwKChmaWxlUGF0aCkgPT4ge1xuICAgICAgaWYgKGV4aXN0cyhmaWxlUGF0aCwgJ2RpcicpKSB7XG4gICAgICAgIHRoaXMuI2N1cnJlbnQgPSB0aGlzLiNjdXJyZW50IGFzIE1hcDxzdHJpbmcsIHN0cmluZz47XG4gICAgICAgIHRoaXMuI2N1cnJlbnQuZGVsZXRlKGZpbGVQYXRoKTtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBjb25zdCBlbnRyeSBvZiB3YWxrU3luYyhmaWxlUGF0aCwge1xuICAgICAgICAgICAgbWF4RGVwdGg6IDEsXG4gICAgICAgICAgICBleHRzOiBbJy5zY3NzJywgJy5zYXNzJ10sXG4gICAgICAgICAgfSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy4jY3VycmVudC5zZXQocGF0aC5wYXJzZShlbnRyeS5wYXRoKS5uYW1lLCBlbnRyeS5wYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChleGlzdHMoZmlsZVBhdGgsICdmaWxlJykpIHtcbiAgICAgICAgY29uc3QgZmlsZVVSTCA9IHBhdGgucGFyc2UoZmlsZVBhdGgpO1xuICAgICAgICB0aGlzLiNjdXJyZW50ID0gdGhpcy4jY3VycmVudCBhcyBNYXA8c3RyaW5nLCBzdHJpbmc+O1xuICAgICAgICB0aGlzLiNjdXJyZW50LnNldChmaWxlVVJMLm5hbWUsIGZpbGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdhcm4oXG4gICAgICAgICAgYFRoZSBGaWxlICR7ZmlsZVBhdGgudHJpbSgpfSBkb2VzIG5vdCBleGlzdCBvciBpcyBub3QgYSB2YWxpZCBmaWxlYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLiNvdXRtb2RlID0gMjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuLyoqXG4gKiBAbmFtZSBzYXNzXG4gKiBAZGVzY3JpcHRpb24gQ29tcGlsZSBzYXNzIGZyb20gdGhlIGlucHV0XG4gKiBAcGFyYW0gaW5wdXQgc3RyaW5nW11cbiAqIEBwYXJhbSBfb3B0aW9ucyB1bmtub3duXG4gKiBAcmV0dXJucyBTYXNzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXNzKGlucHV0OiBJbnB1dFR5cGUsIG9wdGlvbnM/OiBTYXNzT3B0aW9ucyk6IFNhc3Mge1xuICByZXR1cm4gbmV3IFNhc3MoaW5wdXQsIG9wdGlvbnMpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0NBSUMsR0FDRCxTQUNFLFFBQVEsRUFDUixZQUFZLEVBQ1osYUFBYSxFQUNiLElBQUksRUFDSixRQUFRLFFBQ0gsWUFBWTtBQVFuQixPQUFPLE1BQU0sT0FBTyxDQUFDLE1BQ25CLFFBQVEsSUFBSSxDQUNWLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEVBQzFCLGlCQUNBLGlCQUNBLGlCQUNBLGtCQUNBO0FBQ0osT0FBTyxNQUFNLFFBQVEsQ0FBQyxNQUNwQixRQUFRLEtBQUssQ0FDWCxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxFQUMxQixpQkFDQSxjQUNBLGlCQUNBLGVBQ0E7QUFDSixPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQ2xCLFFBQVEsR0FBRyxDQUNULENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEVBQ3pCLGNBQ0EsZUFDQSxjQUNBLGdCQUNBO0FBRUo7Ozs7OztDQU1DLEdBQ0QsTUFBTSxTQUFTLENBQUMsVUFBa0IsUUFBMEI7SUFDMUQsSUFBSTtRQUNGLE1BQU0sVUFBVSxJQUFJLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDekQsTUFBTSxPQUFPLEtBQUssUUFBUSxDQUFDO1FBQzNCLElBQUksVUFBVSxRQUFRLE9BQU8sS0FBSyxNQUFNO2FBQ25DLElBQUksVUFBVSxPQUFPLE9BQU8sS0FBSyxXQUFXO2FBQzVDLE9BQU8sS0FBSyxN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