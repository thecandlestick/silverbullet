// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { Buffer } from "../io/buffer.ts";
const DEFAULT_CHUNK_SIZE = 16_640;
const DEFAULT_BUFFER_SIZE = 32 * 1024;
function isCloser(value) {
    return typeof value === "object" && value != null && "close" in value && // deno-lint-ignore no-explicit-any
    typeof value["close"] === "function";
}
/** Create a `Deno.Reader` from an iterable of `Uint8Array`s.
 *
 * ```ts
 *      import { readerFromIterable, copy } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 *      const file = await Deno.open("metrics.txt", { write: true });
 *      const reader = readerFromIterable((async function* () {
 *        while (true) {
 *          await new Promise((r) => setTimeout(r, 1000));
 *          const message = `data: ${JSON.stringify(Deno.metrics())}\n\n`;
 *          yield new TextEncoder().encode(message);
 *        }
 *      })());
 *      await copy(reader, file);
 * ```
 */ export function readerFromIterable(iterable) {
    const iterator = iterable[Symbol.asyncIterator]?.() ?? iterable[Symbol.iterator]?.();
    const buffer = new Buffer();
    return {
        async read (p) {
            if (buffer.length == 0) {
                const result = await iterator.next();
                if (result.done) {
                    return null;
                } else {
                    if (result.value.byteLength <= p.byteLength) {
                        p.set(result.value);
                        return result.value.byteLength;
                    }
                    p.set(result.value.subarray(0, p.byteLength));
                    await writeAll(buffer, result.value.subarray(p.byteLength));
                    return p.byteLength;
                }
            } else {
                const n = await buffer.read(p);
                if (n == null) {
                    return this.read(p);
                }
                return n;
            }
        }
    };
}
/** Create a `Writer` from a `WritableStreamDefaultWriter`. */ export function writerFromStreamWriter(streamWriter) {
    return {
        async write (p) {
            await streamWriter.ready;
            await streamWriter.write(p);
            return p.length;
        }
    };
}
/** Create a `Reader` from a `ReadableStreamDefaultReader`. */ export function readerFromStreamReader(streamReader) {
    const buffer = new Buffer();
    return {
        async read (p) {
            if (buffer.empty()) {
                const res = await streamReader.read();
                if (res.done) {
                    return null; // EOF
                }
                await writeAll(buffer, res.value);
            }
            return buffer.read(p);
        }
    };
}
/** Create a `WritableStream` from a `Writer`. */ export function writableStreamFromWriter(writer, options = {}) {
    const { autoClose =true  } = options;
    return new WritableStream({
        async write (chunk, controller) {
            try {
                await writeAll(writer, chunk);
            } catch (e) {
                controller.error(e);
                if (isCloser(writer) && autoClose) {
                    writer.close();
                }
            }
        },
        close () {
            if (isCloser(writer) && autoClose) {
                writer.close();
            }
        },
        abort () {
            if (isCloser(writer) && autoClose) {
                writer.close();
            }
        }
    });
}
/** Create a `ReadableStream` from any kind of iterable.
 *
 * ```ts
 *      import { readableStreamFromIterable } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 *      const r1 = readableStreamFromIterable(["foo, bar, baz"]);
 *      const r2 = readableStreamFromIterable(async function* () {
 *        await new Promise(((r) => setTimeout(r, 1000)));
 *        yield "foo";
 *        await new Promise(((r) => setTimeout(r, 1000)));
 *        yield "bar";
 *        await new Promise(((r) => setTimeout(r, 1000)));
 *        yield "baz";
 *      }());
 * ```
 *
 * If the produced iterator (`iterable[Symbol.asyncIterator]()` or
 * `iterable[Symbol.iterator]()`) is a generator, or more specifically is found
 * to have a `.throw()` method on it, that will be called upon
 * `readableStream.cancel()`. This is the case for the second input type above:
 *
 * ```ts
 * import { readableStreamFromIterable } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * const r3 = readableStreamFromIterable(async function* () {
 *   try {
 *     yield "foo";
 *   } catch (error) {
 *     console.log(error); // Error: Cancelled by consumer.
 *   }
 * }());
 * const reader = r3.getReader();
 * console.log(await reader.read()); // { value: "foo", done: false }
 * await reader.cancel(new Error("Cancelled by consumer."));
 * ```
 */ export function readableStreamFromIterable(iterable) {
    const iterator = iterable[Symbol.asyncIterator]?.() ?? iterable[Symbol.iterator]?.();
    return new ReadableStream({
        async pull (controller) {
            const { value , done  } = await iterator.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
        async cancel (reason) {
            if (typeof iterator.throw == "function") {
                try {
                    await iterator.throw(reason);
                } catch  {}
            }
        }
    });
}
/**
 * Convert the generator function into a TransformStream.
 *
 * ```ts
 * import { readableStreamFromIterable, toTransformStream } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * const readable = readableStreamFromIterable([0, 1, 2])
 *   .pipeThrough(toTransformStream(async function* (src) {
 *     for await (const chunk of src) {
 *       yield chunk * 100;
 *     }
 *   }));
 *
 * for await (const chunk of readable) {
 *   console.log(chunk);
 * }
 * // output: 0, 100, 200
 * ```
 *
 * @param transformer A function to transform.
 * @param writableStrategy An object that optionally defines a queuing strategy for the stream.
 * @param readableStrategy An object that optionally defines a queuing strategy for the stream.
 */ export function toTransformStream(transformer, writableStrategy, readableStrategy) {
    const { writable , readable  } = new TransformStream(undefined, writableStrategy);
    const iterable = transformer(readable);
    const iterator = iterable[Symbol.asyncIterator]?.() ?? iterable[Symbol.iterator]?.();
    return {
        writable,
        readable: new ReadableStream({
            async pull (controller) {
                let result;
                try {
                    result = await iterator.next();
                } catch (error) {
                    // Propagate error to stream from iterator
                    // If the stream status is "errored", it will be thrown, but ignore.
                    await readable.cancel(error).catch(()=>{});
                    controller.error(error);
                    return;
                }
                if (result.done) {
                    controller.close();
                    return;
                }
                controller.enqueue(result.value);
            },
            async cancel (reason) {
                // Propagate cancellation to readable and iterator
                if (typeof iterator.throw == "function") {
                    try {
                        await iterator.throw(reason);
                    } catch  {
                    /* `iterator.throw()` always throws on site. We catch it. */ }
                }
                await readable.cancel(reason);
            }
        }, readableStrategy)
    };
}
/**
 * Create a `ReadableStream<Uint8Array>` from from a `Deno.Reader`.
 *
 * When the pull algorithm is called on the stream, a chunk from the reader
 * will be read.  When `null` is returned from the reader, the stream will be
 * closed along with the reader (if it is also a `Deno.Closer`).
 *
 * An example converting a `Deno.FsFile` into a readable stream:
 *
 * ```ts
 * import { readableStreamFromReader } from "https://deno.land/std@$STD_VERSION/streams/mod.ts";
 *
 * const file = await Deno.open("./file.txt", { read: true });
 * const fileStream = readableStreamFromReader(file);
 * ```
 */ export function readableStreamFromReader(reader, options = {}) {
    const { autoClose =true , chunkSize =DEFAULT_CHUNK_SIZE , strategy  } = options;
    return new ReadableStream({
        async pull (controller) {
            const chunk = new Uint8Array(chunkSize);
            try {
                const read = await reader.read(chunk);
                if (read === null) {
                    if (isCloser(reader) && autoClose) {
                        reader.close();
                    }
                    controller.close();
                    return;
                }
                controller.enqueue(chunk.subarray(0, read));
            } catch (e) {
                controller.error(e);
                if (isCloser(reader)) {
                    reader.close();
                }
            }
        },
        cancel () {
            if (isCloser(reader) && autoClose) {
                reader.close();
            }
        }
    }, strategy);
}
/** Read Reader `r` until EOF (`null`) and resolve to the content as
 * Uint8Array`.
 *
 * ```ts
 * import { Buffer } from "https://deno.land/std@$STD_VERSION/io/buffer.ts";
 * import { readAll } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * // Example from stdin
 * const stdinContent = await readAll(Deno.stdin);
 *
 * // Example from file
 * const file = await Deno.open("my_file.txt", {read: true});
 * const myFileContent = await readAll(file);
 * file.close();
 *
 * // Example from buffer
 * const myData = new Uint8Array(100);
 * // ... fill myData array with data
 * const reader = new Buffer(myData.buffer);
 * const bufferContent = await readAll(reader);
 * ```
 */ export async function readAll(r) {
    const buf = new Buffer();
    await buf.readFrom(r);
    return buf.bytes();
}
/** Synchronously reads Reader `r` until EOF (`null`) and returns the content
 * as `Uint8Array`.
 *
 * ```ts
 * import { Buffer } from "https://deno.land/std@$STD_VERSION/io/buffer.ts";
 * import { readAllSync } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * // Example from stdin
 * const stdinContent = readAllSync(Deno.stdin);
 *
 * // Example from file
 * const file = Deno.openSync("my_file.txt", {read: true});
 * const myFileContent = readAllSync(file);
 * file.close();
 *
 * // Example from buffer
 * const myData = new Uint8Array(100);
 * // ... fill myData array with data
 * const reader = new Buffer(myData.buffer);
 * const bufferContent = readAllSync(reader);
 * ```
 */ export function readAllSync(r) {
    const buf = new Buffer();
    buf.readFromSync(r);
    return buf.bytes();
}
/** Write all the content of the array buffer (`arr`) to the writer (`w`).
 *
 * ```ts
 * import { Buffer } from "https://deno.land/std@$STD_VERSION/io/buffer.ts";
 * import { writeAll } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";

 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * await writeAll(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * const file = await Deno.open('test.file', {write: true});
 * await writeAll(file, contentBytes);
 * file.close();
 *
 * // Example writing to buffer
 * contentBytes = new TextEncoder().encode("Hello World");
 * const writer = new Buffer();
 * await writeAll(writer, contentBytes);
 * console.log(writer.bytes().length);  // 11
 * ```
 */ export async function writeAll(w, arr) {
    let nwritten = 0;
    while(nwritten < arr.length){
        nwritten += await w.write(arr.subarray(nwritten));
    }
}
/** Synchronously write all the content of the array buffer (`arr`) to the
 * writer (`w`).
 *
 * ```ts
 * import { Buffer } from "https://deno.land/std@$STD_VERSION/io/buffer.ts";
 * import { writeAllSync } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * // Example writing to stdout
 * let contentBytes = new TextEncoder().encode("Hello World");
 * writeAllSync(Deno.stdout, contentBytes);
 *
 * // Example writing to file
 * contentBytes = new TextEncoder().encode("Hello World");
 * const file = Deno.openSync('test.file', {write: true});
 * writeAllSync(file, contentBytes);
 * file.close();
 *
 * // Example writing to buffer
 * contentBytes = new TextEncoder().encode("Hello World");
 * const writer = new Buffer();
 * writeAllSync(writer, contentBytes);
 * console.log(writer.bytes().length);  // 11
 * ```
 */ export function writeAllSync(w, arr) {
    let nwritten = 0;
    while(nwritten < arr.length){
        nwritten += w.writeSync(arr.subarray(nwritten));
    }
}
/** Turns a Reader, `r`, into an async iterator.
 *
 * ```ts
 * import { iterateReader } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * let f = await Deno.open("/etc/passwd");
 * for await (const chunk of iterateReader(f)) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * ```ts
 * import { iterateReader } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * let f = await Deno.open("/etc/passwd");
 * const it = iterateReader(f, {
 *   bufSize: 1024 * 1024
 * });
 * for await (const chunk of it) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 */ export async function* iterateReader(r, options) {
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    while(true){
        const result = await r.read(b);
        if (result === null) {
            break;
        }
        yield b.slice(0, result);
    }
}
/** Turns a ReaderSync, `r`, into an iterator.
 *
 * ```ts
 * import { iterateReaderSync } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * let f = Deno.openSync("/etc/passwd");
 * for (const chunk of iterateReaderSync(f)) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Second argument can be used to tune size of a buffer.
 * Default size of the buffer is 32kB.
 *
 * ```ts
 * import { iterateReaderSync } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";

 * let f = await Deno.open("/etc/passwd");
 * const iter = iterateReaderSync(f, {
 *   bufSize: 1024 * 1024
 * });
 * for (const chunk of iter) {
 *   console.log(chunk);
 * }
 * f.close();
 * ```
 *
 * Iterator uses an internal buffer of fixed size for efficiency; it returns
 * a view on that buffer on each iteration. It is therefore caller's
 * responsibility to copy contents of the buffer if needed; otherwise the
 * next iteration will overwrite contents of previously returned chunk.
 */ export function* iterateReaderSync(r, options) {
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    while(true){
        const result = r.readSync(b);
        if (result === null) {
            break;
        }
        yield b.slice(0, result);
    }
}
/** Copies from `src` to `dst` until either EOF (`null`) is read from `src` or
 * an error occurs. It resolves to the number of bytes copied or rejects with
 * the first error encountered while copying.
 *
 * ```ts
 * import { copy } from "https://deno.land/std@$STD_VERSION/streams/conversion.ts";
 *
 * const source = await Deno.open("my_file.txt");
 * const bytesCopied1 = await copy(source, Deno.stdout);
 * const destination = await Deno.create("my_file_2.txt");
 * const bytesCopied2 = await copy(source, destination);
 * ```
 *
 * @param src The source to copy from
 * @param dst The destination to copy to
 * @param options Can be used to tune size of the buffer. Default size is 32kB
 */ export async function copy(src, dst, options) {
    let n = 0;
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    let gotEOF = false;
    while(gotEOF === false){
        const result = await src.read(b);
        if (result === null) {
            gotEOF = true;
        } else {
            let nwritten = 0;
            while(nwritten < result){
                nwritten += await dst.write(b.subarray(nwritten, result));
            }
            n += nwritten;
        }
    }
    return n;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL3N0cmVhbXMvY29udmVyc2lvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiLi4vaW8vYnVmZmVyLnRzXCI7XG5cbmNvbnN0IERFRkFVTFRfQ0hVTktfU0laRSA9IDE2XzY0MDtcbmNvbnN0IERFRkFVTFRfQlVGRkVSX1NJWkUgPSAzMiAqIDEwMjQ7XG5cbmZ1bmN0aW9uIGlzQ2xvc2VyKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgRGVuby5DbG9zZXIge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9IG51bGwgJiYgXCJjbG9zZVwiIGluIHZhbHVlICYmXG4gICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgICB0eXBlb2YgKHZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIGFueT4pW1wiY2xvc2VcIl0gPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLyoqIENyZWF0ZSBhIGBEZW5vLlJlYWRlcmAgZnJvbSBhbiBpdGVyYWJsZSBvZiBgVWludDhBcnJheWBzLlxuICpcbiAqIGBgYHRzXG4gKiAgICAgIGltcG9ydCB7IHJlYWRlckZyb21JdGVyYWJsZSwgY29weSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL3N0cmVhbXMvY29udmVyc2lvbi50c1wiO1xuICpcbiAqICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IERlbm8ub3BlbihcIm1ldHJpY3MudHh0XCIsIHsgd3JpdGU6IHRydWUgfSk7XG4gKiAgICAgIGNvbnN0IHJlYWRlciA9IHJlYWRlckZyb21JdGVyYWJsZSgoYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAqICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICogICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgMTAwMCkpO1xuICogICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBkYXRhOiAke0pTT04uc3RyaW5naWZ5KERlbm8ubWV0cmljcygpKX1cXG5cXG5gO1xuICogICAgICAgICAgeWllbGQgbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKG1lc3NhZ2UpO1xuICogICAgICAgIH1cbiAqICAgICAgfSkoKSk7XG4gKiAgICAgIGF3YWl0IGNvcHkocmVhZGVyLCBmaWxlKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZGVyRnJvbUl0ZXJhYmxlKFxuICBpdGVyYWJsZTogSXRlcmFibGU8VWludDhBcnJheT4gfCBBc3luY0l0ZXJhYmxlPFVpbnQ4QXJyYXk+LFxuKTogRGVuby5SZWFkZXIge1xuICBjb25zdCBpdGVyYXRvcjogSXRlcmF0b3I8VWludDhBcnJheT4gfCBBc3luY0l0ZXJhdG9yPFVpbnQ4QXJyYXk+ID1cbiAgICAoaXRlcmFibGUgYXMgQXN5bmNJdGVyYWJsZTxVaW50OEFycmF5PilbU3ltYm9sLmFzeW5jSXRlcmF0b3JdPy4oKSA/P1xuICAgICAgKGl0ZXJhYmxlIGFzIEl0ZXJhYmxlPFVpbnQ4QXJyYXk+KVtTeW1ib2wuaXRlcmF0b3JdPy4oKTtcbiAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcigpO1xuICByZXR1cm4ge1xuICAgIGFzeW5jIHJlYWQocDogVWludDhBcnJheSk6IFByb21pc2U8bnVtYmVyIHwgbnVsbD4ge1xuICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPT0gMCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChyZXN1bHQudmFsdWUuYnl0ZUxlbmd0aCA8PSBwLmJ5dGVMZW5ndGgpIHtcbiAgICAgICAgICAgIHAuc2V0KHJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHAuc2V0KHJlc3VsdC52YWx1ZS5zdWJhcnJheSgwLCBwLmJ5dGVMZW5ndGgpKTtcbiAgICAgICAgICBhd2FpdCB3cml0ZUFsbChidWZmZXIsIHJlc3VsdC52YWx1ZS5zdWJhcnJheShwLmJ5dGVMZW5ndGgpKTtcbiAgICAgICAgICByZXR1cm4gcC5ieXRlTGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuID0gYXdhaXQgYnVmZmVyLnJlYWQocCk7XG4gICAgICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkKHApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbi8qKiBDcmVhdGUgYSBgV3JpdGVyYCBmcm9tIGEgYFdyaXRhYmxlU3RyZWFtRGVmYXVsdFdyaXRlcmAuICovXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVyRnJvbVN0cmVhbVdyaXRlcihcbiAgc3RyZWFtV3JpdGVyOiBXcml0YWJsZVN0cmVhbURlZmF1bHRXcml0ZXI8VWludDhBcnJheT4sXG4pOiBEZW5vLldyaXRlciB7XG4gIHJldHVybiB7XG4gICAgYXN5bmMgd3JpdGUocDogVWludDhBcnJheSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICBhd2FpdCBzdHJlYW1Xcml0ZXIucmVhZHk7XG4gICAgICBhd2FpdCBzdHJlYW1Xcml0ZXIud3JpdGUocCk7XG4gICAgICByZXR1cm4gcC5sZW5ndGg7XG4gICAgfSxcbiAgfTtcbn1cblxuLyoqIENyZWF0ZSBhIGBSZWFkZXJgIGZyb20gYSBgUmVhZGFibGVTdHJlYW1EZWZhdWx0UmVhZGVyYC4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkZXJGcm9tU3RyZWFtUmVhZGVyKFxuICBzdHJlYW1SZWFkZXI6IFJlYWRhYmxlU3RyZWFtRGVmYXVsdFJlYWRlcjxVaW50OEFycmF5Pixcbik6IERlbm8uUmVhZGVyIHtcbiAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcigpO1xuXG4gIHJldHVybiB7XG4gICAgYXN5bmMgcmVhZChwOiBVaW50OEFycmF5KTogUHJvbWlzZTxudW1iZXIgfCBudWxsPiB7XG4gICAgICBpZiAoYnVmZmVyLmVtcHR5KCkpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgc3RyZWFtUmVhZGVyLnJlYWQoKTtcbiAgICAgICAgaWYgKHJlcy5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7IC8vIEVPRlxuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgd3JpdGVBbGwoYnVmZmVyLCByZXMudmFsdWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnVmZmVyLnJlYWQocCk7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXcml0YWJsZVN0cmVhbUZyb21Xcml0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIElmIHRoZSBgd3JpdGVyYCBpcyBhbHNvIGEgYERlbm8uQ2xvc2VyYCwgYXV0b21hdGljYWxseSBjbG9zZSB0aGUgYHdyaXRlcmBcbiAgICogd2hlbiB0aGUgc3RyZWFtIGlzIGNsb3NlZCwgYWJvcnRlZCwgb3IgYSB3cml0ZSBlcnJvciBvY2N1cnMuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGB0cnVlYC4gKi9cbiAgYXV0b0Nsb3NlPzogYm9vbGVhbjtcbn1cblxuLyoqIENyZWF0ZSBhIGBXcml0YWJsZVN0cmVhbWAgZnJvbSBhIGBXcml0ZXJgLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyaXRhYmxlU3RyZWFtRnJvbVdyaXRlcihcbiAgd3JpdGVyOiBEZW5vLldyaXRlcixcbiAgb3B0aW9uczogV3JpdGFibGVTdHJlYW1Gcm9tV3JpdGVyT3B0aW9ucyA9IHt9LFxuKTogV3JpdGFibGVTdHJlYW08VWludDhBcnJheT4ge1xuICBjb25zdCB7IGF1dG9DbG9zZSA9IHRydWUgfSA9IG9wdGlvbnM7XG5cbiAgcmV0dXJuIG5ldyBXcml0YWJsZVN0cmVhbSh7XG4gICAgYXN5bmMgd3JpdGUoY2h1bmssIGNvbnRyb2xsZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHdyaXRlQWxsKHdyaXRlciwgY2h1bmspO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb250cm9sbGVyLmVycm9yKGUpO1xuICAgICAgICBpZiAoaXNDbG9zZXIod3JpdGVyKSAmJiBhdXRvQ2xvc2UpIHtcbiAgICAgICAgICB3cml0ZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xvc2UoKSB7XG4gICAgICBpZiAoaXNDbG9zZXIod3JpdGVyKSAmJiBhdXRvQ2xvc2UpIHtcbiAgICAgICAgd3JpdGVyLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhYm9ydCgpIHtcbiAgICAgIGlmIChpc0Nsb3Nlcih3cml0ZXIpICYmIGF1dG9DbG9zZSkge1xuICAgICAgICB3cml0ZXIuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcbn1cblxuLyoqIENyZWF0ZSBhIGBSZWFkYWJsZVN0cmVhbWAgZnJvbSBhbnkga2luZCBvZiBpdGVyYWJsZS5cbiAqXG4gKiBgYGB0c1xuICogICAgICBpbXBvcnQgeyByZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL3N0cmVhbXMvY29udmVyc2lvbi50c1wiO1xuICpcbiAqICAgICAgY29uc3QgcjEgPSByZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZShbXCJmb28sIGJhciwgYmF6XCJdKTtcbiAqICAgICAgY29uc3QgcjIgPSByZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZShhc3luYyBmdW5jdGlvbiogKCkge1xuICogICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKCgocikgPT4gc2V0VGltZW91dChyLCAxMDAwKSkpO1xuICogICAgICAgIHlpZWxkIFwiZm9vXCI7XG4gKiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKChyKSA9PiBzZXRUaW1lb3V0KHIsIDEwMDApKSk7XG4gKiAgICAgICAgeWllbGQgXCJiYXJcIjtcbiAqICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgoKHIpID0+IHNldFRpbWVvdXQociwgMTAwMCkpKTtcbiAqICAgICAgICB5aWVsZCBcImJhelwiO1xuICogICAgICB9KCkpO1xuICogYGBgXG4gKlxuICogSWYgdGhlIHByb2R1Y2VkIGl0ZXJhdG9yIChgaXRlcmFibGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKClgIG9yXG4gKiBgaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpYCkgaXMgYSBnZW5lcmF0b3IsIG9yIG1vcmUgc3BlY2lmaWNhbGx5IGlzIGZvdW5kXG4gKiB0byBoYXZlIGEgYC50aHJvdygpYCBtZXRob2Qgb24gaXQsIHRoYXQgd2lsbCBiZSBjYWxsZWQgdXBvblxuICogYHJlYWRhYmxlU3RyZWFtLmNhbmNlbCgpYC4gVGhpcyBpcyB0aGUgY2FzZSBmb3IgdGhlIHNlY29uZCBpbnB1dCB0eXBlIGFib3ZlOlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyByZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL3N0cmVhbXMvY29udmVyc2lvbi50c1wiO1xuICpcbiAqIGNvbnN0IHIzID0gcmVhZGFibGVTdHJlYW1Gcm9tSXRlcmFibGUoYXN5bmMgZnVuY3Rpb24qICgpIHtcbiAqICAgdHJ5IHtcbiAqICAgICB5aWVsZCBcImZvb1wiO1xuICogICB9IGNhdGNoIChlcnJvcikge1xuICogICAgIGNvbnNvbGUubG9nKGVycm9yKTsgLy8gRXJyb3I6IENhbmNlbGxlZCBieSBjb25zdW1lci5cbiAqICAgfVxuICogfSgpKTtcbiAqIGNvbnN0IHJlYWRlciA9IHIzLmdldFJlYWRlcigpO1xuICogY29uc29sZS5sb2coYXdhaXQgcmVhZGVyLnJlYWQoKSk7IC8vIHsgdmFsdWU6IFwiZm9vXCIsIGRvbmU6IGZhbHNlIH1cbiAqIGF3YWl0IHJlYWRlci5jYW5jZWwobmV3IEVycm9yKFwiQ2FuY2VsbGVkIGJ5IGNvbnN1bWVyLlwiKSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWRhYmxlU3RyZWFtRnJvbUl0ZXJhYmxlPFQ+KFxuICBpdGVyYWJsZTogSXRlcmFibGU8VD4gfCBBc3luY0l0ZXJhYmxlPFQ+LFxuKTogUmVhZGFibGVTdHJlYW08VD4ge1xuICBjb25zdCBpdGVyYXRvcjogSXRlcmF0b3I8VD4gfCBBc3luY0l0ZXJhdG9yPFQ+ID1cbiAgICAoaXRlcmFibGUgYXMgQXN5bmNJdGVyYWJsZTxUPilbU3ltYm9sLmFzeW5jSXRlcmF0b3JdPy4oKSA/P1xuICAgICAgKGl0ZXJhYmxlIGFzIEl0ZXJhYmxlPFQ+KVtTeW1ib2wuaXRlcmF0b3JdPy4oKTtcbiAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICBjb25zdCB7IHZhbHVlLCBkb25lIH0gPSBhd2FpdCBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250cm9sbGVyLmVucXVldWUodmFsdWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgY2FuY2VsKHJlYXNvbikge1xuICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvci50aHJvdyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBpdGVyYXRvci50aHJvdyhyZWFzb24pO1xuICAgICAgICB9IGNhdGNoIHsgLyogYGl0ZXJhdG9yLnRocm93KClgIGFsd2F5cyB0aHJvd3Mgb24gc2l0ZS4gV2UgY2F0Y2ggaXQuICovIH1cbiAgICAgIH1cbiAgICB9LFxuICB9KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaW50byBhIFRyYW5zZm9ybVN0cmVhbS5cbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgcmVhZGFibGVTdHJlYW1Gcm9tSXRlcmFibGUsIHRvVHJhbnNmb3JtU3RyZWFtIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vc3RyZWFtcy9jb252ZXJzaW9uLnRzXCI7XG4gKlxuICogY29uc3QgcmVhZGFibGUgPSByZWFkYWJsZVN0cmVhbUZyb21JdGVyYWJsZShbMCwgMSwgMl0pXG4gKiAgIC5waXBlVGhyb3VnaCh0b1RyYW5zZm9ybVN0cmVhbShhc3luYyBmdW5jdGlvbiogKHNyYykge1xuICogICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2Ygc3JjKSB7XG4gKiAgICAgICB5aWVsZCBjaHVuayAqIDEwMDtcbiAqICAgICB9XG4gKiAgIH0pKTtcbiAqXG4gKiBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIHJlYWRhYmxlKSB7XG4gKiAgIGNvbnNvbGUubG9nKGNodW5rKTtcbiAqIH1cbiAqIC8vIG91dHB1dDogMCwgMTAwLCAyMDBcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB0cmFuc2Zvcm1lciBBIGZ1bmN0aW9uIHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSB3cml0YWJsZVN0cmF0ZWd5IEFuIG9iamVjdCB0aGF0IG9wdGlvbmFsbHkgZGVmaW5lcyBhIHF1ZXVpbmcgc3RyYXRlZ3kgZm9yIHRoZSBzdHJlYW0uXG4gKiBAcGFyYW0gcmVhZGFibGVTdHJhdGVneSBBbiBvYmplY3QgdGhhdCBvcHRpb25hbGx5IGRlZmluZXMgYSBxdWV1aW5nIHN0cmF0ZWd5IGZvciB0aGUgc3RyZWFtLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9UcmFuc2Zvcm1TdHJlYW08SSwgTz4oXG4gIHRyYW5zZm9ybWVyOiAoc3JjOiBSZWFkYWJsZVN0cmVhbTxJPikgPT4gSXRlcmFibGU8Tz4gfCBBc3luY0l0ZXJhYmxlPE8+LFxuICB3cml0YWJsZVN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PEk+LFxuICByZWFkYWJsZVN0cmF0ZWd5PzogUXVldWluZ1N0cmF0ZWd5PE8+LFxuKTogVHJhbnNmb3JtU3RyZWFtPEksIE8+IHtcbiAgY29uc3Qge1xuICAgIHdyaXRhYmxlLFxuICAgIHJlYWRhYmxlLFxuICB9ID0gbmV3IFRyYW5zZm9ybVN0cmVhbTxJLCBJPih1bmRlZmluZWQsIHdyaXRhYmxlU3RyYXRlZ3kpO1xuXG4gIGNvbnN0IGl0ZXJhYmxlID0gdHJhbnNmb3JtZXIocmVhZGFibGUpO1xuICBjb25zdCBpdGVyYXRvcjogSXRlcmF0b3I8Tz4gfCBBc3luY0l0ZXJhdG9yPE8+ID1cbiAgICAoaXRlcmFibGUgYXMgQXN5bmNJdGVyYWJsZTxPPilbU3ltYm9sLmFzeW5jSXRlcmF0b3JdPy4oKSA/P1xuICAgICAgKGl0ZXJhYmxlIGFzIEl0ZXJhYmxlPE8+KVtTeW1ib2wuaXRlcmF0b3JdPy4oKTtcbiAgcmV0dXJuIHtcbiAgICB3cml0YWJsZSxcbiAgICByZWFkYWJsZTogbmV3IFJlYWRhYmxlU3RyZWFtPE8+KHtcbiAgICAgIGFzeW5jIHB1bGwoY29udHJvbGxlcikge1xuICAgICAgICBsZXQgcmVzdWx0OiBJdGVyYXRvclJlc3VsdDxPPjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXN1bHQgPSBhd2FpdCBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gUHJvcGFnYXRlIGVycm9yIHRvIHN0cmVhbSBmcm9tIGl0ZXJhdG9yXG4gICAgICAgICAgLy8gSWYgdGhlIHN0cmVhbSBzdGF0dXMgaXMgXCJlcnJvcmVkXCIsIGl0IHdpbGwgYmUgdGhyb3duLCBidXQgaWdub3JlLlxuICAgICAgICAgIGF3YWl0IHJlYWRhYmxlLmNhbmNlbChlcnJvcikuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgICAgIGNvbnRyb2xsZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShyZXN1bHQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIGFzeW5jIGNhbmNlbChyZWFzb24pIHtcbiAgICAgICAgLy8gUHJvcGFnYXRlIGNhbmNlbGxhdGlvbiB0byByZWFkYWJsZSBhbmQgaXRlcmF0b3JcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvci50aHJvdyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgaXRlcmF0b3IudGhyb3cocmVhc29uKTtcbiAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIC8qIGBpdGVyYXRvci50aHJvdygpYCBhbHdheXMgdGhyb3dzIG9uIHNpdGUuIFdlIGNhdGNoIGl0LiAqL1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhd2FpdCByZWFkYWJsZS5jYW5jZWwocmVhc29uKTtcbiAgICAgIH0sXG4gICAgfSwgcmVhZGFibGVTdHJhdGVneSksXG4gIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZGFibGVTdHJlYW1Gcm9tUmVhZGVyT3B0aW9ucyB7XG4gIC8qKiBJZiB0aGUgYHJlYWRlcmAgaXMgYWxzbyBhIGBEZW5vLkNsb3NlcmAsIGF1dG9tYXRpY2FsbHkgY2xvc2UgdGhlIGByZWFkZXJgXG4gICAqIHdoZW4gYEVPRmAgaXMgZW5jb3VudGVyZWQsIG9yIGEgcmVhZCBlcnJvciBvY2N1cnMuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGB0cnVlYC4gKi9cbiAgYXV0b0Nsb3NlPzogYm9vbGVhbjtcblxuICAvKiogVGhlIHNpemUgb2YgY2h1bmtzIHRvIGFsbG9jYXRlIHRvIHJlYWQsIHRoZSBkZWZhdWx0IGlzIH4xNktpQiwgd2hpY2ggaXNcbiAgICogdGhlIG1heGltdW0gc2l6ZSB0aGF0IERlbm8gb3BlcmF0aW9ucyBjYW4gY3VycmVudGx5IHN1cHBvcnQuICovXG4gIGNodW5rU2l6ZT86IG51bWJlcjtcblxuICAvKiogVGhlIHF1ZXVpbmcgc3RyYXRlZ3kgdG8gY3JlYXRlIHRoZSBgUmVhZGFibGVTdHJlYW1gIHdpdGguICovXG4gIHN0cmF0ZWd5PzogeyBoaWdoV2F0ZXJNYXJrPzogbnVtYmVyIHwgdW5kZWZpbmVkOyBzaXplPzogdW5kZWZpbmVkIH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+YCBmcm9tIGZyb20gYSBgRGVuby5SZWFkZXJgLlxuICpcbiAqIFdoZW4gdGhlIHB1bGwgYWxnb3JpdGhtIGlzIGNhbGxlZCBvbiB0aGUgc3RyZWFtLCBhIGNodW5rIGZyb20gdGhlIHJlYWRlclxuICogd2lsbCBiZSByZWFkLiAgV2hlbiBgbnVsbGAgaXMgcmV0dXJuZWQgZnJvbSB0aGUgcmVhZGVyLCB0aGUgc3RyZWFtIHdpbGwgYmVcbiAqIGNsb3NlZCBhbG9uZyB3aXRoIHRoZSByZWFkZXIgKGlmIGl0IGlzIGFsc28gYSBgRGVuby5DbG9zZXJgKS5cbiAqXG4gKiBBbiBleGFtcGxlIGNvbnZlcnRpbmcgYSBgRGVuby5Gc0ZpbGVgIGludG8gYSByZWFkYWJsZSBzdHJlYW06XG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IHJlYWRhYmxlU3RyZWFtRnJvbVJlYWRlciB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL3N0cmVhbXMvbW9kLnRzXCI7XG4gKlxuICogY29uc3QgZmlsZSA9IGF3YWl0IERlbm8ub3BlbihcIi4vZmlsZS50eHRcIiwgeyByZWFkOiB0cnVlIH0pO1xuICogY29uc3QgZmlsZVN0cmVhbSA9IHJlYWRhYmxlU3RyZWFtRnJvbVJlYWRlcihmaWxlKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZGFibGVTdHJlYW1Gcm9tUmVhZGVyKFxuICByZWFkZXI6IERlbm8uUmVhZGVyIHwgKERlbm8uUmVhZGVyICYgRGVuby5DbG9zZXIpLFxuICBvcHRpb25zOiBSZWFkYWJsZVN0cmVhbUZyb21SZWFkZXJPcHRpb25zID0ge30sXG4pOiBSZWFkYWJsZVN0cmVhbTxVaW50OEFycmF5PiB7XG4gIGNvbnN0IHtcbiAgICBhdXRvQ2xvc2UgPSB0cnVlLFxuICAgIGNodW5rU2l6ZSA9IERFRkFVTFRfQ0hVTktfU0laRSxcbiAgICBzdHJhdGVneSxcbiAgfSA9IG9wdGlvbnM7XG5cbiAgcmV0dXJuIG5ldyBSZWFkYWJsZVN0cmVhbSh7XG4gICAgYXN5bmMgcHVsbChjb250cm9sbGVyKSB7XG4gICAgICBjb25zdCBjaHVuayA9IG5ldyBVaW50OEFycmF5KGNodW5rU2l6ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZWFkID0gYXdhaXQgcmVhZGVyLnJlYWQoY2h1bmspO1xuICAgICAgICBpZiAocmVhZCA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmIChpc0Nsb3NlcihyZWFkZXIpICYmIGF1dG9DbG9zZSkge1xuICAgICAgICAgICAgcmVhZGVyLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKGNodW5rLnN1YmFycmF5KDAsIHJlYWQpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29udHJvbGxlci5lcnJvcihlKTtcbiAgICAgICAgaWYgKGlzQ2xvc2VyKHJlYWRlcikpIHtcbiAgICAgICAgICByZWFkZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2FuY2VsKCkge1xuICAgICAgaWYgKGlzQ2xvc2VyKHJlYWRlcikgJiYgYXV0b0Nsb3NlKSB7XG4gICAgICAgIHJlYWRlci5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sXG4gIH0sIHN0cmF0ZWd5KTtcbn1cblxuLyoqIFJlYWQgUmVhZGVyIGByYCB1bnRpbCBFT0YgKGBudWxsYCkgYW5kIHJlc29sdmUgdG8gdGhlIGNvbnRlbnQgYXNcbiAqIFVpbnQ4QXJyYXlgLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi9pby9idWZmZXIudHNcIjtcbiAqIGltcG9ydCB7IHJlYWRBbGwgfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi9zdHJlYW1zL2NvbnZlcnNpb24udHNcIjtcbiAqXG4gKiAvLyBFeGFtcGxlIGZyb20gc3RkaW5cbiAqIGNvbnN0IHN0ZGluQ29udGVudCA9IGF3YWl0IHJlYWRBbGwoRGVuby5zdGRpbik7XG4gKlxuICogLy8gRXhhbXBsZSBmcm9tIGZpbGVcbiAqIGNvbnN0IGZpbGUgPSBhd2FpdCBEZW5vLm9wZW4oXCJteV9maWxlLnR4dFwiLCB7cmVhZDogdHJ1ZX0pO1xuICogY29uc3QgbXlGaWxlQ29udGVudCA9IGF3YWl0IHJlYWRBbGwoZmlsZSk7XG4gKiBmaWxlLmNsb3NlKCk7XG4gKlxuICogLy8gRXhhbXBsZSBmcm9tIGJ1ZmZlclxuICogY29uc3QgbXlEYXRhID0gbmV3IFVpbnQ4QXJyYXkoMTAwKTtcbiAqIC8vIC4uLiBmaWxsIG15RGF0YSBhcnJheSB3aXRoIGRhdGFcbiAqIGNvbnN0IHJlYWRlciA9IG5ldyBCdWZmZXIobXlEYXRhLmJ1ZmZlcik7XG4gKiBjb25zdCBidWZmZXJDb250ZW50ID0gYXdhaXQgcmVhZEFsbChyZWFkZXIpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkQWxsKHI6IERlbm8uUmVhZGVyKTogUHJvbWlzZTxVaW50OEFycmF5PiB7XG4gIGNvbnN0IGJ1ZiA9IG5ldyBCdWZmZXIoKTtcbiAgYXdhaXQgYnVmLnJlYWRGcm9tKHIpO1xuICByZXR1cm4gYnVmLmJ5dGVzKCk7XG59XG5cbi8qKiBTeW5jaHJvbm91c2x5IHJlYWRzIFJlYWRlciBgcmAgdW50aWwgRU9GIChgbnVsbGApIGFuZCByZXR1cm5zIHRoZSBjb250ZW50XG4gKiBhcyBgVWludDhBcnJheWAuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL2lvL2J1ZmZlci50c1wiO1xuICogaW1wb3J0IHsgcmVhZEFsbFN5bmMgfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi9zdHJlYW1zL2NvbnZlcnNpb24udHNcIjtcbiAqXG4gKiAvLyBFeGFtcGxlIGZyb20gc3RkaW5cbiAqIGNvbnN0IHN0ZGluQ29udGVudCA9IHJlYWRBbGxTeW5jKERlbm8uc3RkaW4pO1xuICpcbiAqIC8vIEV4YW1wbGUgZnJvbSBmaWxlXG4gKiBjb25zdCBmaWxlID0gRGVuby5vcGVuU3luYyhcIm15X2ZpbGUudHh0XCIsIHtyZWFkOiB0cnVlfSk7XG4gKiBjb25zdCBteUZpbGVDb250ZW50ID0gcmVhZEFsbFN5bmMoZmlsZSk7XG4gKiBmaWxlLmNsb3NlKCk7XG4gKlxuICogLy8gRXhhbXBsZSBmcm9tIGJ1ZmZlclxuICogY29uc3QgbXlEYXRhID0gbmV3IFVpbnQ4QXJyYXkoMTAwKTtcbiAqIC8vIC4uLiBmaWxsIG15RGF0YSBhcnJheSB3aXRoIGRhdGFcbiAqIGNvbnN0IHJlYWRlciA9IG5ldyBCdWZmZXIobXlEYXRhLmJ1ZmZlcik7XG4gKiBjb25zdCBidWZmZXJDb250ZW50ID0gcmVhZEFsbFN5bmMocmVhZGVyKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZEFsbFN5bmMocjogRGVuby5SZWFkZXJTeW5jKTogVWludDhBcnJheSB7XG4gIGNvbnN0IGJ1ZiA9IG5ldyBCdWZmZXIoKTtcbiAgYnVmLnJlYWRGcm9tU3luYyhyKTtcbiAgcmV0dXJuIGJ1Zi5ieXRlcygpO1xufVxuXG4vKiogV3JpdGUgYWxsIHRoZSBjb250ZW50IG9mIHRoZSBhcnJheSBidWZmZXIgKGBhcnJgKSB0byB0aGUgd3JpdGVyIChgd2ApLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi9pby9idWZmZXIudHNcIjtcbiAqIGltcG9ydCB7IHdyaXRlQWxsIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vc3RyZWFtcy9jb252ZXJzaW9uLnRzXCI7XG5cbiAqIC8vIEV4YW1wbGUgd3JpdGluZyB0byBzdGRvdXRcbiAqIGxldCBjb250ZW50Qnl0ZXMgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoXCJIZWxsbyBXb3JsZFwiKTtcbiAqIGF3YWl0IHdyaXRlQWxsKERlbm8uc3Rkb3V0LCBjb250ZW50Qnl0ZXMpO1xuICpcbiAqIC8vIEV4YW1wbGUgd3JpdGluZyB0byBmaWxlXG4gKiBjb250ZW50Qnl0ZXMgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoXCJIZWxsbyBXb3JsZFwiKTtcbiAqIGNvbnN0IGZpbGUgPSBhd2FpdCBEZW5vLm9wZW4oJ3Rlc3QuZmlsZScsIHt3cml0ZTogdHJ1ZX0pO1xuICogYXdhaXQgd3JpdGVBbGwoZmlsZSwgY29udGVudEJ5dGVzKTtcbiAqIGZpbGUuY2xvc2UoKTtcbiAqXG4gKiAvLyBFeGFtcGxlIHdyaXRpbmcgdG8gYnVmZmVyXG4gKiBjb250ZW50Qnl0ZXMgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoXCJIZWxsbyBXb3JsZFwiKTtcbiAqIGNvbnN0IHdyaXRlciA9IG5ldyBCdWZmZXIoKTtcbiAqIGF3YWl0IHdyaXRlQWxsKHdyaXRlciwgY29udGVudEJ5dGVzKTtcbiAqIGNvbnNvbGUubG9nKHdyaXRlci5ieXRlcygpLmxlbmd0aCk7ICAvLyAxMVxuICogYGBgXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZUFsbCh3OiBEZW5vLldyaXRlciwgYXJyOiBVaW50OEFycmF5KSB7XG4gIGxldCBud3JpdHRlbiA9IDA7XG4gIHdoaWxlIChud3JpdHRlbiA8IGFyci5sZW5ndGgpIHtcbiAgICBud3JpdHRlbiArPSBhd2FpdCB3LndyaXRlKGFyci5zdWJhcnJheShud3JpdHRlbikpO1xuICB9XG59XG5cbi8qKiBTeW5jaHJvbm91c2x5IHdyaXRlIGFsbCB0aGUgY29udGVudCBvZiB0aGUgYXJyYXkgYnVmZmVyIChgYXJyYCkgdG8gdGhlXG4gKiB3cml0ZXIgKGB3YCkuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL2lvL2J1ZmZlci50c1wiO1xuICogaW1wb3J0IHsgd3JpdGVBbGxTeW5jIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vc3RyZWFtcy9jb252ZXJzaW9uLnRzXCI7XG4gKlxuICogLy8gRXhhbXBsZSB3cml0aW5nIHRvIHN0ZG91dFxuICogbGV0IGNvbnRlbnRCeXRlcyA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShcIkhlbGxvIFdvcmxkXCIpO1xuICogd3JpdGVBbGxTeW5jKERlbm8uc3Rkb3V0LCBjb250ZW50Qnl0ZXMpO1xuICpcbiAqIC8vIEV4YW1wbGUgd3JpdGluZyB0byBmaWxlXG4gKiBjb250ZW50Qnl0ZXMgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoXCJIZWxsbyBXb3JsZFwiKTtcbiAqIGNvbnN0IGZpbGUgPSBEZW5vLm9wZW5TeW5jKCd0ZXN0LmZpbGUnLCB7d3JpdGU6IHRydWV9KTtcbiAqIHdyaXRlQWxsU3luYyhmaWxlLCBjb250ZW50Qnl0ZXMpO1xuICogZmlsZS5jbG9zZSgpO1xuICpcbiAqIC8vIEV4YW1wbGUgd3JpdGluZyB0byBidWZmZXJcbiAqIGNvbnRlbnRCeXRlcyA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShcIkhlbGxvIFdvcmxkXCIpO1xuICogY29uc3Qgd3JpdGVyID0gbmV3IEJ1ZmZlcigpO1xuICogd3JpdGVBbGxTeW5jKHdyaXRlciwgY29udGVudEJ5dGVzKTtcbiAqIGNvbnNvbGUubG9nKHdyaXRlci5ieXRlcygpLmxlbmd0aCk7ICAvLyAxMVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZUFsbFN5bmModzogRGVuby5Xcml0ZXJTeW5jLCBhcnI6IFVpbnQ4QXJyYXkpIHtcbiAgbGV0IG53cml0dGVuID0gMDtcbiAgd2hpbGUgKG53cml0dGVuIDwgYXJyLmxlbmd0aCkge1xuICAgIG53cml0dGVuICs9IHcud3JpdGVTeW5jKGFyci5zdWJhcnJheShud3JpdHRlbikpO1xuICB9XG59XG5cbi8qKiBUdXJucyBhIFJlYWRlciwgYHJgLCBpbnRvIGFuIGFzeW5jIGl0ZXJhdG9yLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBpdGVyYXRlUmVhZGVyIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vc3RyZWFtcy9jb252ZXJzaW9uLnRzXCI7XG4gKlxuICogbGV0IGYgPSBhd2FpdCBEZW5vLm9wZW4oXCIvZXRjL3Bhc3N3ZFwiKTtcbiAqIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2YgaXRlcmF0ZVJlYWRlcihmKSkge1xuICogICBjb25zb2xlLmxvZyhjaHVuayk7XG4gKiB9XG4gKiBmLmNsb3NlKCk7XG4gKiBgYGBcbiAqXG4gKiBTZWNvbmQgYXJndW1lbnQgY2FuIGJlIHVzZWQgdG8gdHVuZSBzaXplIG9mIGEgYnVmZmVyLlxuICogRGVmYXVsdCBzaXplIG9mIHRoZSBidWZmZXIgaXMgMzJrQi5cbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgaXRlcmF0ZVJlYWRlciB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL3N0cmVhbXMvY29udmVyc2lvbi50c1wiO1xuICpcbiAqIGxldCBmID0gYXdhaXQgRGVuby5vcGVuKFwiL2V0Yy9wYXNzd2RcIik7XG4gKiBjb25zdCBpdCA9IGl0ZXJhdGVSZWFkZXIoZiwge1xuICogICBidWZTaXplOiAxMDI0ICogMTAyNFxuICogfSk7XG4gKiBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIGl0KSB7XG4gKiAgIGNvbnNvbGUubG9nKGNodW5rKTtcbiAqIH1cbiAqIGYuY2xvc2UoKTtcbiAqIGBgYFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24qIGl0ZXJhdGVSZWFkZXIoXG4gIHI6IERlbm8uUmVhZGVyLFxuICBvcHRpb25zPzoge1xuICAgIGJ1ZlNpemU/OiBudW1iZXI7XG4gIH0sXG4pOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8VWludDhBcnJheT4ge1xuICBjb25zdCBidWZTaXplID0gb3B0aW9ucz8uYnVmU2l6ZSA/PyBERUZBVUxUX0JVRkZFUl9TSVpFO1xuICBjb25zdCBiID0gbmV3IFVpbnQ4QXJyYXkoYnVmU2l6ZSk7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgci5yZWFkKGIpO1xuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHlpZWxkIGIuc2xpY2UoMCwgcmVzdWx0KTtcbiAgfVxufVxuXG4vKiogVHVybnMgYSBSZWFkZXJTeW5jLCBgcmAsIGludG8gYW4gaXRlcmF0b3IuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IGl0ZXJhdGVSZWFkZXJTeW5jIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vc3RyZWFtcy9jb252ZXJzaW9uLnRzXCI7XG4gKlxuICogbGV0IGYgPSBEZW5vLm9wZW5TeW5jKFwiL2V0Yy9wYXNzd2RcIik7XG4gKiBmb3IgKGNvbnN0IGNodW5rIG9mIGl0ZXJhdGVSZWFkZXJTeW5jKGYpKSB7XG4gKiAgIGNvbnNvbGUubG9nKGNodW5rKTtcbiAqIH1cbiAqIGYuY2xvc2UoKTtcbiAqIGBgYFxuICpcbiAqIFNlY29uZCBhcmd1bWVudCBjYW4gYmUgdXNlZCB0byB0dW5lIHNpemUgb2YgYSBidWZmZXIuXG4gKiBEZWZhdWx0IHNpemUgb2YgdGhlIGJ1ZmZlciBpcyAzMmtCLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBpdGVyYXRlUmVhZGVyU3luYyB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL3N0cmVhbXMvY29udmVyc2lvbi50c1wiO1xuXG4gKiBsZXQgZiA9IGF3YWl0IERlbm8ub3BlbihcIi9ldGMvcGFzc3dkXCIpO1xuICogY29uc3QgaXRlciA9IGl0ZXJhdGVSZWFkZXJTeW5jKGYsIHtcbiAqICAgYnVmU2l6ZTogMTAyNCAqIDEwMjRcbiAqIH0pO1xuICogZm9yIChjb25zdCBjaHVuayBvZiBpdGVyKSB7XG4gKiAgIGNvbnNvbGUubG9nKGNodW5rKTtcbiAqIH1cbiAqIGYuY2xvc2UoKTtcbiAqIGBgYFxuICpcbiAqIEl0ZXJhdG9yIHVzZXMgYW4gaW50ZXJuYWwgYnVmZmVyIG9mIGZpeGVkIHNpemUgZm9yIGVmZmljaWVuY3k7IGl0IHJldHVybnNcbiAqIGEgdmlldyBvbiB0aGF0IGJ1ZmZlciBvbiBlYWNoIGl0ZXJhdGlvbi4gSXQgaXMgdGhlcmVmb3JlIGNhbGxlcidzXG4gKiByZXNwb25zaWJpbGl0eSB0byBjb3B5IGNvbnRlbnRzIG9mIHRoZSBidWZmZXIgaWYgbmVlZGVkOyBvdGhlcndpc2UgdGhlXG4gKiBuZXh0IGl0ZXJhdGlvbiB3aWxsIG92ZXJ3cml0ZSBjb250ZW50cyBvZiBwcmV2aW91c2x5IHJldHVybmVkIGNodW5rLlxuICovXG5leHBvcnQgZnVuY3Rpb24qIGl0ZXJhdGVSZWFkZXJTeW5jKFxuICByOiBEZW5vLlJlYWRlclN5bmMsXG4gIG9wdGlvbnM/OiB7XG4gICAgYnVmU2l6ZT86IG51bWJlcjtcbiAgfSxcbik6IEl0ZXJhYmxlSXRlcmF0b3I8VWludDhBcnJheT4ge1xuICBjb25zdCBidWZTaXplID0gb3B0aW9ucz8uYnVmU2l6ZSA/PyBERUZBVUxUX0JVRkZFUl9TSVpFO1xuICBjb25zdCBiID0gbmV3IFVpbnQ4QXJyYXkoYnVmU2l6ZSk7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gci5yZWFkU3luYyhiKTtcbiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICB5aWVsZCBiLnNsaWNlKDAsIHJlc3VsdCk7XG4gIH1cbn1cblxuLyoqIENvcGllcyBmcm9tIGBzcmNgIHRvIGBkc3RgIHVudGlsIGVpdGhlciBFT0YgKGBudWxsYCkgaXMgcmVhZCBmcm9tIGBzcmNgIG9yXG4gKiBhbiBlcnJvciBvY2N1cnMuIEl0IHJlc29sdmVzIHRvIHRoZSBudW1iZXIgb2YgYnl0ZXMgY29waWVkIG9yIHJlamVjdHMgd2l0aFxuICogdGhlIGZpcnN0IGVycm9yIGVuY291bnRlcmVkIHdoaWxlIGNvcHlpbmcuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IGNvcHkgfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi9zdHJlYW1zL2NvbnZlcnNpb24udHNcIjtcbiAqXG4gKiBjb25zdCBzb3VyY2UgPSBhd2FpdCBEZW5vLm9wZW4oXCJteV9maWxlLnR4dFwiKTtcbiAqIGNvbnN0IGJ5dGVzQ29waWVkMSA9IGF3YWl0IGNvcHkoc291cmNlLCBEZW5vLnN0ZG91dCk7XG4gKiBjb25zdCBkZXN0aW5hdGlvbiA9IGF3YWl0IERlbm8uY3JlYXRlKFwibXlfZmlsZV8yLnR4dFwiKTtcbiAqIGNvbnN0IGJ5dGVzQ29waWVkMiA9IGF3YWl0IGNvcHkoc291cmNlLCBkZXN0aW5hdGlvbik7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc3JjIFRoZSBzb3VyY2UgdG8gY29weSBmcm9tXG4gKiBAcGFyYW0gZHN0IFRoZSBkZXN0aW5hdGlvbiB0byBjb3B5IHRvXG4gKiBAcGFyYW0gb3B0aW9ucyBDYW4gYmUgdXNlZCB0byB0dW5lIHNpemUgb2YgdGhlIGJ1ZmZlci4gRGVmYXVsdCBzaXplIGlzIDMya0JcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvcHkoXG4gIHNyYzogRGVuby5SZWFkZXIsXG4gIGRzdDogRGVuby5Xcml0ZXIsXG4gIG9wdGlvbnM/OiB7XG4gICAgYnVmU2l6ZT86IG51bWJlcjtcbiAgfSxcbik6IFByb21pc2U8bnVtYmVyPiB7XG4gIGxldCBuID0gMDtcbiAgY29uc3QgYnVmU2l6ZSA9IG9wdGlvbnM/LmJ1ZlNpemUgPz8gREVGQVVMVF9CVUZGRVJfU0laRTtcbiAgY29uc3QgYiA9IG5ldyBVaW50OEFycmF5KGJ1ZlNpemUpO1xuICBsZXQgZ290RU9GID0gZmFsc2U7XG4gIHdoaWxlIChnb3RFT0YgPT09IGZhbHNlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3JjLnJlYWQoYik7XG4gICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgZ290RU9GID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG53cml0dGVuID0gMDtcbiAgICAgIHdoaWxlIChud3JpdHRlbiA8IHJlc3VsdCkge1xuICAgICAgICBud3JpdHRlbiArPSBhd2FpdCBkc3Qud3JpdGUoYi5zdWJhcnJheShud3JpdHRlbiwgcmVzdWx0KSk7XG4gICAgICB9XG4gICAgICBuICs9IG53cml0dGVuO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbjtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFFMUUsU0FBUyxNQUFNLFFBQVEsa0JBQWtCO0FBRXpDLE1BQU0scUJBQXFCO0FBQzNCLE1BQU0sc0JBQXNCLEtBQUs7QUFFakMsU0FBUyxTQUFTLEtBQWMsRUFBd0I7SUFDdEQsT0FBTyxPQUFPLFVBQVUsWUFBWSxTQUFTLElBQUksSUFBSSxXQUFXLFNBQzlELG1DQUFtQztJQUNuQyxPQUFPLEFBQUMsS0FBNkIsQ0FBQyxRQUFRLEtBQUs7QUFDdkQ7QUFFQTs7Ozs7Ozs7Ozs7Ozs7O0NBZUMsR0FDRCxPQUFPLFNBQVMsbUJBQ2QsUUFBMEQsRUFDN0M7SUFDYixNQUFN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