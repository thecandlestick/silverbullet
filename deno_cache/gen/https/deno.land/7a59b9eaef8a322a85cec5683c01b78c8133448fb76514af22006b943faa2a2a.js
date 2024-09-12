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
import { Buffer } from "./buffer.ts";
import { normalizeEncoding as castEncoding, notImplemented } from "./_utils.ts";
var NotImplemented;
(function(NotImplemented) {
    NotImplemented[NotImplemented["ascii"] = 0] = "ascii";
    NotImplemented[NotImplemented["latin1"] = 1] = "latin1";
    NotImplemented[NotImplemented["utf16le"] = 2] = "utf16le";
})(NotImplemented || (NotImplemented = {}));
function normalizeEncoding(enc) {
    const encoding = castEncoding(enc ?? null);
    if (encoding && encoding in NotImplemented) notImplemented(encoding);
    if (!encoding && typeof enc === "string" && enc.toLowerCase() !== "raw") {
        throw new Error(`Unknown encoding: ${enc}`);
    }
    return String(encoding);
}
/**
 * Check is `ArrayBuffer` and not `TypedArray`. Typescript allowed `TypedArray` to be passed as `ArrayBuffer` and does not do a deep check
 */ function isBufferType(buf) {
    return buf instanceof ArrayBuffer && buf.BYTES_PER_ELEMENT;
}
/*
 * Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
 * continuation byte. If an invalid byte is detected, -2 is returned.
 */ function utf8CheckByte(byte) {
    if (byte <= 0x7f) return 0;
    else if (byte >> 5 === 0x06) return 2;
    else if (byte >> 4 === 0x0e) return 3;
    else if (byte >> 3 === 0x1e) return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
}
/*
 * Checks at most 3 bytes at the end of a Buffer in order to detect an
 * incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
 * needed to complete the UTF-8 character (if applicable) are returned.
 */ function utf8CheckIncomplete(self, buf, i) {
    let j = buf.length - 1;
    if (j < i) return 0;
    let nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2) nb = 0;
            else self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
/*
 * Validates as many continuation bytes for a multi-byte UTF-8 character as
 * needed or are available. If we see a non-continuation byte where we expect
 * one, we "replace" the validated continuation bytes we've seen so far with
 * a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
 * behavior. The continuation byte check is included three times in the case
 * where all of the continuation bytes for a character exist in the same buffer.
 * It is also done this way as a slight performance increase instead of using a
 * loop.
 */ function utf8CheckExtraBytes(self, buf) {
    if ((buf[0] & 0xc0) !== 0x80) {
        self.lastNeed = 0;
        return "\ufffd";
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xc0) !== 0x80) {
            self.lastNeed = 1;
            return "\ufffd";
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xc0) !== 0x80) {
                self.lastNeed = 2;
                return "\ufffd";
            }
        }
    }
}
/*
 * Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
 */ function utf8FillLastComplete(buf) {
    const p = this.lastTotal - this.lastNeed;
    const r = utf8CheckExtraBytes(this, buf);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
/*
 * Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
 */ function utf8FillLastIncomplete(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
}
/*
 * Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
 * partial character, the character's bytes are buffered until the required
 * number of bytes are available.
 */ function utf8Text(buf, i) {
    const total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString("utf8", i);
    this.lastTotal = total;
    const end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
}
/*
 * For UTF-8, a replacement character is added when ending on a partial
 * character.
 */ function utf8End(buf) {
    const r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) return r + "\ufffd";
    return r;
}
function utf8Write(buf) {
    if (typeof buf === "string") {
        return buf;
    }
    if (buf.length === 0) return "";
    let r;
    let i;
    // Because `TypedArray` is recognized as `ArrayBuffer` but in the reality, there are some fundamental difference. We would need to cast it properly
    const normalizedBuffer = isBufferType(buf) ? buf : Buffer.from(buf);
    if (this.lastNeed) {
        r = this.fillLast(normalizedBuffer);
        if (r === undefined) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
    } else {
        i = 0;
    }
    if (i < buf.length) {
        return r ? r + this.text(normalizedBuffer, i) : this.text(normalizedBuffer, i);
    }
    return r || "";
}
function base64Text(buf, i) {
    const n = (buf.length - i) % 3;
    if (n === 0) return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
}
function base64End(buf) {
    const r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    }
    return r;
}
function simpleWrite(buf) {
    if (typeof buf === "string") {
        return buf;
    }
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
}
class StringDecoderBase {
    encoding;
    lastChar;
    lastNeed;
    lastTotal;
    constructor(encoding, nb){
        this.encoding = encoding;
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer.allocUnsafe(nb);
    }
}
class Base64Decoder extends StringDecoderBase {
    end = base64End;
    fillLast = utf8FillLastIncomplete;
    text = base64Text;
    write = utf8Write;
    constructor(encoding){
        super(normalizeEncoding(encoding), 3);
    }
}
class GenericDecoder extends StringDecoderBase {
    end = simpleEnd;
    fillLast = undefined;
    text = utf8Text;
    write = simpleWrite;
    constructor(encoding){
        super(normalizeEncoding(encoding), 4);
    }
}
class Utf8Decoder extends StringDecoderBase {
    end = utf8End;
    fillLast = utf8FillLastComplete;
    text = utf8Text;
    write = utf8Write;
    constructor(encoding){
        super(normalizeEncoding(encoding), 4);
    }
}
/*
 * StringDecoder provides an interface for efficiently splitting a series of
 * buffers into a series of JS strings without breaking apart multi-byte
 * characters.
 */ export class StringDecoder {
    encoding;
    end;
    fillLast;
    lastChar;
    lastNeed;
    lastTotal;
    text;
    write;
    constructor(encoding){
        const normalizedEncoding = normalizeEncoding(encoding);
        let decoder;
        switch(normalizedEncoding){
            case "utf8":
                decoder = new Utf8Decoder(encoding);
                break;
            case "base64":
                decoder = new Base64Decoder(encoding);
                break;
            default:
                decoder = new GenericDecoder(encoding);
        }
        this.encoding = decoder.encoding;
        this.end = decoder.end;
        this.fillLast = decoder.fillLast;
        this.lastChar = decoder.lastChar;
        this.lastNeed = decoder.lastNeed;
        this.lastTotal = decoder.lastTotal;
        this.text = decoder.text;
        this.write = decoder.write;
    }
}
// Allow calling StringDecoder() without new
const PStringDecoder = new Proxy(StringDecoder, {
    apply (_target, thisArg, args) {
        // @ts-ignore tedious to replicate types ...
        return Object.assign(thisArg, new StringDecoder(...args));
    }
});
export default {
    StringDecoder: PStringDecoder
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE3Ny4wL25vZGUvc3RyaW5nX2RlY29kZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiLi9idWZmZXIudHNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZUVuY29kaW5nIGFzIGNhc3RFbmNvZGluZywgbm90SW1wbGVtZW50ZWQgfSBmcm9tIFwiLi9fdXRpbHMudHNcIjtcblxuZW51bSBOb3RJbXBsZW1lbnRlZCB7XG4gIFwiYXNjaWlcIixcbiAgXCJsYXRpbjFcIixcbiAgXCJ1dGYxNmxlXCIsXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUVuY29kaW5nKGVuYz86IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGVuY29kaW5nID0gY2FzdEVuY29kaW5nKGVuYyA/PyBudWxsKTtcbiAgaWYgKGVuY29kaW5nICYmIGVuY29kaW5nIGluIE5vdEltcGxlbWVudGVkKSBub3RJbXBsZW1lbnRlZChlbmNvZGluZyk7XG4gIGlmICghZW5jb2RpbmcgJiYgdHlwZW9mIGVuYyA9PT0gXCJzdHJpbmdcIiAmJiBlbmMudG9Mb3dlckNhc2UoKSAhPT0gXCJyYXdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBlbmNvZGluZzogJHtlbmN9YCk7XG4gIH1cbiAgcmV0dXJuIFN0cmluZyhlbmNvZGluZyk7XG59XG5cbi8qKlxuICogQ2hlY2sgaXMgYEFycmF5QnVmZmVyYCBhbmQgbm90IGBUeXBlZEFycmF5YC4gVHlwZXNjcmlwdCBhbGxvd2VkIGBUeXBlZEFycmF5YCB0byBiZSBwYXNzZWQgYXMgYEFycmF5QnVmZmVyYCBhbmQgZG9lcyBub3QgZG8gYSBkZWVwIGNoZWNrXG4gKi9cblxuZnVuY3Rpb24gaXNCdWZmZXJUeXBlKGJ1ZjogQnVmZmVyKSB7XG4gIHJldHVybiBidWYgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciAmJiBidWYuQllURVNfUEVSX0VMRU1FTlQ7XG59XG5cbi8qXG4gKiBDaGVja3MgdGhlIHR5cGUgb2YgYSBVVEYtOCBieXRlLCB3aGV0aGVyIGl0J3MgQVNDSUksIGEgbGVhZGluZyBieXRlLCBvciBhXG4gKiBjb250aW51YXRpb24gYnl0ZS4gSWYgYW4gaW52YWxpZCBieXRlIGlzIGRldGVjdGVkLCAtMiBpcyByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gdXRmOENoZWNrQnl0ZShieXRlOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAoYnl0ZSA8PSAweDdmKSByZXR1cm4gMDtcbiAgZWxzZSBpZiAoYnl0ZSA+PiA1ID09PSAweDA2KSByZXR1cm4gMjtcbiAgZWxzZSBpZiAoYnl0ZSA+PiA0ID09PSAweDBlKSByZXR1cm4gMztcbiAgZWxzZSBpZiAoYnl0ZSA+PiAzID09PSAweDFlKSByZXR1cm4gNDtcbiAgcmV0dXJuIGJ5dGUgPj4gNiA9PT0gMHgwMiA/IC0xIDogLTI7XG59XG5cbi8qXG4gKiBDaGVja3MgYXQgbW9zdCAzIGJ5dGVzIGF0IHRoZSBlbmQgb2YgYSBCdWZmZXIgaW4gb3JkZXIgdG8gZGV0ZWN0IGFuXG4gKiBpbmNvbXBsZXRlIG11bHRpLWJ5dGUgVVRGLTggY2hhcmFjdGVyLiBUaGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzICgyLCAzLCBvciA0KVxuICogbmVlZGVkIHRvIGNvbXBsZXRlIHRoZSBVVEYtOCBjaGFyYWN0ZXIgKGlmIGFwcGxpY2FibGUpIGFyZSByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gdXRmOENoZWNrSW5jb21wbGV0ZShcbiAgc2VsZjogU3RyaW5nRGVjb2RlckJhc2UsXG4gIGJ1ZjogQnVmZmVyLFxuICBpOiBudW1iZXIsXG4pOiBudW1iZXIge1xuICBsZXQgaiA9IGJ1Zi5sZW5ndGggLSAxO1xuICBpZiAoaiA8IGkpIHJldHVybiAwO1xuICBsZXQgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMTtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkgfHwgbmIgPT09IC0yKSByZXR1cm4gMDtcbiAgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMjtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkgfHwgbmIgPT09IC0yKSByZXR1cm4gMDtcbiAgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkge1xuICAgICAgaWYgKG5iID09PSAyKSBuYiA9IDA7XG4gICAgICBlbHNlIHNlbGYubGFzdE5lZWQgPSBuYiAtIDM7XG4gICAgfVxuICAgIHJldHVybiBuYjtcbiAgfVxuICByZXR1cm4gMDtcbn1cblxuLypcbiAqIFZhbGlkYXRlcyBhcyBtYW55IGNvbnRpbnVhdGlvbiBieXRlcyBmb3IgYSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3RlciBhc1xuICogbmVlZGVkIG9yIGFyZSBhdmFpbGFibGUuIElmIHdlIHNlZSBhIG5vbi1jb250aW51YXRpb24gYnl0ZSB3aGVyZSB3ZSBleHBlY3RcbiAqIG9uZSwgd2UgXCJyZXBsYWNlXCIgdGhlIHZhbGlkYXRlZCBjb250aW51YXRpb24gYnl0ZXMgd2UndmUgc2VlbiBzbyBmYXIgd2l0aFxuICogYSBzaW5nbGUgVVRGLTggcmVwbGFjZW1lbnQgY2hhcmFjdGVyICgnXFx1ZmZmZCcpLCB0byBtYXRjaCB2OCdzIFVURi04IGRlY29kaW5nXG4gKiBiZWhhdmlvci4gVGhlIGNvbnRpbnVhdGlvbiBieXRlIGNoZWNrIGlzIGluY2x1ZGVkIHRocmVlIHRpbWVzIGluIHRoZSBjYXNlXG4gKiB3aGVyZSBhbGwgb2YgdGhlIGNvbnRpbnVhdGlvbiBieXRlcyBmb3IgYSBjaGFyYWN0ZXIgZXhpc3QgaW4gdGhlIHNhbWUgYnVmZmVyLlxuICogSXQgaXMgYWxzbyBkb25lIHRoaXMgd2F5IGFzIGEgc2xpZ2h0IHBlcmZvcm1hbmNlIGluY3JlYXNlIGluc3RlYWQgb2YgdXNpbmcgYVxuICogbG9vcC5cbiAqL1xuZnVuY3Rpb24gdXRmOENoZWNrRXh0cmFCeXRlcyhcbiAgc2VsZjogU3RyaW5nRGVjb2RlckJhc2UsXG4gIGJ1ZjogQnVmZmVyLFxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKChidWZbMF0gJiAweGMwKSAhPT0gMHg4MCkge1xuICAgIHNlbGYubGFzdE5lZWQgPSAwO1xuICAgIHJldHVybiBcIlxcdWZmZmRcIjtcbiAgfVxuICBpZiAoc2VsZi5sYXN0TmVlZCA+IDEgJiYgYnVmLmxlbmd0aCA+IDEpIHtcbiAgICBpZiAoKGJ1ZlsxXSAmIDB4YzApICE9PSAweDgwKSB7XG4gICAgICBzZWxmLmxhc3ROZWVkID0gMTtcbiAgICAgIHJldHVybiBcIlxcdWZmZmRcIjtcbiAgICB9XG4gICAgaWYgKHNlbGYubGFzdE5lZWQgPiAyICYmIGJ1Zi5sZW5ndGggPiAyKSB7XG4gICAgICBpZiAoKGJ1ZlsyXSAmIDB4YzApICE9PSAweDgwKSB7XG4gICAgICAgIHNlbGYubGFzdE5lZWQgPSAyO1xuICAgICAgICByZXR1cm4gXCJcXHVmZmZkXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qXG4gKiBBdHRlbXB0cyB0byBjb21wbGV0ZSBhIG11bHRpLWJ5dGUgVVRGLTggY2hhcmFjdGVyIHVzaW5nIGJ5dGVzIGZyb20gYSBCdWZmZXIuXG4gKi9cbmZ1bmN0aW9uIHV0ZjhGaWxsTGFzdENvbXBsZXRlKFxuICB0aGlzOiBTdHJpbmdEZWNvZGVyQmFzZSxcbiAgYnVmOiBCdWZmZXIsXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBwID0gdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkO1xuICBjb25zdCByID0gdXRmOENoZWNrRXh0cmFCeXRlcyh0aGlzLCBidWYpO1xuICBpZiAociAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcjtcbiAgaWYgKHRoaXMubGFzdE5lZWQgPD0gYnVmLmxlbmd0aCkge1xuICAgIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHAsIDAsIHRoaXMubGFzdE5lZWQpO1xuICAgIHJldHVybiB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsIDAsIHRoaXMubGFzdFRvdGFsKTtcbiAgfVxuICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCBwLCAwLCBidWYubGVuZ3RoKTtcbiAgdGhpcy5sYXN0TmVlZCAtPSBidWYubGVuZ3RoO1xufVxuXG4vKlxuICogQXR0ZW1wdHMgdG8gY29tcGxldGUgYSBwYXJ0aWFsIG5vbi1VVEYtOCBjaGFyYWN0ZXIgdXNpbmcgYnl0ZXMgZnJvbSBhIEJ1ZmZlclxuICovXG5mdW5jdGlvbiB1dGY4RmlsbExhc3RJbmNvbXBsZXRlKFxuICB0aGlzOiBTdHJpbmdEZWNvZGVyQmFzZSxcbiAgYnVmOiBCdWZmZXIsXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAodGhpcy5sYXN0TmVlZCA8PSBidWYubGVuZ3RoKSB7XG4gICAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkLCAwLCB0aGlzLmxhc3ROZWVkKTtcbiAgICByZXR1cm4gdGhpcy5sYXN0Q2hhci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCB0aGlzLmxhc3RUb3RhbCk7XG4gIH1cbiAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkLCAwLCBidWYubGVuZ3RoKTtcbiAgdGhpcy5sYXN0TmVlZCAtPSBidWYubGVuZ3RoO1xufVxuXG4vKlxuICogUmV0dXJucyBhbGwgY29tcGxldGUgVVRGLTggY2hhcmFjdGVycyBpbiBhIEJ1ZmZlci4gSWYgdGhlIEJ1ZmZlciBlbmRlZCBvbiBhXG4gKiBwYXJ0aWFsIGNoYXJhY3RlciwgdGhlIGNoYXJhY3RlcidzIGJ5dGVzIGFyZSBidWZmZXJlZCB1bnRpbCB0aGUgcmVxdWlyZWRcbiAqIG51bWJlciBvZiBieXRlcyBhcmUgYXZhaWxhYmxlLlxuICovXG5mdW5jdGlvbiB1dGY4VGV4dCh0aGlzOiBTdHJpbmdEZWNvZGVyQmFzZSwgYnVmOiBCdWZmZXIsIGk6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IHRvdGFsID0gdXRmOENoZWNrSW5jb21wbGV0ZSh0aGlzLCBidWYsIGkpO1xuICBpZiAoIXRoaXMubGFzdE5lZWQpIHJldHVybiBidWYudG9TdHJpbmcoXCJ1dGY4XCIsIGkpO1xuICB0aGlzLmxhc3RUb3RhbCA9IHRvdGFsO1xuICBjb25zdCBlbmQgPSBidWYubGVuZ3RoIC0gKHRvdGFsIC0gdGhpcy5sYXN0TmVlZCk7XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIDAsIGVuZCk7XG4gIHJldHVybiBidWYudG9TdHJpbmcoXCJ1dGY4XCIsIGksIGVuZCk7XG59XG5cbi8qXG4gKiBGb3IgVVRGLTgsIGEgcmVwbGFjZW1lbnQgY2hhcmFjdGVyIGlzIGFkZGVkIHdoZW4gZW5kaW5nIG9uIGEgcGFydGlhbFxuICogY2hhcmFjdGVyLlxuICovXG5mdW5jdGlvbiB1dGY4RW5kKHRoaXM6IFV0ZjhEZWNvZGVyLCBidWY/OiBCdWZmZXIpOiBzdHJpbmcge1xuICBjb25zdCByID0gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiBcIlwiO1xuICBpZiAodGhpcy5sYXN0TmVlZCkgcmV0dXJuIHIgKyBcIlxcdWZmZmRcIjtcbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZShcbiAgdGhpczogVXRmOERlY29kZXIgfCBCYXNlNjREZWNvZGVyLFxuICBidWY6IEJ1ZmZlciB8IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIGlmICh0eXBlb2YgYnVmID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuICBpZiAoYnVmLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFwiXCI7XG4gIGxldCByO1xuICBsZXQgaTtcbiAgLy8gQmVjYXVzZSBgVHlwZWRBcnJheWAgaXMgcmVjb2duaXplZCBhcyBgQXJyYXlCdWZmZXJgIGJ1dCBpbiB0aGUgcmVhbGl0eSwgdGhlcmUgYXJlIHNvbWUgZnVuZGFtZW50YWwgZGlmZmVyZW5jZS4gV2Ugd291bGQgbmVlZCB0byBjYXN0IGl0IHByb3Blcmx5XG4gIGNvbnN0IG5vcm1hbGl6ZWRCdWZmZXI6IEJ1ZmZlciA9IGlzQnVmZmVyVHlwZShidWYpID8gYnVmIDogQnVmZmVyLmZyb20oYnVmKTtcbiAgaWYgKHRoaXMubGFzdE5lZWQpIHtcbiAgICByID0gdGhpcy5maWxsTGFzdChub3JtYWxpemVkQnVmZmVyKTtcbiAgICBpZiAociA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgICBpID0gdGhpcy5sYXN0TmVlZDtcbiAgICB0aGlzLmxhc3ROZWVkID0gMDtcbiAgfSBlbHNlIHtcbiAgICBpID0gMDtcbiAgfVxuICBpZiAoaSA8IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gclxuICAgICAgPyByICsgdGhpcy50ZXh0KG5vcm1hbGl6ZWRCdWZmZXIsIGkpXG4gICAgICA6IHRoaXMudGV4dChub3JtYWxpemVkQnVmZmVyLCBpKTtcbiAgfVxuICByZXR1cm4gciB8fCBcIlwiO1xufVxuXG5mdW5jdGlvbiBiYXNlNjRUZXh0KHRoaXM6IFN0cmluZ0RlY29kZXJCYXNlLCBidWY6IEJ1ZmZlciwgaTogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgbiA9IChidWYubGVuZ3RoIC0gaSkgJSAzO1xuICBpZiAobiA9PT0gMCkgcmV0dXJuIGJ1Zi50b1N0cmluZyhcImJhc2U2NFwiLCBpKTtcbiAgdGhpcy5sYXN0TmVlZCA9IDMgLSBuO1xuICB0aGlzLmxhc3RUb3RhbCA9IDM7XG4gIGlmIChuID09PSAxKSB7XG4gICAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMl07XG4gICAgdGhpcy5sYXN0Q2hhclsxXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gIH1cbiAgcmV0dXJuIGJ1Zi50b1N0cmluZyhcImJhc2U2NFwiLCBpLCBidWYubGVuZ3RoIC0gbik7XG59XG5cbmZ1bmN0aW9uIGJhc2U2NEVuZCh0aGlzOiBCYXNlNjREZWNvZGVyLCBidWY/OiBCdWZmZXIpOiBzdHJpbmcge1xuICBjb25zdCByID0gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiBcIlwiO1xuICBpZiAodGhpcy5sYXN0TmVlZCkge1xuICAgIHJldHVybiByICsgdGhpcy5sYXN0Q2hhci50b1N0cmluZyhcImJhc2U2NFwiLCAwLCAzIC0gdGhpcy5sYXN0TmVlZCk7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIHNpbXBsZVdyaXRlKFxuICB0aGlzOiBTdHJpbmdEZWNvZGVyQmFzZSxcbiAgYnVmOiBCdWZmZXIgfCBzdHJpbmcsXG4pOiBzdHJpbmcge1xuICBpZiAodHlwZW9mIGJ1ZiA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBidWY7XG4gIH1cbiAgcmV0dXJuIGJ1Zi50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gc2ltcGxlRW5kKHRoaXM6IEdlbmVyaWNEZWNvZGVyLCBidWY/OiBCdWZmZXIpOiBzdHJpbmcge1xuICByZXR1cm4gYnVmICYmIGJ1Zi5sZW5ndGggPyB0aGlzLndyaXRlKGJ1ZikgOiBcIlwiO1xufVxuXG5jbGFzcyBTdHJpbmdEZWNvZGVyQmFzZSB7XG4gIHB1YmxpYyBsYXN0Q2hhcjogQnVmZmVyO1xuICBwdWJsaWMgbGFzdE5lZWQgPSAwO1xuICBwdWJsaWMgbGFzdFRvdGFsID0gMDtcbiAgY29uc3RydWN0b3IocHVibGljIGVuY29kaW5nOiBzdHJpbmcsIG5iOiBudW1iZXIpIHtcbiAgICB0aGlzLmxhc3RDaGFyID0gQnVmZmVyLmFsbG9jVW5zYWZlKG5iKTtcbiAgfVxufVxuXG5jbGFzcyBCYXNlNjREZWNvZGVyIGV4dGVuZHMgU3RyaW5nRGVjb2RlckJhc2Uge1xuICBwdWJsaWMgZW5kID0gYmFzZTY0RW5kO1xuICBwdWJsaWMgZmlsbExhc3QgPSB1dGY4RmlsbExhc3RJbmNvbXBsZXRlO1xuICBwdWJsaWMgdGV4dCA9IGJhc2U2NFRleHQ7XG4gIHB1YmxpYyB3cml0ZSA9IHV0ZjhXcml0ZTtcblxuICBjb25zdHJ1Y3RvcihlbmNvZGluZz86IHN0cmluZykge1xuICAgIHN1cGVyKG5vcm1hbGl6ZUVuY29kaW5nKGVuY29kaW5nKSwgMyk7XG4gIH1cbn1cblxuY2xhc3MgR2VuZXJpY0RlY29kZXIgZXh0ZW5kcyBTdHJpbmdEZWNvZGVyQmFzZSB7XG4gIHB1YmxpYyBlbmQgPSBzaW1wbGVFbmQ7XG4gIHB1YmxpYyBmaWxsTGFzdCA9IHVuZGVmaW5lZDtcbiAgcHVibGljIHRleHQgPSB1dGY4VGV4dDtcbiAgcHVibGljIHdyaXRlID0gc2ltcGxlV3JpdGU7XG5cbiAgY29uc3RydWN0b3IoZW5jb2Rpbmc/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihub3JtYWxpemVFbmNvZGluZyhlbmNvZGluZyksIDQpO1xuICB9XG59XG5cbmNsYXNzIFV0ZjhEZWNvZGVyIGV4dGVuZHMgU3RyaW5nRGVjb2RlckJhc2Uge1xuICBwdWJsaWMgZW5kID0gdXRmOEVuZDtcbiAgcHVibGljIGZpbGxMYXN0ID0gdXRmOEZpbGxMYXN0Q29tcGxldGU7XG4gIHB1YmxpYyB0ZXh0ID0gdXRmOFRleHQ7XG4gIHB1YmxpYyB3cml0ZSA9IHV0ZjhXcml0ZTtcblxuICBjb25zdHJ1Y3RvcihlbmNvZGluZz86IHN0cmluZykge1xuICAgIHN1cGVyKG5vcm1hbGl6ZUVuY29kaW5nKGVuY29kaW5nKSwgNCk7XG4gIH1cbn1cblxuLypcbiAqIFN0cmluZ0RlY29kZXIgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBlZmZpY2llbnRseSBzcGxpdHRpbmcgYSBzZXJpZXMgb2ZcbiAqIGJ1ZmZlcnMgaW50byBhIHNlcmllcyBvZiBKUyBzdHJpbmdzIHdpdGhvdXQgYnJlYWtpbmcgYXBhcnQgbXVsdGktYnl0ZVxuICogY2hhcmFjdGVycy5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmluZ0RlY29kZXIge1xuICBwdWJsaWMgZW5jb2Rpbmc6IHN0cmluZztcbiAgcHVibGljIGVuZDogKGJ1Zj86IEJ1ZmZlcikgPT4gc3RyaW5nO1xuICBwdWJsaWMgZmlsbExhc3Q6ICgoYnVmOiBCdWZmZXIpID0+IHN0cmluZyB8IHVuZGVmaW5lZCkgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBsYXN0Q2hhcjogQnVmZmVyO1xuICBwdWJsaWMgbGFzdE5lZWQ6IG51bWJlcjtcbiAgcHVibGljIGxhc3RUb3RhbDogbnVtYmVyO1xuICBwdWJsaWMgdGV4dDogKGJ1ZjogQnVmZmVyLCBuOiBudW1iZXIpID0+IHN0cmluZztcbiAgcHVibGljIHdyaXRlOiAoYnVmOiBCdWZmZXIpID0+IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihlbmNvZGluZz86IHN0cmluZykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRFbmNvZGluZyA9IG5vcm1hbGl6ZUVuY29kaW5nKGVuY29kaW5nKTtcbiAgICBsZXQgZGVjb2RlcjogVXRmOERlY29kZXIgfCBCYXNlNjREZWNvZGVyIHwgR2VuZXJpY0RlY29kZXI7XG4gICAgc3dpdGNoIChub3JtYWxpemVkRW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgXCJ1dGY4XCI6XG4gICAgICAgIGRlY29kZXIgPSBuZXcgVXRmOERlY29kZXIoZW5jb2RpbmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJiYXNlNjRcIjpcbiAgICAgICAgZGVjb2RlciA9IG5ldyBCYXNlNjREZWNvZGVyKGVuY29kaW5nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkZWNvZGVyID0gbmV3IEdlbmVyaWNEZWNvZGVyKGVuY29kaW5nKTtcbiAgICB9XG4gICAgdGhpcy5lbmNvZGluZyA9IGRlY29kZXIuZW5jb2Rpbmc7XG4gICAgdGhpcy5lbmQgPSBkZWNvZGVyLmVuZDtcbiAgICB0aGlzLmZpbGxMYXN0ID0gZGVjb2Rlci5maWxsTGFzdDtcbiAgICB0aGlzLmxhc3RDaGFyID0gZGVjb2Rlci5sYXN0Q2hhcjtcbiAgICB0aGlzLmxhc3ROZWVkID0gZGVjb2Rlci5sYXN0TmVlZDtcbiAgICB0aGlzLmxhc3RUb3RhbCA9IGRlY29kZXIubGFzdFRvdGFsO1xuICAgIHRoaXMudGV4dCA9IGRlY29kZXIudGV4dDtcbiAgICB0aGlzLndyaXRlID0gZGVjb2Rlci53cml0ZTtcbiAgfVxufVxuLy8gQWxsb3cgY2FsbGluZyBTdHJpbmdEZWNvZGVyKCkgd2l0aG91dCBuZXdcbmNvbnN0IFBTdHJpbmdEZWNvZGVyID0gbmV3IFByb3h5KFN0cmluZ0RlY29kZXIsIHtcbiAgYXBwbHkoX3RhcmdldCwgdGhpc0FyZywgYXJncykge1xuICAgIC8vIEB0cy1pZ25vcmUgdGVkaW91cyB0byByZXBsaWNhdGUgdHlwZXMgLi4uXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24odGhpc0FyZywgbmV3IFN0cmluZ0RlY29kZXIoLi4uYXJncykpO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHsgU3RyaW5nRGVjb2RlcjogUFN0cmluZ0RlY29kZXIgfTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsc0RB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