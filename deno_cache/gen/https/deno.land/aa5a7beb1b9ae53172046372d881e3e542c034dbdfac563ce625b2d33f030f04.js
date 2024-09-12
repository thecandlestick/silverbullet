// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
import { Schema } from "../schema.ts";
import { regexp, undefinedType } from "../_type/mod.ts";
import { def } from "./default.ts";
/***
 * Extends JS-YAML default schema with additional JavaScript types
 * It is not described in the YAML specification.
 * Functions are no longer supported for security reasons.
 *
 * @example
 * ```ts
 * import {
 *   EXTENDED_SCHEMA,
 *   parse,
 * } from "https://deno.land/std@$STD_VERSION/yaml/mod.ts";
 *
 * const data = parse(
 *   `
 *   regexp:
 *     simple: !!js/regexp foobar
 *     modifiers: !!js/regexp /foobar/mi
 *   undefined: !!js/undefined ~
 * # Disabled, see: https://github.com/denoland/deno_std/pull/1275
 * #  function: !!js/function >
 * #    function foobar() {
 * #      return 'hello world!';
 * #    }
 * `,
 *   { schema: EXTENDED_SCHEMA },
 * );
 * ```
 */ export const extended = new Schema({
    explicit: [
        regexp,
        undefinedType
    ],
    include: [
        def
    ]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvc2NoZW1hL2V4dGVuZGVkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjMgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBUaGlzIG1vZHVsZSBpcyBicm93c2VyIGNvbXBhdGlibGUuXG5cbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gXCIuLi9zY2hlbWEudHNcIjtcbmltcG9ydCB7IHJlZ2V4cCwgdW5kZWZpbmVkVHlwZSB9IGZyb20gXCIuLi9fdHlwZS9tb2QudHNcIjtcbmltcG9ydCB7IGRlZiB9IGZyb20gXCIuL2RlZmF1bHQudHNcIjtcblxuLyoqKlxuICogRXh0ZW5kcyBKUy1ZQU1MIGRlZmF1bHQgc2NoZW1hIHdpdGggYWRkaXRpb25hbCBKYXZhU2NyaXB0IHR5cGVzXG4gKiBJdCBpcyBub3QgZGVzY3JpYmVkIGluIHRoZSBZQU1MIHNwZWNpZmljYXRpb24uXG4gKiBGdW5jdGlvbnMgYXJlIG5vIGxvbmdlciBzdXBwb3J0ZWQgZm9yIHNlY3VyaXR5IHJlYXNvbnMuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBpbXBvcnQge1xuICogICBFWFRFTkRFRF9TQ0hFTUEsXG4gKiAgIHBhcnNlLFxuICogfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi95YW1sL21vZC50c1wiO1xuICpcbiAqIGNvbnN0IGRhdGEgPSBwYXJzZShcbiAqICAgYFxuICogICByZWdleHA6XG4gKiAgICAgc2ltcGxlOiAhIWpzL3JlZ2V4cCBmb29iYXJcbiAqICAgICBtb2RpZmllcnM6ICEhanMvcmVnZXhwIC9mb29iYXIvbWlcbiAqICAgdW5kZWZpbmVkOiAhIWpzL3VuZGVmaW5lZCB+XG4gKiAjIERpc2FibGVkLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kZW5vbGFuZC9kZW5vX3N0ZC9wdWxsLzEyNzVcbiAqICMgIGZ1bmN0aW9uOiAhIWpzL2Z1bmN0aW9uID5cbiAqICMgICAgZnVuY3Rpb24gZm9vYmFyKCkge1xuICogIyAgICAgIHJldHVybiAnaGVsbG8gd29ybGQhJztcbiAqICMgICAgfVxuICogYCxcbiAqICAgeyBzY2hlbWE6IEVYVEVOREVEX1NDSEVNQSB9LFxuICogKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgZXh0ZW5kZWQgPSBuZXcgU2NoZW1hKHtcbiAgZXhwbGljaXQ6IFtyZWdleHAsIHVuZGVmaW5lZFR5cGVdLFxuICBpbmNsdWRlOiBbZGVmXSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBFQUEwRTtBQUMxRSxxQ0FBcUM7QUFFckMsU0FBUyxNQUFNLFFBQVEsZUFBZTtBQUN0QyxTQUFTLE1BQU0sRUFBRSxhQUFhLFFBQVEsa0JBQWtCO0FBQ3hELFNBQVMsR0FBRyxRQUFRLGVBQWU7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTJCQyxHQUNELE9BQU8sTUFBTSxXQUFXLElBQUksT0FBTztJQUNqQyxVQUFVO1FBQUM7UUFBUTtLQUFjO0lBQ2pDLFNBQVM7UUFBQztLQUFJO0FBQ2hCLEdBQUcifQ==