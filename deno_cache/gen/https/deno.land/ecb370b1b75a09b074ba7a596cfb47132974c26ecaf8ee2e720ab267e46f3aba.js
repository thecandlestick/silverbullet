// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { Schema } from "../schema.ts";
import { bool, float, int, nil } from "../_type/mod.ts";
import { failsafe } from "./failsafe.ts";
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
export const json = new Schema({
    implicit: [
        nil,
        bool,
        int,
        float
    ],
    include: [
        failsafe
    ]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvc2NoZW1hL2pzb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGZyb20ganMteWFtbCB2My4xMy4xOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGJyb3dzZXIgY29tcGF0aWJsZS5cblxuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSBcIi4uL3NjaGVtYS50c1wiO1xuaW1wb3J0IHsgYm9vbCwgZmxvYXQsIGludCwgbmlsIH0gZnJvbSBcIi4uL190eXBlL21vZC50c1wiO1xuaW1wb3J0IHsgZmFpbHNhZmUgfSBmcm9tIFwiLi9mYWlsc2FmZS50c1wiO1xuXG4vLyBTdGFuZGFyZCBZQU1MJ3MgSlNPTiBzY2hlbWEuXG4vLyBodHRwOi8vd3d3LnlhbWwub3JnL3NwZWMvMS4yL3NwZWMuaHRtbCNpZDI4MDMyMzFcbmV4cG9ydCBjb25zdCBqc29uID0gbmV3IFNjaGVtYSh7XG4gIGltcGxpY2l0OiBbbmlsLCBib29sLCBpbnQsIGZsb2F0XSxcbiAgaW5jbHVkZTogW2ZhaWxzYWZlXSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixvRkFBb0Y7QUFDcEYsMEVBQTBFO0FBQzFFLDBFQUEwRTtBQUMxRSxxQ0FBcUM7QUFFckMsU0FBUyxNQUFNLFFBQVEsZUFBZTtBQUN0QyxTQUFTLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsUUFBUSxrQkFBa0I7QUFDeEQsU0FBUyxRQUFRLFFBQVEsZ0JBQWdCO0FBRXpDLCtCQUErQjtBQUMvQixtREFBbUQ7QUFDbkQsT0FBTyxNQUFNLE9BQU8sSUFBSSxPQUFPO0lBQzdCLFVBQVU7UUFBQztRQUFLO1FBQU07UUFBSztLQUFNO0lBQ2pDLFNBQVM7UUFBQztLQUFTO0FBQ3JCLEdBQUcifQ==