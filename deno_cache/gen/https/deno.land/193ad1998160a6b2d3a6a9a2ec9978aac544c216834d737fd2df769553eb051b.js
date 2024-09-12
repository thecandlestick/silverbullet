// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { State } from "../_state.ts";
const { hasOwn  } = Object;
function compileStyleMap(schema, map) {
    if (typeof map === "undefined" || map === null) return {};
    let type;
    const result = {};
    const keys = Object.keys(map);
    let tag, style;
    for(let index = 0, length = keys.length; index < length; index += 1){
        tag = keys[index];
        style = String(map[tag]);
        if (tag.slice(0, 2) === "!!") {
            tag = `tag:yaml.org,2002:${tag.slice(2)}`;
        }
        type = schema.compiledTypeMap.fallback[tag];
        if (type && typeof type.styleAliases !== "undefined" && hasOwn(type.styleAliases, style)) {
            style = type.styleAliases[style];
        }
        result[tag] = style;
    }
    return result;
}
export class DumperState extends State {
    indent;
    noArrayIndent;
    skipInvalid;
    flowLevel;
    sortKeys;
    lineWidth;
    noRefs;
    noCompatMode;
    condenseFlow;
    implicitTypes;
    explicitTypes;
    tag = null;
    result = "";
    duplicates = [];
    usedDuplicates = [];
    styleMap;
    dump;
    constructor({ schema , indent =2 , noArrayIndent =false , skipInvalid =false , flowLevel =-1 , styles =null , sortKeys =false , lineWidth =80 , noRefs =false , noCompatMode =false , condenseFlow =false  }){
        super(schema);
        this.indent = Math.max(1, indent);
        this.noArrayIndent = noArrayIndent;
        this.skipInvalid = skipInvalid;
        this.flowLevel = flowLevel;
        this.styleMap = compileStyleMap(this.schema, styles);
        this.sortKeys = sortKeys;
        this.lineWidth = lineWidth;
        this.noRefs = noRefs;
        this.noCompatMode = noCompatMode;
        this.condenseFlow = condenseFlow;
        this.implicitTypes = this.schema.compiledImplicit;
        this.explicitTypes = this.schema.compiledExplicit;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX2R1bXBlci9kdW1wZXJfc3RhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHR5cGUgeyBTY2hlbWEsIFNjaGVtYURlZmluaXRpb24gfSBmcm9tIFwiLi4vc2NoZW1hLnRzXCI7XG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gXCIuLi9fc3RhdGUudHNcIjtcbmltcG9ydCB0eXBlIHsgU3R5bGVWYXJpYW50LCBUeXBlIH0gZnJvbSBcIi4uL3R5cGUudHNcIjtcbmltcG9ydCB0eXBlIHsgQW55LCBBcnJheU9iamVjdCB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcblxuY29uc3QgeyBoYXNPd24gfSA9IE9iamVjdDtcblxuZnVuY3Rpb24gY29tcGlsZVN0eWxlTWFwKFxuICBzY2hlbWE6IFNjaGVtYSxcbiAgbWFwPzogQXJyYXlPYmplY3Q8U3R5bGVWYXJpYW50PiB8IG51bGwsXG4pOiBBcnJheU9iamVjdDxTdHlsZVZhcmlhbnQ+IHtcbiAgaWYgKHR5cGVvZiBtYXAgPT09IFwidW5kZWZpbmVkXCIgfHwgbWFwID09PSBudWxsKSByZXR1cm4ge307XG5cbiAgbGV0IHR5cGU6IFR5cGU7XG4gIGNvbnN0IHJlc3VsdDogQXJyYXlPYmplY3Q8U3R5bGVWYXJpYW50PiA9IHt9O1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobWFwKTtcbiAgbGV0IHRhZzogc3RyaW5nLCBzdHlsZTogU3R5bGVWYXJpYW50O1xuICBmb3IgKGxldCBpbmRleCA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHRhZyA9IGtleXNbaW5kZXhdO1xuICAgIHN0eWxlID0gU3RyaW5nKG1hcFt0YWddKSBhcyBTdHlsZVZhcmlhbnQ7XG4gICAgaWYgKHRhZy5zbGljZSgwLCAyKSA9PT0gXCIhIVwiKSB7XG4gICAgICB0YWcgPSBgdGFnOnlhbWwub3JnLDIwMDI6JHt0YWcuc2xpY2UoMil9YDtcbiAgICB9XG4gICAgdHlwZSA9IHNjaGVtYS5jb21waWxlZFR5cGVNYXAuZmFsbGJhY2tbdGFnXTtcblxuICAgIGlmIChcbiAgICAgIHR5cGUgJiZcbiAgICAgIHR5cGVvZiB0eXBlLnN0eWxlQWxpYXNlcyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgaGFzT3duKHR5cGUuc3R5bGVBbGlhc2VzLCBzdHlsZSlcbiAgICApIHtcbiAgICAgIHN0eWxlID0gdHlwZS5zdHlsZUFsaWFzZXNbc3R5bGVdO1xuICAgIH1cblxuICAgIHJlc3VsdFt0YWddID0gc3R5bGU7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIER1bXBlclN0YXRlT3B0aW9ucyB7XG4gIC8qKiBpbmRlbnRhdGlvbiB3aWR0aCB0byB1c2UgKGluIHNwYWNlcykuICovXG4gIGluZGVudD86IG51bWJlcjtcbiAgLyoqIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYWRkIGFuIGluZGVudGF0aW9uIGxldmVsIHRvIGFycmF5IGVsZW1lbnRzICovXG4gIG5vQXJyYXlJbmRlbnQ/OiBib29sZWFuO1xuICAvKipcbiAgICogZG8gbm90IHRocm93IG9uIGludmFsaWQgdHlwZXMgKGxpa2UgZnVuY3Rpb24gaW4gdGhlIHNhZmUgc2NoZW1hKVxuICAgKiBhbmQgc2tpcCBwYWlycyBhbmQgc2luZ2xlIHZhbHVlcyB3aXRoIHN1Y2ggdHlwZXMuXG4gICAqL1xuICBza2lwSW52YWxpZD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBzcGVjaWZpZXMgbGV2ZWwgb2YgbmVzdGluZywgd2hlbiB0byBzd2l0Y2ggZnJvbVxuICAgKiBibG9jayB0byBmbG93IHN0eWxlIGZvciBjb2xsZWN0aW9ucy4gLTEgbWVhbnMgYmxvY2sgc3R5bGUgZXZlcnl3aGVyZVxuICAgKi9cbiAgZmxvd0xldmVsPzogbnVtYmVyO1xuICAvKiogRWFjaCB0YWcgbWF5IGhhdmUgb3duIHNldCBvZiBzdHlsZXMuXHQtIFwidGFnXCIgPT4gXCJzdHlsZVwiIG1hcC4gKi9cbiAgc3R5bGVzPzogQXJyYXlPYmplY3Q8U3R5bGVWYXJpYW50PiB8IG51bGw7XG4gIC8qKiBzcGVjaWZpZXMgYSBzY2hlbWEgdG8gdXNlLiAqL1xuICBzY2hlbWE/OiBTY2hlbWFEZWZpbml0aW9uO1xuICAvKipcbiAgICogSWYgdHJ1ZSwgc29ydCBrZXlzIHdoZW4gZHVtcGluZyBZQU1MIGluIGFzY2VuZGluZywgQVNDSUkgY2hhcmFjdGVyIG9yZGVyLlxuICAgKiBJZiBhIGZ1bmN0aW9uLCB1c2UgdGhlIGZ1bmN0aW9uIHRvIHNvcnQgdGhlIGtleXMuIChkZWZhdWx0OiBmYWxzZSlcbiAgICogSWYgYSBmdW5jdGlvbiBpcyBzcGVjaWZpZWQsIHRoZSBmdW5jdGlvbiBtdXN0IHJldHVybiBhIG5lZ2F0aXZlIHZhbHVlXG4gICAqIGlmIGZpcnN0IGFyZ3VtZW50IGlzIGxlc3MgdGhhbiBzZWNvbmQgYXJndW1lbnQsIHplcm8gaWYgdGhleSdyZSBlcXVhbFxuICAgKiBhbmQgYSBwb3NpdGl2ZSB2YWx1ZSBvdGhlcndpc2UuXG4gICAqL1xuICBzb3J0S2V5cz86IGJvb2xlYW4gfCAoKGE6IHN0cmluZywgYjogc3RyaW5nKSA9PiBudW1iZXIpO1xuICAvKiogc2V0IG1heCBsaW5lIHdpZHRoLiAoZGVmYXVsdDogODApICovXG4gIGxpbmVXaWR0aD86IG51bWJlcjtcbiAgLyoqXG4gICAqIGlmIHRydWUsIGRvbid0IGNvbnZlcnQgZHVwbGljYXRlIG9iamVjdHNcbiAgICogaW50byByZWZlcmVuY2VzIChkZWZhdWx0OiBmYWxzZSlcbiAgICovXG4gIG5vUmVmcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBpZiB0cnVlIGRvbid0IHRyeSB0byBiZSBjb21wYXRpYmxlIHdpdGggb2xkZXIgeWFtbCB2ZXJzaW9ucy5cbiAgICogQ3VycmVudGx5OiBkb24ndCBxdW90ZSBcInllc1wiLCBcIm5vXCIgYW5kIHNvIG9uLFxuICAgKiBhcyByZXF1aXJlZCBmb3IgWUFNTCAxLjEgKGRlZmF1bHQ6IGZhbHNlKVxuICAgKi9cbiAgbm9Db21wYXRNb2RlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIGlmIHRydWUgZmxvdyBzZXF1ZW5jZXMgd2lsbCBiZSBjb25kZW5zZWQsIG9taXR0aW5nIHRoZVxuICAgKiBzcGFjZSBiZXR3ZWVuIGBrZXk6IHZhbHVlYCBvciBgYSwgYmAuIEVnLiBgJ1thLGJdJ2Agb3IgYHthOntiOmN9fWAuXG4gICAqIENhbiBiZSB1c2VmdWwgd2hlbiB1c2luZyB5YW1sIGZvciBwcmV0dHkgVVJMIHF1ZXJ5IHBhcmFtc1xuICAgKiBhcyBzcGFjZXMgYXJlICUtZW5jb2RlZC4gKGRlZmF1bHQ6IGZhbHNlKS5cbiAgICovXG4gIGNvbmRlbnNlRmxvdz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBEdW1wZXJTdGF0ZSBleHRlbmRzIFN0YXRlIHtcbiAgcHVibGljIGluZGVudDogbnVtYmVyO1xuICBwdWJsaWMgbm9BcnJheUluZGVudDogYm9vbGVhbjtcbiAgcHVibGljIHNraXBJbnZhbGlkOiBib29sZWFuO1xuICBwdWJsaWMgZmxvd0xldmVsOiBudW1iZXI7XG4gIHB1YmxpYyBzb3J0S2V5czogYm9vbGVhbiB8ICgoYTogQW55LCBiOiBBbnkpID0+IG51bWJlcik7XG4gIHB1YmxpYyBsaW5lV2lkdGg6IG51bWJlcjtcbiAgcHVibGljIG5vUmVmczogYm9vbGVhbjtcbiAgcHVibGljIG5vQ29tcGF0TW9kZTogYm9vbGVhbjtcbiAgcHVibGljIGNvbmRlbnNlRmxvdzogYm9vbGVhbjtcbiAgcHVibGljIGltcGxpY2l0VHlwZXM6IFR5cGVbXTtcbiAgcHVibGljIGV4cGxpY2l0VHlwZXM6IFR5cGVbXTtcbiAgcHVibGljIHRhZzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyByZXN1bHQgPSBcIlwiO1xuICBwdWJsaWMgZHVwbGljYXRlczogQW55W10gPSBbXTtcbiAgcHVibGljIHVzZWREdXBsaWNhdGVzOiBBbnlbXSA9IFtdOyAvLyBjaGFuZ2VkIGZyb20gbnVsbCB0byBbXVxuICBwdWJsaWMgc3R5bGVNYXA6IEFycmF5T2JqZWN0PFN0eWxlVmFyaWFudD47XG4gIHB1YmxpYyBkdW1wOiBBbnk7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHNjaGVtYSxcbiAgICBpbmRlbnQgPSAyLFxuICAgIG5vQXJyYXlJbmRlbnQgPSBmYWxzZSxcbiAgICBza2lwSW52YWxpZCA9IGZhbHNlLFxuICAgIGZsb3dMZXZlbCA9IC0xLFxuICAgIHN0eWxlcyA9IG51bGwsXG4gICAgc29ydEtleXMgPSBmYWxzZSxcbiAgICBsaW5lV2lkdGggPSA4MCxcbiAgICBub1JlZnMgPSBmYWxzZSxcbiAgICBub0NvbXBhdE1vZGUgPSBmYWxzZSxcbiAgICBjb25kZW5zZUZsb3cgPSBmYWxzZSxcbiAgfTogRHVtcGVyU3RhdGVPcHRpb25zKSB7XG4gICAgc3VwZXIoc2NoZW1hKTtcbiAgICB0aGlzLmluZGVudCA9IE1hdGgubWF4KDEsIGluZGVudCk7XG4gICAgdGhpcy5ub0FycmF5SW5kZW50ID0gbm9BcnJheUluZGVudDtcbiAgICB0aGlzLnNraXBJbnZhbGlkID0gc2tpcEludmFsaWQ7XG4gICAgdGhpcy5mbG93TGV2ZWwgPSBmbG93TGV2ZWw7XG4gICAgdGhpcy5zdHlsZU1hcCA9IGNvbXBpbGVTdHlsZU1hcCh0aGlzLnNjaGVtYSBhcyBTY2hlbWEsIHN0eWxlcyk7XG4gICAgdGhpcy5zb3J0S2V5cyA9IHNvcnRLZXlzO1xuICAgIHRoaXMubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgIHRoaXMubm9SZWZzID0gbm9SZWZzO1xuICAgIHRoaXMubm9Db21wYXRNb2RlID0gbm9Db21wYXRNb2RlO1xuICAgIHRoaXMuY29uZGVuc2VGbG93ID0gY29uZGVuc2VGbG93O1xuXG4gICAgdGhpcy5pbXBsaWNpdFR5cGVzID0gKHRoaXMuc2NoZW1hIGFzIFNjaGVtYSkuY29tcGlsZWRJbXBsaWNpdDtcbiAgICB0aGlzLmV4cGxpY2l0VHlwZXMgPSAodGhpcy5zY2hlbWEgYXMgU2NoZW1hKS5jb21waWxlZEV4cGxpY2l0O1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLG9GQUFvRjtBQUNwRiwwRUFBMEU7QUFDMUUsMEVBQTBFO0FBRzFFLFNBQVMsS0FBSyxRQUFRLGVBQWU7QUFJckMsTUFBTSxFQUFFLE9BQU0sRUFBRSxHQUFHO0FBRW5CLFNBQVMsZ0JBQ1AsTUFBYyxFQUNkLEdBQXNDLEVBQ1g7SUFDM0IsSUFBSSxPQUFPLFFBQVEsZUFBZSxRQUFRLElBQUksRUFBRSxPQUFPLENBQUM7SUFFeEQsSUFBSTtJQUNKLE1BQU0sU0FBb0MsQ0FBQztJQUMzQyxNQUFNLE9BQU8sT0FBTyxJQUFJLENBQUM7SUFDekIsSUFBSSxLQUFhO0lBQ2pCLElBQUssSUFBSSxRQUFRLEdBQUcsU0FBUyxLQUFLLE1BQU0sRUFBRSxRQUFRLFFBQVEsU0FBUyxFQUFHO1FBQ3BFLE1BQU0sSUFBSSxDQUFDLE1BQU07UUFDakIsUUFBUSxPQUFPLEdBQUcsQ0FBQyxJQUFJO1FBQ3ZCLElBQUksSUFBSSxLQUFLLENBQUMsR0FBRyxPQUFPLE1BQU07WUFDNUIsTUFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsT0FBTyxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSTtRQUUzQyxJQUNFLFFBQ0EsT0FBTyxLQUFLLFlBQVksS0FBSyxlQUM3QixPQUFPLEtBQUssWUFBWSxFQUFFLFFBQzFCO1lBQ0EsUUFBUSxLQUFLLFlBQVksQ0FBQyxNQUFNO1FBQ2xDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxHQUFHO0lBQ2hCO0lBRUEsT0FBTztBQUNUO0FBbURBLE9BQU8sTUFBTSxvQkFBb0I7SUFDeEIsT0FBZTtJQUNmLGNBQXVCO0lBQ3ZCLFlBQXFCO0lBQ3JCLFVBQWtCO0lBQ2xCLFNBQWlEO0lBQ2pELFVBQWtCO0lBQ2xCLE9BQWdCO0lBQ2hCLGFBQXNCO0lBQ3RCLGFBQXNCO0lBQ3RCLGNBQXNCO0lBQ3RCLGNBQXNCO0lBQ3RCLE1BQXFCLElBQUksQ0FBQztJQUMxQixTQUFTLEdBQUc7SUFDWixhQUFvQixFQUFFLENBQUM7SUFDdkIsaUJBQXdCLEVBQUUsQ0FBQztJQUMzQixTQUFvQztJQUNwQyxLQUFVO0lBRWpCLFlBQVksRUFDVixPQUFNLEVBQ04sUUFBUyxFQUFDLEVBQ1YsZUFBZ0IsS0FBSyxDQUFBLEVBQ3JCLGFBQWMsS0FBSyxDQUFBLEVBQ25CLFdBQVksQ0FBQyxFQUFDLEVBQ2QsUUFBUyxJQUFJLENBQUEsRUFDYixVQUFXLEtBQUssQ0FBQSxFQUNoQixXQUFZLEdBQUUsRUFDZCxRQUFTLEtBQUssQ0FBQSxFQUNkLGNBQWUsS0FBSyxDQUFBLEVBQ3BCLGNBQWUsS0FBSyxDQUFBLEVBQ0QsQ0FBRTtRQUNyQixLQUFLLENBQUM7UUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUc7UUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUc7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sRUFBWTtRQUN2RCxJQUFJLENBQUMsUUFBUSxHQUFHO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUc7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRztRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUc7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRztRQUVwQixJQUFJLENBQUMsYUFBYSxHQUFHLEFBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBWSxnQkFBZ0I7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxBQUFDLElBQUksQ0FBQyxNQUFNLENBQVksZ0JBQWdCO0lBQy9EO0FBQ0YsQ0FBQyJ9