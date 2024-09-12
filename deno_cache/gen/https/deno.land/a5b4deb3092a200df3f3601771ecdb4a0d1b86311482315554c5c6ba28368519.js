// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
import { isBoolean } from "../_utils.ts";
function resolveYamlBoolean(data) {
    const max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
}
export const bool = new Type("tag:yaml.org,2002:bool", {
    construct: constructYamlBoolean,
    defaultStyle: "lowercase",
    kind: "scalar",
    predicate: isBoolean,
    represent: {
        lowercase (object) {
            return object ? "true" : "false";
        },
        uppercase (object) {
            return object ? "TRUE" : "FALSE";
        },
        camelcase (object) {
            return object ? "True" : "False";
        }
    },
    resolve: resolveYamlBoolean
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvYm9vbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQb3J0ZWQgZnJvbSBqcy15YW1sIHYzLjEzLjE6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL2pzLXlhbWwvY29tbWl0LzY2NWFhZGRhNDIzNDlkY2FlODY5ZjEyMDQwZDliMTBlZjE4ZDEyZGFcbi8vIENvcHlyaWdodCAyMDExLTIwMTUgYnkgVml0YWx5IFB1enJpbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL3R5cGUudHNcIjtcbmltcG9ydCB7IGlzQm9vbGVhbiB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxCb29sZWFuKGRhdGE6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBtYXggPSBkYXRhLmxlbmd0aDtcblxuICByZXR1cm4gKFxuICAgIChtYXggPT09IDQgJiYgKGRhdGEgPT09IFwidHJ1ZVwiIHx8IGRhdGEgPT09IFwiVHJ1ZVwiIHx8IGRhdGEgPT09IFwiVFJVRVwiKSkgfHxcbiAgICAobWF4ID09PSA1ICYmIChkYXRhID09PSBcImZhbHNlXCIgfHwgZGF0YSA9PT0gXCJGYWxzZVwiIHx8IGRhdGEgPT09IFwiRkFMU0VcIikpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxCb29sZWFuKGRhdGE6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZGF0YSA9PT0gXCJ0cnVlXCIgfHwgZGF0YSA9PT0gXCJUcnVlXCIgfHwgZGF0YSA9PT0gXCJUUlVFXCI7XG59XG5cbmV4cG9ydCBjb25zdCBib29sID0gbmV3IFR5cGUoXCJ0YWc6eWFtbC5vcmcsMjAwMjpib29sXCIsIHtcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sQm9vbGVhbixcbiAgZGVmYXVsdFN0eWxlOiBcImxvd2VyY2FzZVwiLFxuICBraW5kOiBcInNjYWxhclwiLFxuICBwcmVkaWNhdGU6IGlzQm9vbGVhbixcbiAgcmVwcmVzZW50OiB7XG4gICAgbG93ZXJjYXNlKG9iamVjdDogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICByZXR1cm4gb2JqZWN0ID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG4gICAgfSxcbiAgICB1cHBlcmNhc2Uob2JqZWN0OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiBvYmplY3QgPyBcIlRSVUVcIiA6IFwiRkFMU0VcIjtcbiAgICB9LFxuICAgIGNhbWVsY2FzZShvYmplY3Q6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIG9iamVjdCA/IFwiVHJ1ZVwiIDogXCJGYWxzZVwiO1xuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sQm9vbGVhbixcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUUxRSxTQUFTLElBQUksUUFBUSxhQUFhO0FBQ2xDLFNBQVMsU0FBUyxRQUFRLGVBQWU7QUFFekMsU0FBUyxtQkFBbUIsSUFBWSxFQUFXO0lBQ2pELE1BQU0sTUFBTSxLQUFLLE1BQU07SUFFdkIsT0FDRSxBQUFDLFFBQVEsS0FBSyxDQUFDLFNBQVMsVUFBVSxTQUFTLFVBQVUsU0FBUyxNQUFNLEtBQ25FLFFBQVEsS0FBSyxDQUFDLFNBQVMsV0FBVyxTQUFTLFdBQVcsU0FBUyxPQUFPO0FBRTNFO0FBRUEsU0FBUyxxQkFBcUIsSUFBWSxFQUFXO0lBQ25ELE9BQU8sU0FBUyxVQUFVLFNBQVMsVUFBVSxTQUFTO0FBQ3hEO0FBRUEsT0FBTyxNQUFNLE9BQU8sSUFBSSxLQUFLLDBCQUEwQjtJQUNyRCxXQUFXO0lBQ1gsY0FBYztJQUNkLE1BQU07SUFDTixXQUFXO0lBQ1gsV0FBVztRQUNULFdBQVUsTUFBZSxFQUFVO1lBQ2pDLE9BQU8sU0FBUyxTQUFTLE9BQU87UUFDbEM7UUFDQSxXQUFVLE1BQWUsRUFBVTtZQUNqQyxPQUFPLFNBQVMsU0FBUyxPQUFPO1FBQ2xDO1FBQ0EsV0FBVSxNQUFlLEVBQVU7WUFDakMsT0FBTyxTQUFTLFNBQVMsT0FBTztRQUNsQztJQUNGO0lBQ0EsU0FBUztBQUNYLEdBQUcifQ==