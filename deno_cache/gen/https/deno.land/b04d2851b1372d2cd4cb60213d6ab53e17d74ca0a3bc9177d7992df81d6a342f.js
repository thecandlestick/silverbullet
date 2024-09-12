// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
import { isNegativeZero } from "../_utils.ts";
const YAML_FLOAT_PATTERN = new RegExp(// 2.5e4, 2.5 and integers
"^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?" + // .2e4, .2
// special case, seems not from spec
"|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?" + // 20:59
"|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*" + // .inf
"|[-+]?\\.(?:inf|Inf|INF)" + // .nan
"|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(data) {
    if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    data[data.length - 1] === "_") {
        return false;
    }
    return true;
}
function constructYamlFloat(data) {
    let value = data.replace(/_/g, "").toLowerCase();
    const sign = value[0] === "-" ? -1 : 1;
    const digits = [];
    if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
    }
    if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (value === ".nan") {
        return NaN;
    }
    if (value.indexOf(":") >= 0) {
        value.split(":").forEach((v)=>{
            digits.unshift(parseFloat(v));
        });
        let valueNb = 0.0;
        let base = 1;
        digits.forEach((d)=>{
            valueNb += d * base;
            base *= 60;
        });
        return sign * valueNb;
    }
    return sign * parseFloat(value);
}
const SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
    if (isNaN(object)) {
        switch(style){
            case "lowercase":
                return ".nan";
            case "uppercase":
                return ".NAN";
            case "camelcase":
                return ".NaN";
        }
    } else if (Number.POSITIVE_INFINITY === object) {
        switch(style){
            case "lowercase":
                return ".inf";
            case "uppercase":
                return ".INF";
            case "camelcase":
                return ".Inf";
        }
    } else if (Number.NEGATIVE_INFINITY === object) {
        switch(style){
            case "lowercase":
                return "-.inf";
            case "uppercase":
                return "-.INF";
            case "camelcase":
                return "-.Inf";
        }
    } else if (isNegativeZero(object)) {
        return "-0.0";
    }
    const res = object.toString(10);
    // JS stringifier can build scientific format without dots: 5e-100,
    // while YAML requires dot: 5.e-100. Fix it with simple hack
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || isNegativeZero(object));
}
export const float = new Type("tag:yaml.org,2002:float", {
    construct: constructYamlFloat,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isFloat,
    represent: representYamlFloat,
    resolve: resolveYamlFloat
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvZmxvYXQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHsgU3R5bGVWYXJpYW50LCBUeXBlIH0gZnJvbSBcIi4uL3R5cGUudHNcIjtcbmltcG9ydCB7IEFueSwgaXNOZWdhdGl2ZVplcm8gfSBmcm9tIFwiLi4vX3V0aWxzLnRzXCI7XG5cbmNvbnN0IFlBTUxfRkxPQVRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXG4gIC8vIDIuNWU0LCAyLjUgYW5kIGludGVnZXJzXG4gIFwiXig/OlstK10/KD86MHxbMS05XVswLTlfXSopKD86XFxcXC5bMC05X10qKT8oPzpbZUVdWy0rXT9bMC05XSspP1wiICtcbiAgICAvLyAuMmU0LCAuMlxuICAgIC8vIHNwZWNpYWwgY2FzZSwgc2VlbXMgbm90IGZyb20gc3BlY1xuICAgIFwifFxcXFwuWzAtOV9dKyg/OltlRV1bLStdP1swLTldKyk/XCIgK1xuICAgIC8vIDIwOjU5XG4gICAgXCJ8Wy0rXT9bMC05XVswLTlfXSooPzo6WzAtNV0/WzAtOV0pK1xcXFwuWzAtOV9dKlwiICtcbiAgICAvLyAuaW5mXG4gICAgXCJ8Wy0rXT9cXFxcLig/OmluZnxJbmZ8SU5GKVwiICtcbiAgICAvLyAubmFuXG4gICAgXCJ8XFxcXC4oPzpuYW58TmFOfE5BTikpJFwiLFxuKTtcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxGbG9hdChkYXRhOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKFxuICAgICFZQU1MX0ZMT0FUX1BBVFRFUk4udGVzdChkYXRhKSB8fFxuICAgIC8vIFF1aWNrIGhhY2sgdG8gbm90IGFsbG93IGludGVnZXJzIGVuZCB3aXRoIGBfYFxuICAgIC8vIFByb2JhYmx5IHNob3VsZCB1cGRhdGUgcmVnZXhwICYgY2hlY2sgc3BlZWRcbiAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0gPT09IFwiX1wiXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sRmxvYXQoZGF0YTogc3RyaW5nKTogbnVtYmVyIHtcbiAgbGV0IHZhbHVlID0gZGF0YS5yZXBsYWNlKC9fL2csIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IHNpZ24gPSB2YWx1ZVswXSA9PT0gXCItXCIgPyAtMSA6IDE7XG4gIGNvbnN0IGRpZ2l0czogbnVtYmVyW10gPSBbXTtcblxuICBpZiAoXCIrLVwiLmluZGV4T2YodmFsdWVbMF0pID49IDApIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpO1xuICB9XG5cbiAgaWYgKHZhbHVlID09PSBcIi5pbmZcIikge1xuICAgIHJldHVybiBzaWduID09PSAxID8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZIDogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gXCIubmFuXCIpIHtcbiAgICByZXR1cm4gTmFOO1xuICB9XG4gIGlmICh2YWx1ZS5pbmRleE9mKFwiOlwiKSA+PSAwKSB7XG4gICAgdmFsdWUuc3BsaXQoXCI6XCIpLmZvckVhY2goKHYpID0+IHtcbiAgICAgIGRpZ2l0cy51bnNoaWZ0KHBhcnNlRmxvYXQodikpO1xuICAgIH0pO1xuXG4gICAgbGV0IHZhbHVlTmIgPSAwLjA7XG4gICAgbGV0IGJhc2UgPSAxO1xuXG4gICAgZGlnaXRzLmZvckVhY2goKGQpID0+IHtcbiAgICAgIHZhbHVlTmIgKz0gZCAqIGJhc2U7XG4gICAgICBiYXNlICo9IDYwO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNpZ24gKiB2YWx1ZU5iO1xuICB9XG4gIHJldHVybiBzaWduICogcGFyc2VGbG9hdCh2YWx1ZSk7XG59XG5cbmNvbnN0IFNDSUVOVElGSUNfV0lUSE9VVF9ET1QgPSAvXlstK10/WzAtOV0rZS87XG5cbmZ1bmN0aW9uIHJlcHJlc2VudFlhbWxGbG9hdChvYmplY3Q6IEFueSwgc3R5bGU/OiBTdHlsZVZhcmlhbnQpOiBBbnkge1xuICBpZiAoaXNOYU4ob2JqZWN0KSkge1xuICAgIHN3aXRjaCAoc3R5bGUpIHtcbiAgICAgIGNhc2UgXCJsb3dlcmNhc2VcIjpcbiAgICAgICAgcmV0dXJuIFwiLm5hblwiO1xuICAgICAgY2FzZSBcInVwcGVyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCIuTkFOXCI7XG4gICAgICBjYXNlIFwiY2FtZWxjYXNlXCI6XG4gICAgICAgIHJldHVybiBcIi5OYU5cIjtcbiAgICB9XG4gIH0gZWxzZSBpZiAoTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZID09PSBvYmplY3QpIHtcbiAgICBzd2l0Y2ggKHN0eWxlKSB7XG4gICAgICBjYXNlIFwibG93ZXJjYXNlXCI6XG4gICAgICAgIHJldHVybiBcIi5pbmZcIjtcbiAgICAgIGNhc2UgXCJ1cHBlcmNhc2VcIjpcbiAgICAgICAgcmV0dXJuIFwiLklORlwiO1xuICAgICAgY2FzZSBcImNhbWVsY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCIuSW5mXCI7XG4gICAgfVxuICB9IGVsc2UgaWYgKE51bWJlci5ORUdBVElWRV9JTkZJTklUWSA9PT0gb2JqZWN0KSB7XG4gICAgc3dpdGNoIChzdHlsZSkge1xuICAgICAgY2FzZSBcImxvd2VyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCItLmluZlwiO1xuICAgICAgY2FzZSBcInVwcGVyY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCItLklORlwiO1xuICAgICAgY2FzZSBcImNhbWVsY2FzZVwiOlxuICAgICAgICByZXR1cm4gXCItLkluZlwiO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc05lZ2F0aXZlWmVybyhvYmplY3QpKSB7XG4gICAgcmV0dXJuIFwiLTAuMFwiO1xuICB9XG5cbiAgY29uc3QgcmVzID0gb2JqZWN0LnRvU3RyaW5nKDEwKTtcblxuICAvLyBKUyBzdHJpbmdpZmllciBjYW4gYnVpbGQgc2NpZW50aWZpYyBmb3JtYXQgd2l0aG91dCBkb3RzOiA1ZS0xMDAsXG4gIC8vIHdoaWxlIFlBTUwgcmVxdWlyZXMgZG90OiA1LmUtMTAwLiBGaXggaXQgd2l0aCBzaW1wbGUgaGFja1xuXG4gIHJldHVybiBTQ0lFTlRJRklDX1dJVEhPVVRfRE9ULnRlc3QocmVzKSA/IHJlcy5yZXBsYWNlKFwiZVwiLCBcIi5lXCIpIDogcmVzO1xufVxuXG5mdW5jdGlvbiBpc0Zsb2F0KG9iamVjdDogQW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiZcbiAgICAob2JqZWN0ICUgMSAhPT0gMCB8fCBpc05lZ2F0aXZlWmVybyhvYmplY3QpKVxuICApO1xufVxuXG5leHBvcnQgY29uc3QgZmxvYXQgPSBuZXcgVHlwZShcInRhZzp5YW1sLm9yZywyMDAyOmZsb2F0XCIsIHtcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sRmxvYXQsXG4gIGRlZmF1bHRTdHlsZTogXCJsb3dlcmNhc2VcIixcbiAga2luZDogXCJzY2FsYXJcIixcbiAgcHJlZGljYXRlOiBpc0Zsb2F0LFxuICByZXByZXNlbnQ6IHJlcHJlc2VudFlhbWxGbG9hdCxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxGbG9hdCxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUUxRSxTQUF1QixJQUFJLFFBQVEsYUFBYTtBQUNoRCxTQUFjLGNBQWMsUUFBUSxlQUFlO0FBRW5ELE1BQU0scUJBQXFCLElBQUksT0FDN0IsMEJBQTBCO0FBQzFCLG1FQUNFLFdBQVc7QUFDWCxvQ0FBb0M7QUFDcEMsb0NBQ0EsUUFBUTtBQUNSLGtEQUNBLE9BQU87QUFDUCw2QkFDQSxPQUFPO0FBQ1A7QUFHSixTQUFTLGlCQUFpQixJQUFZLEVBQVc7SUFDL0MsSUFDRSxDQUFDLG1CQUFtQixJQUFJLENBQUMsU0FDekIsZ0RBQWdEO0lBQ2hELDhDQUE4QztJQUM5QyxJQUFJLENBQUMsS0FBSyxNQUFNLEdBQUcsRUFBRSxLQUFLLEtBQzFCO1FBQ0EsT0FBTyxLQUFLO0lBQ2QsQ0FBQztJQUVELE9BQU8sSUFBSTtBQUNiO0FBRUEsU0FBUyxtQkFBbUIsSUFBWSxFQUFVO0lBQ2hELElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxNQUFNLElBQUksV0FBVztJQUM5QyxNQUFNLE9BQU8sS0FBSyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3RDLE1BQU0sU0FBbUIsRUFBRTtJQUUzQixJQUFJLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRztRQUMvQixRQUFRLE1BQU0sS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLFVBQVUsUUFBUTtRQUNwQixPQUFPLFNBQVMsSUFBSSxPQUFPLGlCQUFpQixHQUFHLE9BQU8saUJBQWlCO0lBQ3pFLENBQUM7SUFDRCxJQUFJLFVBQVUsUUFBUTtRQUNwQixPQUFPO0lBQ1QsQ0FBQztJQUNELElBQUksTUFBTSxPQUFPLENBQUMsUUFBUSxHQUFHO1FBQzNCLE1BQU0sS0FBSyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsSUFBTTtZQUM5QixPQUFPLE9BQU8sQ0FBQyxXQUFXO1FBQzVCO1FBRUEsSUFBSSxVQUFVO1FBQ2QsSUFBSSxPQUFPO1FBRVgsT0FBTyxPQUFPLENBQUMsQ0FBQyxJQUFNO1lBQ3BCLFdBQVcsSUFBSTtZQUNmLFFBQVE7UUFDVjtRQUVBLE9BQU8sT0FBTztJQUNoQixDQUFDO0lBQ0QsT0FBTyxPQUFPLFdBQVc7QUFDM0I7QUFFQSxNQUFNLHlCQUF5QjtBQUUvQixTQUFTLG1CQUFtQixNQUFXLEVBQUUsS0FBb0IsRUFBTztJQUNsRSxJQUFJLE1BQU0sU0FBUztRQUNqQixPQUFRO1lBQ04sS0FBSztnQkFDSCxPQUFPO1lBQ1QsS0FBSztnQkFDSCxPQUFPO1lBQ1QsS0FBSztnQkFDSCxPQUFPO1FBQ1g7SUFDRixPQUFPLElBQUksT0FBTyxpQkFBaUIsS0FBSyxRQUFRO1FBQzlDLE9BQVE7WUFDTixLQUFLO2dCQUNILE9BQU87WUFDVCxLQUFLO2dCQUNILE9BQU87WUFDVCxLQUFLO2dCQUNILE9BQU87UUFDWDtJQUNGLE9BQU8sSUFBSSxPQUFPLGlCQUFpQixLQUFLLFFBQVE7UUFDOUMsT0FBUTtZQUNOLEtBQUs7Z0JBQ0gsT0FBTztZQUNULEtBQUs7Z0JBQ0gsT0FBTztZQUNULEtBQUs7Z0JBQ0gsT0FBTztRQUNYO0lBQ0YsT0FBTyxJQUFJLGVBQWUsU0FBUztRQUNqQyxPQUFPO0lBQ1QsQ0FBQztJQUVELE1BQU0sTUFBTSxPQUFPLFFBQVEsQ0FBQztJQUU1QixtRUFBbUU7SUFDbkUsNERBQTREO0lBRTVELE9BQU8sdUJBQXVCLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxHQUFHO0FBQ3hFO0FBRUEsU0FBUyxRQUFRLE1BQVcsRUFBVztJQUNyQyxPQUNFLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxxQkFDM0MsQ0FBQyxTQUFTLE1BQU0sS0FBSyxlQUFlLE9BQU87QUFFL0M7QUFFQSxPQUFPLE1BQU0sUUFBUSxJQUFJLEtBQUssMkJBQTJCO0lBQ3ZELFdBQVc7SUFDWCxjQUFjO0lBQ2QsTUFBTTtJQUNOLFdBQVc7SUFDWCxXQUFXO0lBQ1gsU0FBUztBQUNYLEdBQUcifQ==