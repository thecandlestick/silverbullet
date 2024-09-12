// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * {@linkcode parse} and {@linkcode stringify} for handling
 * [YAML](https://yaml.org/) encoded data.
 *
 * Ported from
 * [js-yaml v3.13.1](https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da)
 *
 * If your YAML contains multiple documents in it, you can use {@linkcode parseAll} for
 * handling it.
 *
 * To handle `regexp`, and `undefined` types, use {@linkcode EXTENDED_SCHEMA}.
 * You can also use custom types by extending schemas.
 *
 * ## :warning: Limitations
 * - `binary` type is currently not stable.
 *
 * For further examples see https://github.com/nodeca/js-yaml/tree/master/examples.
 * @example
 * ```ts
 * import {
 *   parse,
 *   stringify,
 * } from "https://deno.land/std@$STD_VERSION/yaml/mod.ts";
 *
 * const data = parse(`
 * foo: bar
 * baz:
 *   - qux
 *   - quux
 * `);
 * console.log(data);
 * // => { foo: "bar", baz: [ "qux", "quux" ] }
 *
 * const yaml = stringify({ foo: "bar", baz: ["qux", "quux"] });
 * console.log(yaml);
 * // =>
 * // foo: bar
 * // baz:
 * //   - qux
 * //   - quux
 * ```
 *
 * @module
 */ export * from "./parse.ts";
export * from "./stringify.ts";
export * from "./type.ts";
export * from "./schema/mod.ts";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvbW9kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDExLTIwMTUgYnkgVml0YWx5IFB1enJpbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG4vLyBDb3B5cmlnaHQgMjAxOC0yMDIzIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuXG4vKipcbiAqIHtAbGlua2NvZGUgcGFyc2V9IGFuZCB7QGxpbmtjb2RlIHN0cmluZ2lmeX0gZm9yIGhhbmRsaW5nXG4gKiBbWUFNTF0oaHR0cHM6Ly95YW1sLm9yZy8pIGVuY29kZWQgZGF0YS5cbiAqXG4gKiBQb3J0ZWQgZnJvbVxuICogW2pzLXlhbWwgdjMuMTMuMV0oaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL2NvbW1pdC82NjVhYWRkYTQyMzQ5ZGNhZTg2OWYxMjA0MGQ5YjEwZWYxOGQxMmRhKVxuICpcbiAqIElmIHlvdXIgWUFNTCBjb250YWlucyBtdWx0aXBsZSBkb2N1bWVudHMgaW4gaXQsIHlvdSBjYW4gdXNlIHtAbGlua2NvZGUgcGFyc2VBbGx9IGZvclxuICogaGFuZGxpbmcgaXQuXG4gKlxuICogVG8gaGFuZGxlIGByZWdleHBgLCBhbmQgYHVuZGVmaW5lZGAgdHlwZXMsIHVzZSB7QGxpbmtjb2RlIEVYVEVOREVEX1NDSEVNQX0uXG4gKiBZb3UgY2FuIGFsc28gdXNlIGN1c3RvbSB0eXBlcyBieSBleHRlbmRpbmcgc2NoZW1hcy5cbiAqXG4gKiAjIyA6d2FybmluZzogTGltaXRhdGlvbnNcbiAqIC0gYGJpbmFyeWAgdHlwZSBpcyBjdXJyZW50bHkgbm90IHN0YWJsZS5cbiAqXG4gKiBGb3IgZnVydGhlciBleGFtcGxlcyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sL3RyZWUvbWFzdGVyL2V4YW1wbGVzLlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBpbXBvcnQge1xuICogICBwYXJzZSxcbiAqICAgc3RyaW5naWZ5LFxuICogfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQCRTVERfVkVSU0lPTi95YW1sL21vZC50c1wiO1xuICpcbiAqIGNvbnN0IGRhdGEgPSBwYXJzZShgXG4gKiBmb286IGJhclxuICogYmF6OlxuICogICAtIHF1eFxuICogICAtIHF1dXhcbiAqIGApO1xuICogY29uc29sZS5sb2coZGF0YSk7XG4gKiAvLyA9PiB7IGZvbzogXCJiYXJcIiwgYmF6OiBbIFwicXV4XCIsIFwicXV1eFwiIF0gfVxuICpcbiAqIGNvbnN0IHlhbWwgPSBzdHJpbmdpZnkoeyBmb286IFwiYmFyXCIsIGJhejogW1wicXV4XCIsIFwicXV1eFwiXSB9KTtcbiAqIGNvbnNvbGUubG9nKHlhbWwpO1xuICogLy8gPT5cbiAqIC8vIGZvbzogYmFyXG4gKiAvLyBiYXo6XG4gKiAvLyAgIC0gcXV4XG4gKiAvLyAgIC0gcXV1eFxuICogYGBgXG4gKlxuICogQG1vZHVsZVxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL3BhcnNlLnRzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9zdHJpbmdpZnkudHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3R5cGUudHNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3NjaGVtYS9tb2QudHNcIjtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsMEVBQTBFO0FBQzFFLHFDQUFxQztBQUVyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTJDQyxHQUVELGNBQWMsYUFBYTtBQUMzQixjQUFjLGlCQUFpQjtBQUMvQixjQUFjLFlBQVk7QUFDMUIsY0FBYyxrQkFBa0IifQ==