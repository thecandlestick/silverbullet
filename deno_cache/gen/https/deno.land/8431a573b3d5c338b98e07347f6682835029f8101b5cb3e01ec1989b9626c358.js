// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { Schema } from "../schema.ts";
import { binary, merge, omap, pairs, set, timestamp } from "../_type/mod.ts";
import { core } from "./core.ts";
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
export const def = new Schema({
    explicit: [
        binary,
        omap,
        pairs,
        set
    ],
    implicit: [
        timestamp,
        merge
    ],
    include: [
        core
    ]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvc2NoZW1hL2RlZmF1bHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGJyb3dzZXIgY29tcGF0aWJsZS5cblxuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSBcIi4uL3NjaGVtYS50c1wiO1xuaW1wb3J0IHsgYmluYXJ5LCBtZXJnZSwgb21hcCwgcGFpcnMsIHNldCwgdGltZXN0YW1wIH0gZnJvbSBcIi4uL190eXBlL21vZC50c1wiO1xuaW1wb3J0IHsgY29yZSB9IGZyb20gXCIuL2NvcmUudHNcIjtcblxuLy8gSlMtWUFNTCdzIGRlZmF1bHQgc2NoZW1hIGZvciBgc2FmZUxvYWRgIGZ1bmN0aW9uLlxuLy8gSXQgaXMgbm90IGRlc2NyaWJlZCBpbiB0aGUgWUFNTCBzcGVjaWZpY2F0aW9uLlxuZXhwb3J0IGNvbnN0IGRlZiA9IG5ldyBTY2hlbWEoe1xuICBleHBsaWNpdDogW2JpbmFyeSwgb21hcCwgcGFpcnMsIHNldF0sXG4gIGltcGxpY2l0OiBbdGltZXN0YW1wLCBtZXJnZV0sXG4gIGluY2x1ZGU6IFtjb3JlXSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUMxRSxxQ0FBcUM7QUFFckMsU0FBUyxNQUFNLFFBQVEsZUFBZTtBQUN0QyxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxRQUFRLGtCQUFrQjtBQUM3RSxTQUFTLElBQUksUUFBUSxZQUFZO0FBRWpDLG9EQUFvRDtBQUNwRCxpREFBaUQ7QUFDakQsT0FBTyxNQUFNLE1BQU0sSUFBSSxPQUFPO0lBQzVCLFVBQVU7UUFBQztRQUFRO1FBQU07UUFBTztLQUFJO0lBQ3BDLFVBQVU7UUFBQztRQUFXO0tBQU07SUFDNUIsU0FBUztRQUFDO0tBQUs7QUFDakIsR0FBRyJ9