// Ported and adapted from js-yaml-js-types v1.0.0:
// https://github.com/nodeca/js-yaml-js-types/tree/ac537e7bbdd3c2cbbd9882ca3919c520c2dc022b
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
const REGEXP = /^\/(?<regexp>[\s\S]+)\/(?<modifiers>[gismuy]*)$/;
export const regexp = new Type("tag:yaml.org,2002:js/regexp", {
    kind: "scalar",
    resolve (data) {
        if (data === null || !data.length) {
            return false;
        }
        const regexp = `${data}`;
        if (regexp.charAt(0) === "/") {
            // Ensure regex is properly terminated
            if (!REGEXP.test(data)) {
                return false;
            }
            // Check no duplicate modifiers
            const modifiers = [
                ...regexp.match(REGEXP)?.groups?.modifiers ?? ""
            ];
            if (new Set(modifiers).size < modifiers.length) {
                return false;
            }
        }
        return true;
    },
    construct (data) {
        const { regexp =`${data}` , modifiers =""  } = `${data}`.match(REGEXP)?.groups ?? {};
        return new RegExp(regexp, modifiers);
    },
    predicate (object) {
        return object instanceof RegExp;
    },
    represent (object) {
        return object.toString();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvcmVnZXhwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFBvcnRlZCBhbmQgYWRhcHRlZCBmcm9tIGpzLXlhbWwtanMtdHlwZXMgdjEuMC4wOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVjYS9qcy15YW1sLWpzLXR5cGVzL3RyZWUvYWM1MzdlN2JiZGQzYzJjYmJkOTg4MmNhMzkxOWM1MjBjMmRjMDIyYlxuLy8gQ29weXJpZ2h0IDIwMTEtMjAxNSBieSBWaXRhbHkgUHV6cmluLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIENvcHlyaWdodCAyMDE4LTIwMjMgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5cbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vdHlwZS50c1wiO1xuaW1wb3J0IHR5cGUgeyBBbnkgfSBmcm9tIFwiLi4vX3V0aWxzLnRzXCI7XG5cbmNvbnN0IFJFR0VYUCA9IC9eXFwvKD88cmVnZXhwPltcXHNcXFNdKylcXC8oPzxtb2RpZmllcnM+W2dpc211eV0qKSQvO1xuXG5leHBvcnQgY29uc3QgcmVnZXhwID0gbmV3IFR5cGUoXCJ0YWc6eWFtbC5vcmcsMjAwMjpqcy9yZWdleHBcIiwge1xuICBraW5kOiBcInNjYWxhclwiLFxuICByZXNvbHZlKGRhdGE6IEFueSkge1xuICAgIGlmICgoZGF0YSA9PT0gbnVsbCkgfHwgKCFkYXRhLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZWdleHAgPSBgJHtkYXRhfWA7XG4gICAgaWYgKHJlZ2V4cC5jaGFyQXQoMCkgPT09IFwiL1wiKSB7XG4gICAgICAvLyBFbnN1cmUgcmVnZXggaXMgcHJvcGVybHkgdGVybWluYXRlZFxuICAgICAgaWYgKCFSRUdFWFAudGVzdChkYXRhKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBDaGVjayBubyBkdXBsaWNhdGUgbW9kaWZpZXJzXG4gICAgICBjb25zdCBtb2RpZmllcnMgPSBbLi4uKHJlZ2V4cC5tYXRjaChSRUdFWFApPy5ncm91cHM/Lm1vZGlmaWVycyA/PyBcIlwiKV07XG4gICAgICBpZiAobmV3IFNldChtb2RpZmllcnMpLnNpemUgPCBtb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY29uc3RydWN0KGRhdGE6IHN0cmluZykge1xuICAgIGNvbnN0IHsgcmVnZXhwID0gYCR7ZGF0YX1gLCBtb2RpZmllcnMgPSBcIlwiIH0gPVxuICAgICAgYCR7ZGF0YX1gLm1hdGNoKFJFR0VYUCk/Lmdyb3VwcyA/PyB7fTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleHAsIG1vZGlmaWVycyk7XG4gIH0sXG4gIHByZWRpY2F0ZShvYmplY3Q6IHVua25vd24pIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgUmVnRXhwO1xuICB9LFxuICByZXByZXNlbnQob2JqZWN0OiBSZWdFeHApIHtcbiAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKCk7XG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtREFBbUQ7QUFDbkQsMkZBQTJGO0FBQzNGLDBFQUEwRTtBQUMxRSwwRUFBMEU7QUFFMUUsU0FBUyxJQUFJLFFBQVEsYUFBYTtBQUdsQyxNQUFNLFNBQVM7QUFFZixPQUFPLE1BQU0sU0FBUyxJQUFJLEtBQUssK0JBQStCO0lBQzVELE1BQU07SUFDTixTQUFRLElBQVMsRUFBRTtRQUNqQixJQUFJLEFBQUMsU0FBUyxJQUFJLElBQU0sQ0FBQyxLQUFLLE1BQU0sRUFBRztZQUNyQyxPQUFPLEtBQUs7UUFDZCxDQUFDO1FBRUQsTUFBTSxTQUFTLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDeEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUs7WUFDNUIsc0NBQXNDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPO2dCQUN0QixPQUFPLEtBQUs7WUFDZCxDQUFDO1lBQ0QsK0JBQStCO1lBQy9CLE1BQU0sWUFBWTttQkFBSyxPQUFPLEtBQUssQ0FBQyxTQUFTLFFBQVEsYUFBYTthQUFJO1lBQ3RFLElBQUksSUFBSSxJQUFJLFdBQVcsSUFBSSxHQUFHLFVBQVUsTUFBTSxFQUFFO2dCQUM5QyxPQUFPLEtBQUs7WUFDZCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sSUFBSTtJQUNiO0lBQ0EsV0FBVSxJQUFZLEVBQUU7UUFDdEIsTUFBTSxFQUFFLFFBQVMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBLEVBQUUsV0FBWSxHQUFFLEVBQUUsR0FDMUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLFVBQVUsQ0FBQztRQUN0QyxPQUFPLElBQUksT0FBTyxRQUFRO0lBQzVCO0lBQ0EsV0FBVSxNQUFlLEVBQUU7UUFDekIsT0FBTyxrQkFBa0I7SUFDM0I7SUFDQSxXQUFVLE1BQWMsRUFBRTtRQUN4QixPQUFPLE9BQU8sUUFBUTtJQUN4QjtBQUNGLEdBQUcifQ==