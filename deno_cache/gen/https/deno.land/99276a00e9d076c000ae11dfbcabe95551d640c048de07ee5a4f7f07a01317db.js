// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
const { hasOwn  } = Object;
const _toString = Object.prototype.toString;
function resolveYamlOmap(data) {
    const objectKeys = [];
    let pairKey = "";
    let pairHasKey = false;
    for (const pair of data){
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]") return false;
        for(pairKey in pair){
            if (hasOwn(pair, pairKey)) {
                if (!pairHasKey) pairHasKey = true;
                else return false;
            }
        }
        if (!pairHasKey) return false;
        if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
        else return false;
    }
    return true;
}
function constructYamlOmap(data) {
    return data !== null ? data : [];
}
export const omap = new Type("tag:yaml.org,2002:omap", {
    construct: constructYamlOmap,
    kind: "sequence",
    resolve: resolveYamlOmap
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvb21hcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQb3J0ZWQgZnJvbSBqcy15YW1sIHYzLjEzLjE6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL2pzLXlhbWwvY29tbWl0LzY2NWFhZGRhNDIzNDlkY2FlODY5ZjEyMDQwZDliMTBlZjE4ZDEyZGFcbi8vIENvcHlyaWdodCAyMDExLTIwMTUgYnkgVml0YWx5IFB1enJpbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL3R5cGUudHNcIjtcbmltcG9ydCB0eXBlIHsgQW55IH0gZnJvbSBcIi4uL191dGlscy50c1wiO1xuXG5jb25zdCB7IGhhc093biB9ID0gT2JqZWN0O1xuY29uc3QgX3RvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxPbWFwKGRhdGE6IEFueSk6IGJvb2xlYW4ge1xuICBjb25zdCBvYmplY3RLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICBsZXQgcGFpcktleSA9IFwiXCI7XG4gIGxldCBwYWlySGFzS2V5ID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBwYWlyIG9mIGRhdGEpIHtcbiAgICBwYWlySGFzS2V5ID0gZmFsc2U7XG5cbiAgICBpZiAoX3RvU3RyaW5nLmNhbGwocGFpcikgIT09IFwiW29iamVjdCBPYmplY3RdXCIpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAocGFpcktleSBpbiBwYWlyKSB7XG4gICAgICBpZiAoaGFzT3duKHBhaXIsIHBhaXJLZXkpKSB7XG4gICAgICAgIGlmICghcGFpckhhc0tleSkgcGFpckhhc0tleSA9IHRydWU7XG4gICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcGFpckhhc0tleSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKG9iamVjdEtleXMuaW5kZXhPZihwYWlyS2V5KSA9PT0gLTEpIG9iamVjdEtleXMucHVzaChwYWlyS2V5KTtcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sT21hcChkYXRhOiBBbnkpOiBBbnkge1xuICByZXR1cm4gZGF0YSAhPT0gbnVsbCA/IGRhdGEgOiBbXTtcbn1cblxuZXhwb3J0IGNvbnN0IG9tYXAgPSBuZXcgVHlwZShcInRhZzp5YW1sLm9yZywyMDAyOm9tYXBcIiwge1xuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxPbWFwLFxuICBraW5kOiBcInNlcXVlbmNlXCIsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sT21hcCxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUUxRSxTQUFTLElBQUksUUFBUSxhQUFhO0FBR2xDLE1BQU0sRUFBRSxPQUFNLEVBQUUsR0FBRztBQUNuQixNQUFNLFlBQVksT0FBTyxTQUFTLENBQUMsUUFBUTtBQUUzQyxTQUFTLGdCQUFnQixJQUFTLEVBQVc7SUFDM0MsTUFBTSxhQUF1QixFQUFFO0lBQy9CLElBQUksVUFBVTtJQUNkLElBQUksYUFBYSxLQUFLO0lBRXRCLEtBQUssTUFBTSxRQUFRLEtBQU07UUFDdkIsYUFBYSxLQUFLO1FBRWxCLElBQUksVUFBVSxJQUFJLENBQUMsVUFBVSxtQkFBbUIsT0FBTyxLQUFLO1FBRTVELElBQUssV0FBVyxLQUFNO1lBQ3BCLElBQUksT0FBTyxNQUFNLFVBQVU7Z0JBQ3pCLElBQUksQ0FBQyxZQUFZLGFBQWEsSUFBSTtxQkFDN0IsT0FBTyxLQUFLO1lBQ25CLENBQUM7UUFDSDtRQUVBLElBQUksQ0FBQyxZQUFZLE9BQU8sS0FBSztRQUU3QixJQUFJLFdBQVcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFdBQVcsSUFBSSxDQUFDO2FBQ25ELE9BQU8sS0FBSztJQUNuQjtJQUVBLE9BQU8sSUFBSTtBQUNiO0FBRUEsU0FBUyxrQkFBa0IsSUFBUyxFQUFPO0lBQ3pDLE9BQU8sU0FBUyxJQUFJLEdBQUcsT0FBTyxFQUFFO0FBQ2xDO0FBRUEsT0FBTyxNQUFNLE9BQU8sSUFBSSxLQUFLLDBCQUEwQjtJQUNyRCxXQUFXO0lBQ1gsTUFBTTtJQUNOLFNBQVM7QUFDWCxHQUFHIn0=