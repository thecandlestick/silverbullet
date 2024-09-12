// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
function resolveYamlMerge(data) {
    return data === "<<" || data === null;
}
export const merge = new Type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvbWVyZ2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi90eXBlLnRzXCI7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sTWVyZ2UoZGF0YTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBkYXRhID09PSBcIjw8XCIgfHwgZGF0YSA9PT0gbnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gbmV3IFR5cGUoXCJ0YWc6eWFtbC5vcmcsMjAwMjptZXJnZVwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmU6IHJlc29sdmVZYW1sTWVyZ2UsXG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrQkFBK0I7QUFDL0Isb0ZBQW9GO0FBQ3BGLDBFQUEwRTtBQUMxRSwwRUFBMEU7QUFFMUUsU0FBUyxJQUFJLFFBQVEsYUFBYTtBQUVsQyxTQUFTLGlCQUFpQixJQUFZLEVBQVc7SUFDL0MsT0FBTyxTQUFTLFFBQVEsU0FBUyxJQUFJO0FBQ3ZDO0FBRUEsT0FBTyxNQUFNLFFBQVEsSUFBSSxLQUFLLDJCQUEyQjtJQUN2RCxNQUFNO0lBQ04sU0FBUztBQUNYLEdBQUcifQ==