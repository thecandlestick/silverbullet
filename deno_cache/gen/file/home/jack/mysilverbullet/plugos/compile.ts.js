// import { esbuild } from "../../mod.ts";
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.14.54/wasm.js";
import * as esbuildNative from "https://deno.land/x/esbuild@v0.14.54/mod.js";
export const esbuild = Deno.run === undefined ? esbuildWasm : esbuildNative;
import { path } from "./deps.ts";
import { denoPlugin } from "./forked/esbuild_deno_loader/mod.ts";
import { patchDenoLibJS } from "./hack.ts";
function esBuildExternals(imports) {
    if (!imports) {
        return [];
    }
    const externals = [];
    for (const manifest of imports){
        for (const dep of Object.keys(manifest.dependencies || {})){
            if (!externals.includes(dep)) {
                externals.push(dep);
            }
        }
    }
    return externals;
}
export async function compile(filePath, functionName = undefined, options = {}) {
    const outFile = await Deno.makeTempFile({
        suffix: ".js"
    });
    let inFile = filePath;
    if (functionName) {
        // Generate a new file importing just this one function and exporting it
        inFile = await Deno.makeTempFile({
            suffix: ".ts"
        });
        await Deno.writeTextFile(inFile, `import {${functionName}} from "file://${// Replacaing \ with / for Windows
        path.resolve(filePath).replaceAll("\\", "\\\\")}";export default ${functionName};`);
    }
    // console.log("External modules", excludeModules);
    try {
        // TODO: Figure out how to make source maps work correctly with eval() code
        const result = await esbuild.build({
            entryPoints: [
                path.basename(inFile)
            ],
            bundle: true,
            format: "iife",
            globalName: "mod",
            platform: "browser",
            sourcemap: false,
            minify: !options.debug,
            outfile: outFile,
            metafile: options.info,
            external: esBuildExternals(options.imports),
            treeShaking: true,
            plugins: [
                denoPlugin({
                    // TODO do this differently
                    importMapURL: options.importMap || new URL("./../import_map.json", import.meta.url),
                    loader: "native"
                })
            ],
            absWorkingDir: path.resolve(path.dirname(inFile))
        });
        if (options.info) {
            const text = await esbuild.analyzeMetafile(result.metafile);
            console.log("Bundle info for", functionName, text);
        }
        let jsCode = await Deno.readTextFile(outFile);
        jsCode = patchDenoLibJS(jsCode);
        await Deno.remove(outFile);
        return `(() => { ${jsCode} return mod;})()`;
    } finally{
        if (inFile !== filePath) {
            await Deno.remove(inFile);
        }
    }
}
export async function compileModule(cwd, moduleName, options = {}) {
    const inFile = path.resolve(cwd, "_in.ts");
    await Deno.writeTextFile(inFile, `export * from "${moduleName}";`);
    const code = await compile(inFile, undefined, options);
    await Deno.remove(inFile);
    return code;
}
export async function sandboxCompile(filename, code, functionName, options = {}) {
    const tmpDir = await Deno.makeTempDir();
    await Deno.writeTextFile(`${tmpDir}/${filename}`, code);
    const jsCode = await compile(`${tmpDir}/${filename}`, functionName, options);
    await Deno.remove(tmpDir, {
        recursive: true
    });
    return jsCode;
}
export async function sandboxCompileModule(moduleUrl, options = {}) {
    await Deno.writeTextFile("_mod.ts", `module.exports = require("${moduleUrl}");`);
    const code = await compile("_mod.ts", undefined, options);
    await Deno.remove("_mod.ts");
    return code;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L3BsdWdvcy9jb21waWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IGVzYnVpbGQgfSBmcm9tIFwiLi4vLi4vbW9kLnRzXCI7XG5pbXBvcnQgKiBhcyBlc2J1aWxkV2FzbSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQveC9lc2J1aWxkQHYwLjE0LjU0L3dhc20uanNcIjtcbmltcG9ydCAqIGFzIGVzYnVpbGROYXRpdmUgZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3gvZXNidWlsZEB2MC4xNC41NC9tb2QuanNcIjtcblxuZXhwb3J0IGNvbnN0IGVzYnVpbGQ6IHR5cGVvZiBlc2J1aWxkV2FzbSA9IERlbm8ucnVuID09PSB1bmRlZmluZWRcbiAgPyBlc2J1aWxkV2FzbVxuICA6IGVzYnVpbGROYXRpdmU7XG5cbmltcG9ydCB7IHBhdGggfSBmcm9tIFwiLi9kZXBzLnRzXCI7XG5pbXBvcnQgeyBkZW5vUGx1Z2luIH0gZnJvbSBcIi4vZm9ya2VkL2VzYnVpbGRfZGVub19sb2FkZXIvbW9kLnRzXCI7XG5pbXBvcnQgeyBwYXRjaERlbm9MaWJKUyB9IGZyb20gXCIuL2hhY2sudHNcIjtcbmltcG9ydCB7IE1hbmlmZXN0IH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuZXhwb3J0IHR5cGUgQ29tcGlsZU9wdGlvbnMgPSB7XG4gIGRlYnVnPzogYm9vbGVhbjtcbiAgaW1wb3J0cz86IE1hbmlmZXN0PGFueT5bXTtcbiAgaW1wb3J0TWFwPzogVVJMO1xuICAvLyBSZWxvYWQgcGx1ZyBpbXBvcnQgY2FjaGVcbiAgcmVsb2FkPzogYm9vbGVhbjtcbiAgLy8gUHJpbnQgaW5mbyBvbiBidW5kbGUgc2l6ZVxuICBpbmZvPzogYm9vbGVhbjtcbn07XG5cbmZ1bmN0aW9uIGVzQnVpbGRFeHRlcm5hbHMoaW1wb3J0cz86IE1hbmlmZXN0PGFueT5bXSkge1xuICBpZiAoIWltcG9ydHMpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgZXh0ZXJuYWxzOiBzdHJpbmdbXSA9IFtdO1xuICBmb3IgKGNvbnN0IG1hbmlmZXN0IG9mIGltcG9ydHMpIHtcbiAgICBmb3IgKGNvbnN0IGRlcCBvZiBPYmplY3Qua2V5cyhtYW5pZmVzdC5kZXBlbmRlbmNpZXMgfHwge30pKSB7XG4gICAgICBpZiAoIWV4dGVybmFscy5pbmNsdWRlcyhkZXApKSB7XG4gICAgICAgIGV4dGVybmFscy5wdXNoKGRlcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBleHRlcm5hbHM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlKFxuICBmaWxlUGF0aDogc3RyaW5nLFxuICBmdW5jdGlvbk5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbiAgb3B0aW9uczogQ29tcGlsZU9wdGlvbnMgPSB7fSxcbik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IG91dEZpbGUgPSBhd2FpdCBEZW5vLm1ha2VUZW1wRmlsZSh7IHN1ZmZpeDogXCIuanNcIiB9KTtcbiAgbGV0IGluRmlsZSA9IGZpbGVQYXRoO1xuXG4gIGlmIChmdW5jdGlvbk5hbWUpIHtcbiAgICAvLyBHZW5lcmF0ZSBhIG5ldyBmaWxlIGltcG9ydGluZyBqdXN0IHRoaXMgb25lIGZ1bmN0aW9uIGFuZCBleHBvcnRpbmcgaXRcbiAgICBpbkZpbGUgPSBhd2FpdCBEZW5vLm1ha2VUZW1wRmlsZSh7IHN1ZmZpeDogXCIudHNcIiB9KTtcbiAgICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoXG4gICAgICBpbkZpbGUsXG4gICAgICBgaW1wb3J0IHske2Z1bmN0aW9uTmFtZX19IGZyb20gXCJmaWxlOi8vJHtcbiAgICAgICAgLy8gUmVwbGFjYWluZyBcXCB3aXRoIC8gZm9yIFdpbmRvd3NcbiAgICAgICAgcGF0aC5yZXNvbHZlKGZpbGVQYXRoKS5yZXBsYWNlQWxsKFxuICAgICAgICAgIFwiXFxcXFwiLFxuICAgICAgICAgIFwiXFxcXFxcXFxcIixcbiAgICAgICAgKX1cIjtleHBvcnQgZGVmYXVsdCAke2Z1bmN0aW9uTmFtZX07YCxcbiAgICApO1xuICB9XG5cbiAgLy8gY29uc29sZS5sb2coXCJFeHRlcm5hbCBtb2R1bGVzXCIsIGV4Y2x1ZGVNb2R1bGVzKTtcblxuICB0cnkge1xuICAgIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIG1ha2Ugc291cmNlIG1hcHMgd29yayBjb3JyZWN0bHkgd2l0aCBldmFsKCkgY29kZVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGVzYnVpbGQuYnVpbGQoe1xuICAgICAgZW50cnlQb2ludHM6IFtwYXRoLmJhc2VuYW1lKGluRmlsZSldLFxuICAgICAgYnVuZGxlOiB0cnVlLFxuICAgICAgZm9ybWF0OiBcImlpZmVcIixcbiAgICAgIGdsb2JhbE5hbWU6IFwibW9kXCIsXG4gICAgICBwbGF0Zm9ybTogXCJicm93c2VyXCIsXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLCAvL2RlYnVnID8gXCJpbmxpbmVcIiA6IGZhbHNlLFxuICAgICAgbWluaWZ5OiAhb3B0aW9ucy5kZWJ1ZyxcbiAgICAgIG91dGZpbGU6IG91dEZpbGUsXG4gICAgICBtZXRhZmlsZTogb3B0aW9ucy5pbmZvLFxuICAgICAgZXh0ZXJuYWw6IGVzQnVpbGRFeHRlcm5hbHMob3B0aW9ucy5pbXBvcnRzKSxcbiAgICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBkZW5vUGx1Z2luKHtcbiAgICAgICAgICAvLyBUT0RPIGRvIHRoaXMgZGlmZmVyZW50bHlcbiAgICAgICAgICBpbXBvcnRNYXBVUkw6IG9wdGlvbnMuaW1wb3J0TWFwIHx8XG4gICAgICAgICAgICBuZXcgVVJMKFwiLi8uLi9pbXBvcnRfbWFwLmpzb25cIiwgaW1wb3J0Lm1ldGEudXJsKSxcbiAgICAgICAgICBsb2FkZXI6IFwibmF0aXZlXCIsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICAgIGFic1dvcmtpbmdEaXI6IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoaW5GaWxlKSksXG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy5pbmZvKSB7XG4gICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZXNidWlsZC5hbmFseXplTWV0YWZpbGUocmVzdWx0Lm1ldGFmaWxlISk7XG4gICAgICBjb25zb2xlLmxvZyhcIkJ1bmRsZSBpbmZvIGZvclwiLCBmdW5jdGlvbk5hbWUsIHRleHQpO1xuICAgIH1cblxuICAgIGxldCBqc0NvZGUgPSBhd2FpdCBEZW5vLnJlYWRUZXh0RmlsZShvdXRGaWxlKTtcbiAgICBqc0NvZGUgPSBwYXRjaERlbm9MaWJKUyhqc0NvZGUpO1xuICAgIGF3YWl0IERlbm8ucmVtb3ZlKG91dEZpbGUpO1xuICAgIHJldHVybiBgKCgpID0+IHsgJHtqc0NvZGV9IHJldHVybiBtb2Q7fSkoKWA7XG4gIH0gZmluYWxseSB7XG4gICAgaWYgKGluRmlsZSAhPT0gZmlsZVBhdGgpIHtcbiAgICAgIGF3YWl0IERlbm8ucmVtb3ZlKGluRmlsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21waWxlTW9kdWxlKFxuICBjd2Q6IHN0cmluZyxcbiAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHt9LFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgaW5GaWxlID0gcGF0aC5yZXNvbHZlKGN3ZCwgXCJfaW4udHNcIik7XG4gIGF3YWl0IERlbm8ud3JpdGVUZXh0RmlsZShpbkZpbGUsIGBleHBvcnQgKiBmcm9tIFwiJHttb2R1bGVOYW1lfVwiO2ApO1xuICBjb25zdCBjb2RlID0gYXdhaXQgY29tcGlsZShpbkZpbGUsIHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gIGF3YWl0IERlbm8ucmVtb3ZlKGluRmlsZSk7XG4gIHJldHVybiBjb2RlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2FuZGJveENvbXBpbGUoXG4gIGZpbGVuYW1lOiBzdHJpbmcsXG4gIGNvZGU6IHN0cmluZyxcbiAgZnVuY3Rpb25OYW1lPzogc3RyaW5nLFxuICBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHt9LFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgdG1wRGlyID0gYXdhaXQgRGVuby5tYWtlVGVtcERpcigpO1xuXG4gIGF3YWl0IERlbm8ud3JpdGVUZXh0RmlsZShgJHt0bXBEaXJ9LyR7ZmlsZW5hbWV9YCwgY29kZSk7XG4gIGNvbnN0IGpzQ29kZSA9IGF3YWl0IGNvbXBpbGUoXG4gICAgYCR7dG1wRGlyfS8ke2ZpbGVuYW1lfWAsXG4gICAgZnVuY3Rpb25OYW1lLFxuICAgIG9wdGlvbnMsXG4gICk7XG4gIGF3YWl0IERlbm8ucmVtb3ZlKHRtcERpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIHJldHVybiBqc0NvZGU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYW5kYm94Q29tcGlsZU1vZHVsZShcbiAgbW9kdWxlVXJsOiBzdHJpbmcsXG4gIG9wdGlvbnM6IENvbXBpbGVPcHRpb25zID0ge30sXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoXG4gICAgXCJfbW9kLnRzXCIsXG4gICAgYG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIiR7bW9kdWxlVXJsfVwiKTtgLFxuICApO1xuICBjb25zdCBjb2RlID0gYXdhaXQgY29tcGlsZShcIl9tb2QudHNcIiwgdW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgYXdhaXQgRGVuby5yZW1vdmUoXCJfbW9kLnRzXCIpO1xuICByZXR1cm4gY29kZTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQ0FBMEM7QUFDMUMsWUFBWSxpQkFBaUIsK0NBQStDO0FBQzVFLFlBQVksbUJBQW1CLDhDQUE4QztBQUU3RSxPQUFPLE1BQU0sVUFBOEIsS0FBSyxHQUFHLEtBQUssWUFDcEQsY0FDQSxhQUFhLENBQUM7QUFFbEIsU0FBUyxJQUFJLFFBQVEs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