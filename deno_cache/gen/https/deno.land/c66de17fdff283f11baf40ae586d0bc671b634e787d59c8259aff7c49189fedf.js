// Ported and adapted from js-yaml-js-types v1.0.0:
// https://github.com/nodeca/js-yaml-js-types/tree/ac537e7bbdd3c2cbbd9882ca3919c520c2dc022b
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Type } from "../type.ts";
// Note: original implementation used Esprima to handle functions
// To avoid dependencies, we'll just try to check if we can construct a function from given string
function reconstructFunction(code) {
    const func = new Function(`return ${code}`)();
    if (!(func instanceof Function)) {
        throw new TypeError(`Expected function but got ${typeof func}: ${code}`);
    }
    return func;
}
export const func = new Type("tag:yaml.org,2002:js/function", {
    kind: "scalar",
    resolve (data) {
        if (data === null) {
            return false;
        }
        try {
            reconstructFunction(`${data}`);
            return true;
        } catch (_err) {
            return false;
        }
    },
    construct (data) {
        return reconstructFunction(data);
    },
    predicate (object) {
        return object instanceof Function;
    },
    represent (object) {
        return object.toString();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE4NC4wL3lhbWwvX3R5cGUvZnVuY3Rpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUG9ydGVkIGFuZCBhZGFwdGVkIGZyb20ganMteWFtbC1qcy10eXBlcyB2MS4wLjA6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL2pzLXlhbWwtanMtdHlwZXMvdHJlZS9hYzUzN2U3YmJkZDNjMmNiYmQ5ODgyY2EzOTE5YzUyMGMyZGMwMjJiXG4vLyBDb3B5cmlnaHQgMjAxMS0yMDE1IGJ5IFZpdGFseSBQdXpyaW4uIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi90eXBlLnRzXCI7XG5pbXBvcnQgdHlwZSB7IEFueSB9IGZyb20gXCIuLi9fdXRpbHMudHNcIjtcblxuLy8gTm90ZTogb3JpZ2luYWwgaW1wbGVtZW50YXRpb24gdXNlZCBFc3ByaW1hIHRvIGhhbmRsZSBmdW5jdGlvbnNcbi8vIFRvIGF2b2lkIGRlcGVuZGVuY2llcywgd2UnbGwganVzdCB0cnkgdG8gY2hlY2sgaWYgd2UgY2FuIGNvbnN0cnVjdCBhIGZ1bmN0aW9uIGZyb20gZ2l2ZW4gc3RyaW5nXG5mdW5jdGlvbiByZWNvbnN0cnVjdEZ1bmN0aW9uKGNvZGU6IHN0cmluZykge1xuICBjb25zdCBmdW5jID0gbmV3IEZ1bmN0aW9uKGByZXR1cm4gJHtjb2RlfWApKCk7XG4gIGlmICghKGZ1bmMgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBmdW5jdGlvbiBidXQgZ290ICR7dHlwZW9mIGZ1bmN9OiAke2NvZGV9YCk7XG4gIH1cbiAgcmV0dXJuIGZ1bmM7XG59XG5cbmV4cG9ydCBjb25zdCBmdW5jID0gbmV3IFR5cGUoXCJ0YWc6eWFtbC5vcmcsMjAwMjpqcy9mdW5jdGlvblwiLCB7XG4gIGtpbmQ6IFwic2NhbGFyXCIsXG4gIHJlc29sdmUoZGF0YTogQW55KSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJlY29uc3RydWN0RnVuY3Rpb24oYCR7ZGF0YX1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIGNvbnN0cnVjdChkYXRhOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcmVjb25zdHJ1Y3RGdW5jdGlvbihkYXRhKTtcbiAgfSxcbiAgcHJlZGljYXRlKG9iamVjdDogdW5rbm93bikge1xuICAgIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBGdW5jdGlvbjtcbiAgfSxcbiAgcmVwcmVzZW50KG9iamVjdDogKC4uLmFyZ3M6IEFueVtdKSA9PiBBbnkpIHtcbiAgICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKCk7XG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtREFBbUQ7QUFDbkQsMkZBQTJGO0FBQzNGLDBFQUEwRTtBQUMxRSwwRUFBMEU7QUFFMUUsU0FBUyxJQUFJLFFBQVEsYUFBYTtBQUdsQyxpRUFBaUU7QUFDakUsa0dBQWtHO0FBQ2xHLFNBQVMsb0JBQW9CLElBQVksRUFBRTtJQUN6QyxNQUFNLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUMxQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsUUFBUSxHQUFHO1FBQy9CLE1BQU0sSUFBSSxVQUFVLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxLQUFLLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtJQUMzRSxDQUFDO0lBQ0QsT0FBTztBQUNUO0FBRUEsT0FBTyxNQUFNLE9BQU8sSUFBSSxLQUFLLGlDQUFpQztJQUM1RCxNQUFNO0lBQ04sU0FBUSxJQUFTLEVBQUU7UUFDakIsSUFBSSxTQUFTLElBQUksRUFBRTtZQUNqQixPQUFPLEtBQUs7UUFDZCxDQUFDO1FBQ0QsSUFBSTtZQUNGLG9CQUFvQixDQUFDLEVBQUUsS0FBSyxDQUFDO1lBQzdCLE9BQU8sSUFBSTtRQUNiLEVBQUUsT0FBTyxNQUFNO1lBQ2IsT0FBTyxLQUFLO1FBQ2Q7SUFDRjtJQUNBLFdBQVUsSUFBWSxFQUFFO1FBQ3RCLE9BQU8sb0JBQW9CO0lBQzdCO0lBQ0EsV0FBVSxNQUFlLEVBQUU7UUFDekIsT0FBTyxrQkFBa0I7SUFDM0I7SUFDQSxXQUFVLE1BQStCLEVBQUU7UUFDekMsT0FBTyxPQUFPLFFBQVE7SUFDeEI7QUFDRixHQUFHIn0=