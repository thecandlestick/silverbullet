// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
import { isNegativeZero } from "../_utils.ts";
function isHexCode(c) {
    return 0x30 <= /* 0 */ c && c <= 0x39 || 0x41 <= /* A */ c && c <= 0x46 || 0x61 <= /* a */ c && c <= 0x66;
}
function isOctCode(c) {
    return 0x30 <= /* 0 */ c && c <= 0x37 /* 7 */ ;
}
function isDecCode(c) {
    return 0x30 <= /* 0 */ c && c <= 0x39 /* 9 */ ;
}
function resolveYamlInteger(data) {
    const max = data.length;
    let index = 0;
    let hasDigits = false;
    if (!max) return false;
    let ch = data[index];
    // sign
    if (ch === "-" || ch === "+") {
        ch = data[++index];
    }
    if (ch === "0") {
        // 0
        if (index + 1 === max) return true;
        ch = data[++index];
        // base 2, base 8, base 16
        if (ch === "b") {
            // base 2
            index++;
            for(; index < max; index++){
                ch = data[index];
                if (ch === "_") continue;
                if (ch !== "0" && ch !== "1") return false;
                hasDigits = true;
            }
            return hasDigits && ch !== "_";
        }
        if (ch === "x") {
            // base 16
            index++;
            for(; index < max; index++){
                ch = data[index];
                if (ch === "_") continue;
                if (!isHexCode(data.charCodeAt(index))) return false;
                hasDigits = true;
            }
            return hasDigits && ch !== "_";
        }
        // base 8
        for(; index < max; index++){
            ch = data[index];
            if (ch === "_") continue;
            if (!isOctCode(data.charCodeAt(index))) return false;
            hasDigits = true;
        }
        return hasDigits && ch !== "_";
    }
    // base 10 (except 0) or base 60
    // value should not start with `_`;
    if (ch === "_") return false;
    for(; index < max; index++){
        ch = data[index];
        if (ch === "_") continue;
        if (ch === ":") break;
        if (!isDecCode(data.charCodeAt(index))) {
            return false;
        }
        hasDigits = true;
    }
    // Should have digits and should not end with `_`
    if (!hasDigits || ch === "_") return false;
    // if !base60 - done;
    if (ch !== ":") return true;
    // base60 almost not used, no needs to optimize
    return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}
function constructYamlInteger(data) {
    let value = data;
    const digits = [];
    if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
    }
    let sign = 1;
    let ch = value[0];
    if (ch === "-" || ch === "+") {
        if (ch === "-") sign = -1;
        value = value.slice(1);
        ch = value[0];
    }
    if (value === "0") return 0;
    if (ch === "0") {
        if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x") return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
    }
    if (value.indexOf(":") !== -1) {
        value.split(":").forEach((v)=>{
            digits.unshift(parseInt(v, 10));
        });
        let valueInt = 0;
        let base = 1;
        digits.forEach((d)=>{
            valueInt += d * base;
            base *= 60;
        });
        return sign * valueInt;
    }
    return sign * parseInt(value, 10);
}
function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && object % 1 === 0 && !isNegativeZero(object);
}
export const int = new Type("tag:yaml.org,2002:int", {
    construct: constructYamlInteger,
    defaultStyle: "decimal",
    kind: "scalar",
    predicate: isInteger,
    represent: {
        binary (obj) {
            return obj >= 0 ? `0b${obj.toString(2)}` : `-0b${obj.toString(2).slice(1)}`;
        },
        octal (obj) {
            return obj >= 0 ? `0${obj.toString(8)}` : `-0${obj.toString(8).slice(1)}`;
        },
        decimal (obj) {
            return obj.toString(10);
        },
        hexadecimal (obj) {
            return obj >= 0 ? `0x${obj.toString(16).toUpperCase()}` : `-0x${obj.toString(16).toUpperCase().slice(1)}`;
        }
    },
    resolve: resolveYamlInteger,
    styleAliases: {
        binary: [
            2,
            "bin"
        ],
        decimal: [
            10,
            "dec"
        ],
        hexadecimal: [
            16,
            "hex"
        ],
        octal: [
            8,
            "oct"
        ]
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvaW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFBvcnRlZCBmcm9tIGpzLXlhbWwgdjMuMTMuMTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlY2EvanMteWFtbC9jb21taXQvNjY1YWFkZGE0MjM0OWRjYWU4NjlmMTIwNDBkOWIxMGVmMThkMTJkYVxuLy8gQ29weXJpZ2h0IDIwMTEtMjAxNSBieSBWaXRhbHkgUHV6cmluLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCAyMDE4LTIwMjMgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5cbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vdHlwZS50c1wiO1xuaW1wb3J0IHsgQW55LCBpc05lZ2F0aXZlWmVybyB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcblxuZnVuY3Rpb24gaXNIZXhDb2RlKGM6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgICgweDMwIDw9IC8qIDAgKi8gYyAmJiBjIDw9IDB4MzkpIC8qIDkgKi8gfHxcbiAgICAoMHg0MSA8PSAvKiBBICovIGMgJiYgYyA8PSAweDQ2KSAvKiBGICovIHx8XG4gICAgKDB4NjEgPD0gLyogYSAqLyBjICYmIGMgPD0gMHg2NikgLyogZiAqL1xuICApO1xufVxuXG5mdW5jdGlvbiBpc09jdENvZGUoYzogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAweDMwIDw9IC8qIDAgKi8gYyAmJiBjIDw9IDB4MzcgLyogNyAqLztcbn1cblxuZnVuY3Rpb24gaXNEZWNDb2RlKGM6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gMHgzMCA8PSAvKiAwICovIGMgJiYgYyA8PSAweDM5IC8qIDkgKi87XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sSW50ZWdlcihkYXRhOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgbWF4ID0gZGF0YS5sZW5ndGg7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBoYXNEaWdpdHMgPSBmYWxzZTtcblxuICBpZiAoIW1heCkgcmV0dXJuIGZhbHNlO1xuXG4gIGxldCBjaCA9IGRhdGFbaW5kZXhdO1xuXG4gIC8vIHNpZ25cbiAgaWYgKGNoID09PSBcIi1cIiB8fCBjaCA9PT0gXCIrXCIpIHtcbiAgICBjaCA9IGRhdGFbKytpbmRleF07XG4gIH1cblxuICBpZiAoY2ggPT09IFwiMFwiKSB7XG4gICAgLy8gMFxuICAgIGlmIChpbmRleCArIDEgPT09IG1heCkgcmV0dXJuIHRydWU7XG4gICAgY2ggPSBkYXRhWysraW5kZXhdO1xuXG4gICAgLy8gYmFzZSAyLCBiYXNlIDgsIGJhc2UgMTZcblxuICAgIGlmIChjaCA9PT0gXCJiXCIpIHtcbiAgICAgIC8vIGJhc2UgMlxuICAgICAgaW5kZXgrKztcblxuICAgICAgZm9yICg7IGluZGV4IDwgbWF4OyBpbmRleCsrKSB7XG4gICAgICAgIGNoID0gZGF0YVtpbmRleF07XG4gICAgICAgIGlmIChjaCA9PT0gXCJfXCIpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoY2ggIT09IFwiMFwiICYmIGNoICE9PSBcIjFcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICBoYXNEaWdpdHMgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhc0RpZ2l0cyAmJiBjaCAhPT0gXCJfXCI7XG4gICAgfVxuXG4gICAgaWYgKGNoID09PSBcInhcIikge1xuICAgICAgLy8gYmFzZSAxNlxuICAgICAgaW5kZXgrKztcblxuICAgICAgZm9yICg7IGluZGV4IDwgbWF4OyBpbmRleCsrKSB7XG4gICAgICAgIGNoID0gZGF0YVtpbmRleF07XG4gICAgICAgIGlmIChjaCA9PT0gXCJfXCIpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIWlzSGV4Q29kZShkYXRhLmNoYXJDb2RlQXQoaW5kZXgpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBoYXNEaWdpdHMgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhc0RpZ2l0cyAmJiBjaCAhPT0gXCJfXCI7XG4gICAgfVxuXG4gICAgLy8gYmFzZSA4XG4gICAgZm9yICg7IGluZGV4IDwgbWF4OyBpbmRleCsrKSB7XG4gICAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgICAgaWYgKGNoID09PSBcIl9cIikgY29udGludWU7XG4gICAgICBpZiAoIWlzT2N0Q29kZShkYXRhLmNoYXJDb2RlQXQoaW5kZXgpKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgaGFzRGlnaXRzID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc0RpZ2l0cyAmJiBjaCAhPT0gXCJfXCI7XG4gIH1cblxuICAvLyBiYXNlIDEwIChleGNlcHQgMCkgb3IgYmFzZSA2MFxuXG4gIC8vIHZhbHVlIHNob3VsZCBub3Qgc3RhcnQgd2l0aCBgX2A7XG4gIGlmIChjaCA9PT0gXCJfXCIpIHJldHVybiBmYWxzZTtcblxuICBmb3IgKDsgaW5kZXggPCBtYXg7IGluZGV4KyspIHtcbiAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgIGlmIChjaCA9PT0gXCJfXCIpIGNvbnRpbnVlO1xuICAgIGlmIChjaCA9PT0gXCI6XCIpIGJyZWFrO1xuICAgIGlmICghaXNEZWNDb2RlKGRhdGEuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc0RpZ2l0cyA9IHRydWU7XG4gIH1cblxuICAvLyBTaG91bGQgaGF2ZSBkaWdpdHMgYW5kIHNob3VsZCBub3QgZW5kIHdpdGggYF9gXG4gIGlmICghaGFzRGlnaXRzIHx8IGNoID09PSBcIl9cIikgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIGlmICFiYXNlNjAgLSBkb25lO1xuICBpZiAoY2ggIT09IFwiOlwiKSByZXR1cm4gdHJ1ZTtcblxuICAvLyBiYXNlNjAgYWxtb3N0IG5vdCB1c2VkLCBubyBuZWVkcyB0byBvcHRpbWl6ZVxuICByZXR1cm4gL14oOlswLTVdP1swLTldKSskLy50ZXN0KGRhdGEuc2xpY2UoaW5kZXgpKTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbEludGVnZXIoZGF0YTogc3RyaW5nKTogbnVtYmVyIHtcbiAgbGV0IHZhbHVlID0gZGF0YTtcbiAgY29uc3QgZGlnaXRzOiBudW1iZXJbXSA9IFtdO1xuXG4gIGlmICh2YWx1ZS5pbmRleE9mKFwiX1wiKSAhPT0gLTEpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL18vZywgXCJcIik7XG4gIH1cblxuICBsZXQgc2lnbiA9IDE7XG4gIGxldCBjaCA9IHZhbHVlWzBdO1xuICBpZiAoY2ggPT09IFwiLVwiIHx8IGNoID09PSBcIitcIikge1xuICAgIGlmIChjaCA9PT0gXCItXCIpIHNpZ24gPSAtMTtcbiAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpO1xuICAgIGNoID0gdmFsdWVbMF07XG4gIH1cblxuICBpZiAodmFsdWUgPT09IFwiMFwiKSByZXR1cm4gMDtcblxuICBpZiAoY2ggPT09IFwiMFwiKSB7XG4gICAgaWYgKHZhbHVlWzFdID09PSBcImJcIikgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgMik7XG4gICAgaWYgKHZhbHVlWzFdID09PSBcInhcIikgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWx1ZSwgMTYpO1xuICAgIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUsIDgpO1xuICB9XG5cbiAgaWYgKHZhbHVlLmluZGV4T2YoXCI6XCIpICE9PSAtMSkge1xuICAgIHZhbHVlLnNwbGl0KFwiOlwiKS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICBkaWdpdHMudW5zaGlmdChwYXJzZUludCh2LCAxMCkpO1xuICAgIH0pO1xuXG4gICAgbGV0IHZhbHVlSW50ID0gMDtcbiAgICBsZXQgYmFzZSA9IDE7XG5cbiAgICBkaWdpdHMuZm9yRWFjaCgoZCkgPT4ge1xuICAgICAgdmFsdWVJbnQgKz0gZCAqIGJhc2U7XG4gICAgICBiYXNlICo9IDYwO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNpZ24gKiB2YWx1ZUludDtcbiAgfVxuXG4gIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUsIDEwKTtcbn1cblxuZnVuY3Rpb24gaXNJbnRlZ2VyKG9iamVjdDogQW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiZcbiAgICBvYmplY3QgJSAxID09PSAwICYmXG4gICAgIWlzTmVnYXRpdmVaZXJvKG9iamVjdClcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IGludCA9IG5ldyBUeXBlKFwidGFnOnlhbWwub3JnLDIwMDI6aW50XCIsIHtcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sSW50ZWdlcixcbiAgZGVmYXVsdFN0eWxlOiBcImRlY2ltYWxcIixcbiAga2luZDogXCJzY2FsYXJcIixcbiAgcHJlZGljYXRlOiBpc0ludGVnZXIsXG4gIHJlcHJlc2VudDoge1xuICAgIGJpbmFyeShvYmo6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICByZXR1cm4gb2JqID49IDBcbiAgICAgICAgPyBgMGIke29iai50b1N0cmluZygyKX1gXG4gICAgICAgIDogYC0wYiR7b2JqLnRvU3RyaW5nKDIpLnNsaWNlKDEpfWA7XG4gICAgfSxcbiAgICBvY3RhbChvYmo6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICByZXR1cm4gb2JqID49IDAgPyBgMCR7b2JqLnRvU3RyaW5nKDgpfWAgOiBgLTAke29iai50b1N0cmluZyg4KS5zbGljZSgxKX1gO1xuICAgIH0sXG4gICAgZGVjaW1hbChvYmo6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICByZXR1cm4gb2JqLnRvU3RyaW5nKDEwKTtcbiAgICB9LFxuICAgIGhleGFkZWNpbWFsKG9iajogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBvYmogPj0gMFxuICAgICAgICA/IGAweCR7b2JqLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpfWBcbiAgICAgICAgOiBgLTB4JHtvYmoudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkuc2xpY2UoMSl9YDtcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiByZXNvbHZlWWFtbEludGVnZXIsXG4gIHN0eWxlQWxpYXNlczoge1xuICAgIGJpbmFyeTogWzIsIFwiYmluXCJdLFxuICAgIGRlY2ltYWw6IFsxMCwgXCJkZWNcIl0sXG4gICAgaGV4YWRlY2ltYWw6IFsxNiwgXCJoZXhcIl0sXG4gICAgb2N0YWw6IFs4LCBcIm9jdFwiXSxcbiAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUUxRSxTQUFTLElBQUksUUFBUSxhQUFhO0FBQ2xDLFNBQWMsY0FBYyxRQUFRLGVBQWU7QUFFbkQsU0FBUyxVQUFVLENBQVMsRUFBVztJQUNyQyxPQUNFLEFBQUMsUUFBUSxLQUFLLEdBQUcsS0FBSyxLQUFLLFFBQzFCLFFBQVEsS0FBSyxHQUFHLEtBQUssS0FBSyxRQUMxQixRQUFRLEtBQUssR0FBRyxLQUFLLEtBQUs7QUFFL0I7QUFFQSxTQUFTLFVBQVUsQ0FBUyxFQUFXO0lBQ3JDLE9BQU8sUUFBUSxLQUFLLEdBQUcsS0FBSyxLQUFLLEtBQUssS0FBSztBQUM3QztBQUVBLFNBQVMsVUFBVSxDQUFTLEVBQVc7SUFDckMsT0FBTyxRQUFRLEtBQUssR0FBRyxLQUFLLEtBQUssS0FBSyxLQUFLO0FBQzdDO0FBRUEsU0FBUyxtQkFBbUIsSUFBWSxFQUFXO0lBQ2pELE1BQU0sTUFBTSxLQUFLLE1BQU07SUFDdkIsSUFBSSxRQUFRO0lBQ1osSUFBSSxZQUFZLEtBQUs7SUFFckIsSUFBSSxDQUFDLEtBQUssT0FBTyxLQUFLO0lBRXRCLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTTtJQUVwQixPQUFPO0lBQ1AsSUFBSSxPQUFPLE9BQU8sT0FBTyxLQUFLO1FBQzVCLEtBQUss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