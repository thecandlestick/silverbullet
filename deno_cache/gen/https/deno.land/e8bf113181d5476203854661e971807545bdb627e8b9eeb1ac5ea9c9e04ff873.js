// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/** Platform-specific conventions for the line ending format (i.e., the "end-of-line"). */ export var EOL;
(function(EOL) {
    EOL[/** Line Feed. Typically used in Unix (and Unix-like) systems. */ "LF"] = "\n";
    EOL[/** Carriage Return + Line Feed. Historically used in Windows and early DOS systems. */ "CRLF"] = "\r\n";
})(EOL || (EOL = {}));
const regDetect = /(?:\r?\n)/g;
/**
 * Detect the EOL character for string input.
 * returns null if no newline
 */ export function detect(content) {
    const d = content.match(regDetect);
    if (!d || d.length === 0) {
        return null;
    }
    const hasCRLF = d.some((x)=>x === EOL.CRLF);
    return hasCRLF ? EOL.CRLF : EOL.LF;
}
/** Format the file to the targeted EOL */ export function format(content, eol) {
    return content.replace(regDetect, eol);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL2VvbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuXG4vKiogUGxhdGZvcm0tc3BlY2lmaWMgY29udmVudGlvbnMgZm9yIHRoZSBsaW5lIGVuZGluZyBmb3JtYXQgKGkuZS4sIHRoZSBcImVuZC1vZi1saW5lXCIpLiAqL1xuZXhwb3J0IGVudW0gRU9MIHtcbiAgLyoqIExpbmUgRmVlZC4gVHlwaWNhbGx5IHVzZWQgaW4gVW5peCAoYW5kIFVuaXgtbGlrZSkgc3lzdGVtcy4gKi9cbiAgTEYgPSBcIlxcblwiLFxuICAvKiogQ2FycmlhZ2UgUmV0dXJuICsgTGluZSBGZWVkLiBIaXN0b3JpY2FsbHkgdXNlZCBpbiBXaW5kb3dzIGFuZCBlYXJseSBET1Mgc3lzdGVtcy4gKi9cbiAgQ1JMRiA9IFwiXFxyXFxuXCIsXG59XG5cbmNvbnN0IHJlZ0RldGVjdCA9IC8oPzpcXHI/XFxuKS9nO1xuXG4vKipcbiAqIERldGVjdCB0aGUgRU9MIGNoYXJhY3RlciBmb3Igc3RyaW5nIGlucHV0LlxuICogcmV0dXJucyBudWxsIGlmIG5vIG5ld2xpbmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdChjb250ZW50OiBzdHJpbmcpOiBFT0wgfCBudWxsIHtcbiAgY29uc3QgZCA9IGNvbnRlbnQubWF0Y2gocmVnRGV0ZWN0KTtcbiAgaWYgKCFkIHx8IGQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgaGFzQ1JMRiA9IGQuc29tZSgoeDogc3RyaW5nKTogYm9vbGVhbiA9PiB4ID09PSBFT0wuQ1JMRik7XG5cbiAgcmV0dXJuIGhhc0NSTEYgPyBFT0wuQ1JMRiA6IEVPTC5MRjtcbn1cblxuLyoqIEZvcm1hdCB0aGUgZmlsZSB0byB0aGUgdGFyZ2V0ZWQgRU9MICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KGNvbnRlbnQ6IHN0cmluZywgZW9sOiBFT0wpOiBzdHJpbmcge1xuICByZXR1cm4gY29udGVudC5yZXBsYWNlKHJlZ0RldGVjdCwgZW9sKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUscUNBQXFDO0FBRXJDLHdGQUF3RixjQUNqRjtVQUFLLEdBQUc7SUFBSCxJQUNWLCtEQUErRCxHQUMvRCxRQUFLO0lBRkssSUFHVixxRkFBcUYsR0FDckYsVUFBTztHQUpHLFFBQUE7QUFPWixNQUFNLFlBQVk7QUFFbEI7OztDQUdDLEdBQ0QsT0FBTyxTQUFTLE9BQU8sT0FBZSxFQUFjO0lBQ2xELE1BQU0sSUFBSSxRQUFRLEtBQUssQ0FBQztJQUN4QixJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sS0FBSyxHQUFHO1FBQ3hCLE9BQU8sSUFBSTtJQUNiLENBQUM7SUFDRCxNQUFNLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUF1QixNQUFNLElBQUksSUFBSTtJQUU3RCxPQUFPLFVBQVUsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFO0FBQ3BDLENBQUM7QUFFRCx3Q0FBd0MsR0FDeEMsT0FBTyxTQUFTLE9BQU8sT0FBZSxFQUFFLEdBQVEsRUFBVTtJQUN4RCxPQUFPLFFBQVEsT0FBTyxDQUFDLFdBQVc7QUFDcEMsQ0FBQyJ9