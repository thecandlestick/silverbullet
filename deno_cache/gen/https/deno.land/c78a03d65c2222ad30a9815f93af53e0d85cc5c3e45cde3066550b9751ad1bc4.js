// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// This module ports:
// - https://github.com/nodejs/node/blob/master/src/stream_base-inl.h
// - https://github.com/nodejs/node/blob/master/src/stream_base.h
// - https://github.com/nodejs/node/blob/master/src/stream_base.cc
// - https://github.com/nodejs/node/blob/master/src/stream_wrap.h
// - https://github.com/nodejs/node/blob/master/src/stream_wrap.cc
import { Buffer } from "../buffer.ts";
import { notImplemented } from "../_utils.ts";
import { HandleWrap } from "./handle_wrap.ts";
import { AsyncWrap, providerType } from "./async_wrap.ts";
import { codeMap } from "./uv.ts";
import { writeAll } from "../../streams/write_all.ts";
var StreamBaseStateFields;
(function(StreamBaseStateFields) {
    StreamBaseStateFields[StreamBaseStateFields["kReadBytesOrError"] = 0] = "kReadBytesOrError";
    StreamBaseStateFields[StreamBaseStateFields["kArrayBufferOffset"] = 1] = "kArrayBufferOffset";
    StreamBaseStateFields[StreamBaseStateFields["kBytesWritten"] = 2] = "kBytesWritten";
    StreamBaseStateFields[StreamBaseStateFields["kLastWriteWasAsync"] = 3] = "kLastWriteWasAsync";
    StreamBaseStateFields[StreamBaseStateFields["kNumStreamBaseStateFields"] = 4] = "kNumStreamBaseStateFields";
})(StreamBaseStateFields || (StreamBaseStateFields = {}));
export const kReadBytesOrError = StreamBaseStateFields.kReadBytesOrError;
export const kArrayBufferOffset = StreamBaseStateFields.kArrayBufferOffset;
export const kBytesWritten = StreamBaseStateFields.kBytesWritten;
export const kLastWriteWasAsync = StreamBaseStateFields.kLastWriteWasAsync;
export const kNumStreamBaseStateFields = StreamBaseStateFields.kNumStreamBaseStateFields;
export const streamBaseState = new Uint8Array(5);
// This is Deno, it always will be async.
streamBaseState[kLastWriteWasAsync] = 1;
export class WriteWrap extends AsyncWrap {
    handle;
    oncomplete;
    async;
    bytes;
    buffer;
    callback;
    _chunks;
    constructor(){
        super(providerType.WRITEWRAP);
    }
}
export class ShutdownWrap extends AsyncWrap {
    handle;
    oncomplete;
    callback;
    constructor(){
        super(providerType.SHUTDOWNWRAP);
    }
}
export const kStreamBaseField = Symbol("kStreamBaseField");
const SUGGESTED_SIZE = 64 * 1024;
export class LibuvStreamWrap extends HandleWrap {
    [kStreamBaseField];
    reading;
    #reading = false;
    destroyed = false;
    writeQueueSize = 0;
    bytesRead = 0;
    bytesWritten = 0;
    onread;
    constructor(provider, stream){
        super(provider);
        this.#attachToObject(stream);
    }
    /**
   * Start the reading of the stream.
   * @return An error status code.
   */ readStart() {
        if (!this.#reading) {
            this.#reading = true;
            this.#read();
        }
        return 0;
    }
    /**
   * Stop the reading of the stream.
   * @return An error status code.
   */ readStop() {
        this.#reading = false;
        return 0;
    }
    /**
   * Shutdown the stream.
   * @param req A shutdown request wrapper.
   * @return An error status code.
   */ shutdown(req) {
        const status = this._onClose();
        try {
            req.oncomplete(status);
        } catch  {
        // swallow callback error.
        }
        return 0;
    }
    /**
   * @param userBuf
   * @return An error status code.
   */ useUserBuffer(_userBuf) {
        // TODO(cmorten)
        notImplemented("LibuvStreamWrap.prototype.useUserBuffer");
    }
    /**
   * Write a buffer to the stream.
   * @param req A write request wrapper.
   * @param data The Uint8Array buffer to write to the stream.
   * @return An error status code.
   */ writeBuffer(req, data) {
        this.#write(req, data);
        return 0;
    }
    /**
   * Write multiple chunks at once.
   * @param req A write request wrapper.
   * @param chunks
   * @param allBuffers
   * @return An error status code.
   */ writev(req, chunks, allBuffers) {
        const count = allBuffers ? chunks.length : chunks.length >> 1;
        const buffers = new Array(count);
        if (!allBuffers) {
            for(let i = 0; i < count; i++){
                const chunk = chunks[i * 2];
                if (Buffer.isBuffer(chunk)) {
                    buffers[i] = chunk;
                }
                // String chunk
                const encoding = chunks[i * 2 + 1];
                buffers[i] = Buffer.from(chunk, encoding);
            }
        } else {
            for(let i = 0; i < count; i++){
                buffers[i] = chunks[i];
            }
        }
        return this.writeBuffer(req, Buffer.concat(buffers));
    }
    /**
   * Write an ASCII string to the stream.
   * @return An error status code.
   */ writeAsciiString(req, data) {
        const buffer = new TextEncoder().encode(data);
        return this.writeBuffer(req, buffer);
    }
    /**
   * Write an UTF8 string to the stream.
   * @return An error status code.
   */ writeUtf8String(req, data) {
        const buffer = new TextEncoder().encode(data);
        return this.writeBuffer(req, buffer);
    }
    /**
   * Write an UCS2 string to the stream.
   * @return An error status code.
   */ writeUcs2String(_req, _data) {
        notImplemented("LibuvStreamWrap.prototype.writeUcs2String");
    }
    /**
   * Write an LATIN1 string to the stream.
   * @return An error status code.
   */ writeLatin1String(req, data) {
        const buffer = Buffer.from(data, "latin1");
        return this.writeBuffer(req, buffer);
    }
    _onClose() {
        let status = 0;
        this.#reading = false;
        try {
            this[kStreamBaseField]?.close();
        } catch  {
            status = codeMap.get("ENOTCONN");
        }
        return status;
    }
    /**
   * Attaches the class to the underlying stream.
   * @param stream The stream to attach to.
   */ #attachToObject(stream) {
        this[kStreamBaseField] = stream;
    }
    /** Internal method for reading from the attached stream. */ async #read() {
        let buf = new Uint8Array(SUGGESTED_SIZE);
        let nread;
        try {
            nread = await this[kStreamBaseField].read(buf);
        } catch (e) {
            if (e instanceof Deno.errors.Interrupted || e instanceof Deno.errors.BadResource) {
                nread = codeMap.get("EOF");
            } else if (e instanceof Deno.errors.ConnectionReset || e instanceof Deno.errors.ConnectionAborted) {
                nread = codeMap.get("ECONNRESET");
            } else {
                nread = codeMap.get("UNKNOWN");
            }
            buf = new Uint8Array(0);
        }
        nread ??= codeMap.get("EOF");
        streamBaseState[kReadBytesOrError] = nread;
        if (nread > 0) {
            this.bytesRead += nread;
        }
        buf = buf.slice(0, nread);
        streamBaseState[kArrayBufferOffset] = 0;
        try {
            this.onread(buf, nread);
        } catch  {
        // swallow callback errors.
        }
        if (nread >= 0 && this.#reading) {
            this.#read();
        }
    }
    /**
   * Internal method for writing to the attached stream.
   * @param req A write request wrapper.
   * @param data The Uint8Array buffer to write to the stream.
   */ async #write(req, data) {
        const { byteLength  } = data;
        try {
            await writeAll(this[kStreamBaseField], data);
        } catch (e) {
            let status;
            // TODO(cmorten): map err to status codes
            if (e instanceof Deno.errors.BadResource || e instanceof Deno.errors.BrokenPipe) {
                status = codeMap.get("EBADF");
            } else {
                status = codeMap.get("UNKNOWN");
            }
            try {
                req.oncomplete(status);
            } catch  {
            // swallow callback errors.
            }
            return;
        }
        streamBaseState[kBytesWritten] = byteLength;
        this.bytesWritten += byteLength;
        try {
            req.oncomplete(0);
        } catch  {
        // swallow callback errors.
        }
        return;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE3Ny4wL25vZGUvaW50ZXJuYWxfYmluZGluZy9zdHJlYW1fd3JhcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIFRoaXMgbW9kdWxlIHBvcnRzOlxuLy8gLSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvc3JjL3N0cmVhbV9iYXNlLWlubC5oXG4vLyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iL21hc3Rlci9zcmMvc3RyZWFtX2Jhc2UuaFxuLy8gLSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvc3JjL3N0cmVhbV9iYXNlLmNjXG4vLyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iL21hc3Rlci9zcmMvc3RyZWFtX3dyYXAuaFxuLy8gLSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi9tYXN0ZXIvc3JjL3N0cmVhbV93cmFwLmNjXG5cbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCIuLi9idWZmZXIudHNcIjtcbmltcG9ydCB7IG5vdEltcGxlbWVudGVkIH0gZnJvbSBcIi4uL191dGlscy50c1wiO1xuaW1wb3J0IHsgSGFuZGxlV3JhcCB9IGZyb20gXCIuL2hhbmRsZV93cmFwLnRzXCI7XG5pbXBvcnQgeyBBc3luY1dyYXAsIHByb3ZpZGVyVHlwZSB9IGZyb20gXCIuL2FzeW5jX3dyYXAudHNcIjtcbmltcG9ydCB7IGNvZGVNYXAgfSBmcm9tIFwiLi91di50c1wiO1xuaW1wb3J0IHsgd3JpdGVBbGwgfSBmcm9tIFwiLi4vLi4vc3RyZWFtcy93cml0ZV9hbGwudHNcIjtcbmltcG9ydCB0eXBlIHsgQ2xvc2VyLCBSZWFkZXIsIFdyaXRlciB9IGZyb20gXCIuLi8uLi90eXBlcy5kLnRzXCI7XG5cbnR5cGUgUmVmID0geyByZWYoKTogdm9pZDsgdW5yZWYoKTogdm9pZCB9O1xuXG5lbnVtIFN0cmVhbUJhc2VTdGF0ZUZpZWxkcyB7XG4gIGtSZWFkQnl0ZXNPckVycm9yLFxuICBrQXJyYXlCdWZmZXJPZmZzZXQsXG4gIGtCeXRlc1dyaXR0ZW4sXG4gIGtMYXN0V3JpdGVXYXNBc3luYyxcbiAga051bVN0cmVhbUJhc2VTdGF0ZUZpZWxkcyxcbn1cblxuZXhwb3J0IGNvbnN0IGtSZWFkQnl0ZXNPckVycm9yID0gU3RyZWFtQmFzZVN0YXRlRmllbGRzLmtSZWFkQnl0ZXNPckVycm9yO1xuZXhwb3J0IGNvbnN0IGtBcnJheUJ1ZmZlck9mZnNldCA9IFN0cmVhbUJhc2VTdGF0ZUZpZWxkcy5rQXJyYXlCdWZmZXJPZmZzZXQ7XG5leHBvcnQgY29uc3Qga0J5dGVzV3JpdHRlbiA9IFN0cmVhbUJhc2VTdGF0ZUZpZWxkcy5rQnl0ZXNXcml0dGVuO1xuZXhwb3J0IGNvbnN0IGtMYXN0V3JpdGVXYXNBc3luYyA9IFN0cmVhbUJhc2VTdGF0ZUZpZWxkcy5rTGFzdFdyaXRlV2FzQXN5bmM7XG5leHBvcnQgY29uc3Qga051bVN0cmVhbUJhc2VTdGF0ZUZpZWxkcyA9XG4gIFN0cmVhbUJhc2VTdGF0ZUZpZWxkcy5rTnVtU3RyZWFtQmFzZVN0YXRlRmllbGRzO1xuXG5leHBvcnQgY29uc3Qgc3RyZWFtQmFzZVN0YXRlID0gbmV3IFVpbnQ4QXJyYXkoNSk7XG5cbi8vIFRoaXMgaXMgRGVubywgaXQgYWx3YXlzIHdpbGwgYmUgYXN5bmMuXG5zdHJlYW1CYXNlU3RhdGVba0xhc3RXcml0ZVdhc0FzeW5jXSA9IDE7XG5cbmV4cG9ydCBjbGFzcyBXcml0ZVdyYXA8SCBleHRlbmRzIEhhbmRsZVdyYXA+IGV4dGVuZHMgQXN5bmNXcmFwIHtcbiAgaGFuZGxlITogSDtcbiAgb25jb21wbGV0ZSE6IChzdGF0dXM6IG51bWJlcikgPT4gdm9pZDtcbiAgYXN5bmMhOiBib29sZWFuO1xuICBieXRlcyE6IG51bWJlcjtcbiAgYnVmZmVyITogdW5rbm93bjtcbiAgY2FsbGJhY2shOiB1bmtub3duO1xuICBfY2h1bmtzITogdW5rbm93bltdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHByb3ZpZGVyVHlwZS5XUklURVdSQVApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTaHV0ZG93bldyYXA8SCBleHRlbmRzIEhhbmRsZVdyYXA+IGV4dGVuZHMgQXN5bmNXcmFwIHtcbiAgaGFuZGxlITogSDtcbiAgb25jb21wbGV0ZSE6IChzdGF0dXM6IG51bWJlcikgPT4gdm9pZDtcbiAgY2FsbGJhY2shOiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHByb3ZpZGVyVHlwZS5TSFVURE9XTldSQVApO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBrU3RyZWFtQmFzZUZpZWxkID0gU3ltYm9sKFwia1N0cmVhbUJhc2VGaWVsZFwiKTtcblxuY29uc3QgU1VHR0VTVEVEX1NJWkUgPSA2NCAqIDEwMjQ7XG5cbmV4cG9ydCBjbGFzcyBMaWJ1dlN0cmVhbVdyYXAgZXh0ZW5kcyBIYW5kbGVXcmFwIHtcbiAgW2tTdHJlYW1CYXNlRmllbGRdPzogUmVhZGVyICYgV3JpdGVyICYgQ2xvc2VyICYgUmVmO1xuXG4gIHJlYWRpbmchOiBib29sZWFuO1xuICAjcmVhZGluZyA9IGZhbHNlO1xuICBkZXN0cm95ZWQgPSBmYWxzZTtcbiAgd3JpdGVRdWV1ZVNpemUgPSAwO1xuICBieXRlc1JlYWQgPSAwO1xuICBieXRlc1dyaXR0ZW4gPSAwO1xuXG4gIG9ucmVhZCE6IChfYXJyYXlCdWZmZXI6IFVpbnQ4QXJyYXksIF9ucmVhZDogbnVtYmVyKSA9PiBVaW50OEFycmF5IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3ZpZGVyOiBwcm92aWRlclR5cGUsXG4gICAgc3RyZWFtPzogUmVhZGVyICYgV3JpdGVyICYgQ2xvc2VyICYgUmVmLFxuICApIHtcbiAgICBzdXBlcihwcm92aWRlcik7XG4gICAgdGhpcy4jYXR0YWNoVG9PYmplY3Qoc3RyZWFtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcmVhZGluZyBvZiB0aGUgc3RyZWFtLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgcmVhZFN0YXJ0KCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLiNyZWFkaW5nKSB7XG4gICAgICB0aGlzLiNyZWFkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuI3JlYWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSByZWFkaW5nIG9mIHRoZSBzdHJlYW0uXG4gICAqIEByZXR1cm4gQW4gZXJyb3Igc3RhdHVzIGNvZGUuXG4gICAqL1xuICByZWFkU3RvcCgpOiBudW1iZXIge1xuICAgIHRoaXMuI3JlYWRpbmcgPSBmYWxzZTtcblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFNodXRkb3duIHRoZSBzdHJlYW0uXG4gICAqIEBwYXJhbSByZXEgQSBzaHV0ZG93biByZXF1ZXN0IHdyYXBwZXIuXG4gICAqIEByZXR1cm4gQW4gZXJyb3Igc3RhdHVzIGNvZGUuXG4gICAqL1xuICBzaHV0ZG93bihyZXE6IFNodXRkb3duV3JhcDxMaWJ1dlN0cmVhbVdyYXA+KTogbnVtYmVyIHtcbiAgICBjb25zdCBzdGF0dXMgPSB0aGlzLl9vbkNsb3NlKCk7XG5cbiAgICB0cnkge1xuICAgICAgcmVxLm9uY29tcGxldGUoc3RhdHVzKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIHN3YWxsb3cgY2FsbGJhY2sgZXJyb3IuXG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHVzZXJCdWZcbiAgICogQHJldHVybiBBbiBlcnJvciBzdGF0dXMgY29kZS5cbiAgICovXG4gIHVzZVVzZXJCdWZmZXIoX3VzZXJCdWY6IHVua25vd24pOiBudW1iZXIge1xuICAgIC8vIFRPRE8oY21vcnRlbilcbiAgICBub3RJbXBsZW1lbnRlZChcIkxpYnV2U3RyZWFtV3JhcC5wcm90b3R5cGUudXNlVXNlckJ1ZmZlclwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBhIGJ1ZmZlciB0byB0aGUgc3RyZWFtLlxuICAgKiBAcGFyYW0gcmVxIEEgd3JpdGUgcmVxdWVzdCB3cmFwcGVyLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgVWludDhBcnJheSBidWZmZXIgdG8gd3JpdGUgdG8gdGhlIHN0cmVhbS5cbiAgICogQHJldHVybiBBbiBlcnJvciBzdGF0dXMgY29kZS5cbiAgICovXG4gIHdyaXRlQnVmZmVyKHJlcTogV3JpdGVXcmFwPExpYnV2U3RyZWFtV3JhcD4sIGRhdGE6IFVpbnQ4QXJyYXkpOiBudW1iZXIge1xuICAgIHRoaXMuI3dyaXRlKHJlcSwgZGF0YSk7XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBtdWx0aXBsZSBjaHVua3MgYXQgb25jZS5cbiAgICogQHBhcmFtIHJlcSBBIHdyaXRlIHJlcXVlc3Qgd3JhcHBlci5cbiAgICogQHBhcmFtIGNodW5rc1xuICAgKiBAcGFyYW0gYWxsQnVmZmVyc1xuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgd3JpdGV2KFxuICAgIHJlcTogV3JpdGVXcmFwPExpYnV2U3RyZWFtV3JhcD4sXG4gICAgY2h1bmtzOiBCdWZmZXJbXSB8IChzdHJpbmcgfCBCdWZmZXIpW10sXG4gICAgYWxsQnVmZmVyczogYm9vbGVhbixcbiAgKTogbnVtYmVyIHtcbiAgICBjb25zdCBjb3VudCA9IGFsbEJ1ZmZlcnMgPyBjaHVua3MubGVuZ3RoIDogY2h1bmtzLmxlbmd0aCA+PiAxO1xuICAgIGNvbnN0IGJ1ZmZlcnM6IEJ1ZmZlcltdID0gbmV3IEFycmF5KGNvdW50KTtcblxuICAgIGlmICghYWxsQnVmZmVycykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNodW5rID0gY2h1bmtzW2kgKiAyXTtcblxuICAgICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkge1xuICAgICAgICAgIGJ1ZmZlcnNbaV0gPSBjaHVuaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0cmluZyBjaHVua1xuICAgICAgICBjb25zdCBlbmNvZGluZzogc3RyaW5nID0gY2h1bmtzW2kgKiAyICsgMV0gYXMgc3RyaW5nO1xuICAgICAgICBidWZmZXJzW2ldID0gQnVmZmVyLmZyb20oY2h1bmsgYXMgc3RyaW5nLCBlbmNvZGluZyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBidWZmZXJzW2ldID0gY2h1bmtzW2ldIGFzIEJ1ZmZlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy53cml0ZUJ1ZmZlcihyZXEsIEJ1ZmZlci5jb25jYXQoYnVmZmVycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGFuIEFTQ0lJIHN0cmluZyB0byB0aGUgc3RyZWFtLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgd3JpdGVBc2NpaVN0cmluZyhyZXE6IFdyaXRlV3JhcDxMaWJ1dlN0cmVhbVdyYXA+LCBkYXRhOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShkYXRhKTtcblxuICAgIHJldHVybiB0aGlzLndyaXRlQnVmZmVyKHJlcSwgYnVmZmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSBhbiBVVEY4IHN0cmluZyB0byB0aGUgc3RyZWFtLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgd3JpdGVVdGY4U3RyaW5nKHJlcTogV3JpdGVXcmFwPExpYnV2U3RyZWFtV3JhcD4sIGRhdGE6IHN0cmluZyk6IG51bWJlciB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGRhdGEpO1xuXG4gICAgcmV0dXJuIHRoaXMud3JpdGVCdWZmZXIocmVxLCBidWZmZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIGFuIFVDUzIgc3RyaW5nIHRvIHRoZSBzdHJlYW0uXG4gICAqIEByZXR1cm4gQW4gZXJyb3Igc3RhdHVzIGNvZGUuXG4gICAqL1xuICB3cml0ZVVjczJTdHJpbmcoX3JlcTogV3JpdGVXcmFwPExpYnV2U3RyZWFtV3JhcD4sIF9kYXRhOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIG5vdEltcGxlbWVudGVkKFwiTGlidXZTdHJlYW1XcmFwLnByb3RvdHlwZS53cml0ZVVjczJTdHJpbmdcIik7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgYW4gTEFUSU4xIHN0cmluZyB0byB0aGUgc3RyZWFtLlxuICAgKiBAcmV0dXJuIEFuIGVycm9yIHN0YXR1cyBjb2RlLlxuICAgKi9cbiAgd3JpdGVMYXRpbjFTdHJpbmcocmVxOiBXcml0ZVdyYXA8TGlidXZTdHJlYW1XcmFwPiwgZGF0YTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShkYXRhLCBcImxhdGluMVwiKTtcbiAgICByZXR1cm4gdGhpcy53cml0ZUJ1ZmZlcihyZXEsIGJ1ZmZlcik7XG4gIH1cblxuICBvdmVycmlkZSBfb25DbG9zZSgpOiBudW1iZXIge1xuICAgIGxldCBzdGF0dXMgPSAwO1xuICAgIHRoaXMuI3JlYWRpbmcgPSBmYWxzZTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzW2tTdHJlYW1CYXNlRmllbGRdPy5jbG9zZSgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgc3RhdHVzID0gY29kZU1hcC5nZXQoXCJFTk9UQ09OTlwiKSE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgY2xhc3MgdG8gdGhlIHVuZGVybHlpbmcgc3RyZWFtLlxuICAgKiBAcGFyYW0gc3RyZWFtIFRoZSBzdHJlYW0gdG8gYXR0YWNoIHRvLlxuICAgKi9cbiAgI2F0dGFjaFRvT2JqZWN0KHN0cmVhbT86IFJlYWRlciAmIFdyaXRlciAmIENsb3NlciAmIFJlZikge1xuICAgIHRoaXNba1N0cmVhbUJhc2VGaWVsZF0gPSBzdHJlYW07XG4gIH1cblxuICAvKiogSW50ZXJuYWwgbWV0aG9kIGZvciByZWFkaW5nIGZyb20gdGhlIGF0dGFjaGVkIHN0cmVhbS4gKi9cbiAgYXN5bmMgI3JlYWQoKSB7XG4gICAgbGV0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KFNVR0dFU1RFRF9TSVpFKTtcblxuICAgIGxldCBucmVhZDogbnVtYmVyIHwgbnVsbDtcbiAgICB0cnkge1xuICAgICAgbnJlYWQgPSBhd2FpdCB0aGlzW2tTdHJlYW1CYXNlRmllbGRdIS5yZWFkKGJ1Zik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKFxuICAgICAgICBlIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuSW50ZXJydXB0ZWQgfHxcbiAgICAgICAgZSBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLkJhZFJlc291cmNlXG4gICAgICApIHtcbiAgICAgICAgbnJlYWQgPSBjb2RlTWFwLmdldChcIkVPRlwiKSE7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBlIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuQ29ubmVjdGlvblJlc2V0IHx8XG4gICAgICAgIGUgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Db25uZWN0aW9uQWJvcnRlZFxuICAgICAgKSB7XG4gICAgICAgIG5yZWFkID0gY29kZU1hcC5nZXQoXCJFQ09OTlJFU0VUXCIpITtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5yZWFkID0gY29kZU1hcC5nZXQoXCJVTktOT1dOXCIpITtcbiAgICAgIH1cblxuICAgICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoMCk7XG4gICAgfVxuXG4gICAgbnJlYWQgPz89IGNvZGVNYXAuZ2V0KFwiRU9GXCIpITtcblxuICAgIHN0cmVhbUJhc2VTdGF0ZVtrUmVhZEJ5dGVzT3JFcnJvcl0gPSBucmVhZDtcblxuICAgIGlmIChucmVhZCA+IDApIHtcbiAgICAgIHRoaXMuYnl0ZXNSZWFkICs9IG5yZWFkO1xuICAgIH1cblxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBucmVhZCk7XG5cbiAgICBzdHJlYW1CYXNlU3RhdGVba0FycmF5QnVmZmVyT2Zmc2V0XSA9IDA7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5vbnJlYWQhKGJ1ZiwgbnJlYWQpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gc3dhbGxvdyBjYWxsYmFjayBlcnJvcnMuXG4gICAgfVxuXG4gICAgaWYgKG5yZWFkID49IDAgJiYgdGhpcy4jcmVhZGluZykge1xuICAgICAgdGhpcy4jcmVhZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBtZXRob2QgZm9yIHdyaXRpbmcgdG8gdGhlIGF0dGFjaGVkIHN0cmVhbS5cbiAgICogQHBhcmFtIHJlcSBBIHdyaXRlIHJlcXVlc3Qgd3JhcHBlci5cbiAgICogQHBhcmFtIGRhdGEgVGhlIFVpbnQ4QXJyYXkgYnVmZmVyIHRvIHdyaXRlIHRvIHRoZSBzdHJlYW0uXG4gICAqL1xuICBhc3luYyAjd3JpdGUocmVxOiBXcml0ZVdyYXA8TGlidXZTdHJlYW1XcmFwPiwgZGF0YTogVWludDhBcnJheSkge1xuICAgIGNvbnN0IHsgYnl0ZUxlbmd0aCB9ID0gZGF0YTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCB3cml0ZUFsbCh0aGlzW2tTdHJlYW1CYXNlRmllbGRdISwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbGV0IHN0YXR1czogbnVtYmVyO1xuXG4gICAgICAvLyBUT0RPKGNtb3J0ZW4pOiBtYXAgZXJyIHRvIHN0YXR1cyBjb2Rlc1xuICAgICAgaWYgKFxuICAgICAgICBlIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuQmFkUmVzb3VyY2UgfHxcbiAgICAgICAgZSBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLkJyb2tlblBpcGVcbiAgICAgICkge1xuICAgICAgICBzdGF0dXMgPSBjb2RlTWFwLmdldChcIkVCQURGXCIpITtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1cyA9IGNvZGVNYXAuZ2V0KFwiVU5LTk9XTlwiKSE7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcS5vbmNvbXBsZXRlKHN0YXR1cyk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gc3dhbGxvdyBjYWxsYmFjayBlcnJvcnMuXG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdHJlYW1CYXNlU3RhdGVba0J5dGVzV3JpdHRlbl0gPSBieXRlTGVuZ3RoO1xuICAgIHRoaXMuYnl0ZXNXcml0dGVuICs9IGJ5dGVMZW5ndGg7XG5cbiAgICB0cnkge1xuICAgICAgcmVxLm9uY29tcGxldGUoMCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBzd2FsbG93IGNhbGxiYWNrIGVycm9ycy5cbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsc0RBQXNEO0FBQ3RELEVBQUU7QUFDRiwwRUFBMEU7QUFDMUUsZ0VBQWdFO0FBQ2hFLHNFQUFzRTtBQUN0RSxzRUFBc0U7QUFDdEUsNEVB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