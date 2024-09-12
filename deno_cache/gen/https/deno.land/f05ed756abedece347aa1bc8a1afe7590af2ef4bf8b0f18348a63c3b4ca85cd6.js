// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// This module provides an interface to `Deno.core`. For environments
// that don't have access to `Deno.core` some APIs are polyfilled, while
// some are unavailble and throw on call.
// Note: deno_std shouldn't use Deno.core namespace. We should minimize these
// usages.
// deno-lint-ignore no-explicit-any
let DenoCore;
// deno-lint-ignore no-explicit-any
const { Deno  } = globalThis;
// @ts-ignore Deno.core is not defined in types
if (Deno?.[Deno.internal]?.core) {
    // @ts-ignore Deno[Deno.internal].core is not defined in types
    DenoCore = Deno[Deno.internal].core;
} else if (Deno?.core) {
    // @ts-ignore Deno.core is not defined in types
    DenoCore = Deno.core;
} else {
    DenoCore = {};
}
export const core = {
    runMicrotasks: DenoCore.runMicrotasks ?? function() {
        throw new Error("Deno.core.runMicrotasks() is not supported in this environment");
    },
    setHasTickScheduled: DenoCore.setHasTickScheduled ?? function() {
        throw new Error("Deno.core.setHasTickScheduled() is not supported in this environment");
    },
    hasTickScheduled: DenoCore.hasTickScheduled ?? function() {
        throw new Error("Deno.core.hasTickScheduled() is not supported in this environment");
    },
    setNextTickCallback: DenoCore.setNextTickCallback ?? undefined,
    setMacrotaskCallback: DenoCore.setMacrotaskCallback ?? function() {
        throw new Error("Deno.core.setNextTickCallback() is not supported in this environment");
    },
    evalContext: DenoCore.evalContext ?? function(_code, _filename) {
        throw new Error("Deno.core.evalContext is not supported in this environment");
    },
    encode: DenoCore.encode ?? function(chunk) {
        return new TextEncoder().encode(chunk);
    },
    eventLoopHasMoreWork: DenoCore.eventLoopHasMoreWork ?? function() {
        return false;
    },
    isProxy: DenoCore.isProxy ?? function() {
        return false;
    },
    getPromiseDetails: DenoCore.getPromiseDetails ?? function(_promise) {
        throw new Error("Deno.core.getPromiseDetails is not supported in this environment");
    },
    setPromiseHooks: DenoCore.setPromiseHooks ?? function() {
        throw new Error("Deno.core.setPromiseHooks is not supported in this environment");
    },
    ops: DenoCore.ops ?? {
        op_napi_open (_filename) {
            throw new Error("Node API is not supported in this environment");
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE3Ny4wL25vZGUvX2NvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMyB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cblxuLy8gVGhpcyBtb2R1bGUgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIHRvIGBEZW5vLmNvcmVgLiBGb3IgZW52aXJvbm1lbnRzXG4vLyB0aGF0IGRvbid0IGhhdmUgYWNjZXNzIHRvIGBEZW5vLmNvcmVgIHNvbWUgQVBJcyBhcmUgcG9seWZpbGxlZCwgd2hpbGVcbi8vIHNvbWUgYXJlIHVuYXZhaWxibGUgYW5kIHRocm93IG9uIGNhbGwuXG4vLyBOb3RlOiBkZW5vX3N0ZCBzaG91bGRuJ3QgdXNlIERlbm8uY29yZSBuYW1lc3BhY2UuIFdlIHNob3VsZCBtaW5pbWl6ZSB0aGVzZVxuLy8gdXNhZ2VzLlxuXG4vLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxubGV0IERlbm9Db3JlOiBhbnk7XG5cbi8vIGRlbm8tbGludC1pZ25vcmUgbm8tZXhwbGljaXQtYW55XG5jb25zdCB7IERlbm8gfSA9IGdsb2JhbFRoaXMgYXMgYW55O1xuXG4vLyBAdHMtaWdub3JlIERlbm8uY29yZSBpcyBub3QgZGVmaW5lZCBpbiB0eXBlc1xuaWYgKERlbm8/LltEZW5vLmludGVybmFsXT8uY29yZSkge1xuICAvLyBAdHMtaWdub3JlIERlbm9bRGVuby5pbnRlcm5hbF0uY29yZSBpcyBub3QgZGVmaW5lZCBpbiB0eXBlc1xuICBEZW5vQ29yZSA9IERlbm9bRGVuby5pbnRlcm5hbF0uY29yZTtcbn0gZWxzZSBpZiAoRGVubz8uY29yZSkge1xuICAvLyBAdHMtaWdub3JlIERlbm8uY29yZSBpcyBub3QgZGVmaW5lZCBpbiB0eXBlc1xuICBEZW5vQ29yZSA9IERlbm8uY29yZTtcbn0gZWxzZSB7XG4gIERlbm9Db3JlID0ge307XG59XG5cbmV4cG9ydCBjb25zdCBjb3JlID0ge1xuICBydW5NaWNyb3Rhc2tzOiBEZW5vQ29yZS5ydW5NaWNyb3Rhc2tzID8/IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkRlbm8uY29yZS5ydW5NaWNyb3Rhc2tzKCkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGVudmlyb25tZW50XCIsXG4gICAgKTtcbiAgfSxcbiAgc2V0SGFzVGlja1NjaGVkdWxlZDogRGVub0NvcmUuc2V0SGFzVGlja1NjaGVkdWxlZCA/PyBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJEZW5vLmNvcmUuc2V0SGFzVGlja1NjaGVkdWxlZCgpIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudFwiLFxuICAgICk7XG4gIH0sXG4gIGhhc1RpY2tTY2hlZHVsZWQ6IERlbm9Db3JlLmhhc1RpY2tTY2hlZHVsZWQgPz8gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiRGVuby5jb3JlLmhhc1RpY2tTY2hlZHVsZWQoKSBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgZW52aXJvbm1lbnRcIixcbiAgICApO1xuICB9LFxuICBzZXROZXh0VGlja0NhbGxiYWNrOiBEZW5vQ29yZS5zZXROZXh0VGlja0NhbGxiYWNrID8/IHVuZGVmaW5lZCxcbiAgc2V0TWFjcm90YXNrQ2FsbGJhY2s6IERlbm9Db3JlLnNldE1hY3JvdGFza0NhbGxiYWNrID8/IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkRlbm8uY29yZS5zZXROZXh0VGlja0NhbGxiYWNrKCkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGVudmlyb25tZW50XCIsXG4gICAgKTtcbiAgfSxcbiAgZXZhbENvbnRleHQ6IERlbm9Db3JlLmV2YWxDb250ZXh0ID8/XG4gICAgZnVuY3Rpb24gKF9jb2RlOiBzdHJpbmcsIF9maWxlbmFtZTogc3RyaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiRGVuby5jb3JlLmV2YWxDb250ZXh0IGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudFwiLFxuICAgICAgKTtcbiAgICB9LFxuICBlbmNvZGU6IERlbm9Db3JlLmVuY29kZSA/PyBmdW5jdGlvbiAoY2h1bms6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xuICAgIHJldHVybiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoY2h1bmspO1xuICB9LFxuICBldmVudExvb3BIYXNNb3JlV29yazogRGVub0NvcmUuZXZlbnRMb29wSGFzTW9yZVdvcmsgPz8gZnVuY3Rpb24gKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgaXNQcm94eTogRGVub0NvcmUuaXNQcm94eSA/PyBmdW5jdGlvbiAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBnZXRQcm9taXNlRGV0YWlsczogRGVub0NvcmUuZ2V0UHJvbWlzZURldGFpbHMgPz9cbiAgICBmdW5jdGlvbiAoX3Byb21pc2U6IFByb21pc2U8dW5rbm93bj4pOiBbbnVtYmVyLCB1bmtub3duXSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiRGVuby5jb3JlLmdldFByb21pc2VEZXRhaWxzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudFwiLFxuICAgICAgKTtcbiAgICB9LFxuICBzZXRQcm9taXNlSG9va3M6IERlbm9Db3JlLnNldFByb21pc2VIb29rcyA/PyBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJEZW5vLmNvcmUuc2V0UHJvbWlzZUhvb2tzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudFwiLFxuICAgICk7XG4gIH0sXG4gIG9wczogRGVub0NvcmUub3BzID8/IHtcbiAgICBvcF9uYXBpX29wZW4oX2ZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJOb2RlIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgZW52aXJvbm1lbnRcIixcbiAgICAgICk7XG4gICAgfSxcbiAgfSxcbn07XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEVBQTBFO0FBRTFFLHFFQUFxRTtBQUNyRSx3RUFBd0U7QUFDeEUseUNBQXlDO0FBQ3pDLDZFQUE2RTtBQUM3RSxVQUFVO0FBRVYsbUNBQW1DO0FBQ25DLElBQUk7QUFFSixtQ0FBbUM7QUFDbkMsTUFBTSxFQUFFLEtBQUksRUFBRSxHQUFHO0FBRWpCLCtDQUErQztBQUMvQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxFQUFFLE1BQU07SUFDL0IsOERBQThEO0lBQzlELFdBQVcsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsSUFBSTtBQUNyQyxPQUFPLElBQUksTUFBTSxNQUFNO0lBQ3JCLCtDQUErQztJQUMvQyxXQUFXLEtBQUssSUFBSTtBQUN0QixPQUFPO0lBQ0wsV0FBVyxDQUFDO0FBQ2QsQ0FBQztBQUVELE9BQU8sTUFBTSxPQUFPO0lBQ2xCLGVBQWUsU0FBUyxhQUFhLElBQUksV0FBWTtRQUNuRCxNQUFNLElBQUksTUFDUixrRUFDQTtJQUNKO0lBQ0EscUJBQXFCLFNBQVMsbUJBQW1CLElBQUksV0FBWTtRQUMvRCxNQUFNLElBQUksTUFDUix3RUFDQTtJQUNKO0lBQ0Esa0JBQWtCLFNBQVMsZ0JBQWdCLElBQUksV0FBWTtRQUN6RCxNQUFNLElBQUksTUFDUixxRUFDQTtJQUNKO0lBQ0EscUJBQXFCLFNBQVMsbUJBQW1CLElBQUk7SUFDckQsc0JBQXNCLFNBQVMsb0JBQW9CLElBQUksV0FBWTtRQUNqRSxNQUFNLElBQUksTUFDUix3RUFDQTtJQUNKO0lBQ0EsYUFBYSxTQUFTLFdBQVcsSUFDL0IsU0FBVSxLQUFhLEVBQUUsU0FBaUIsRUFBRTtRQUMxQyxNQUFNLElBQUksTUFDUiw4REFDQTtJQUNKO0lBQ0YsUUFBUSxTQUFTLE1BQU0sSUFBSSxTQUFVLEtBQWEsRUFBYztRQUM5RCxPQUFPLElBQUksY0FBYyxNQUFNLENBQUM7SUFDbEM7SUFDQSxzQkFBc0IsU0FBUyxvQkFBb0IsSUFBSSxXQUFxQjtRQUMxRSxPQUFPLEtBQUs7SUFDZDtJQUNBLFNBQVMsU0FBUyxPQUFPLElBQUksV0FBcUI7UUFDaEQsT0FBTyxLQUFLO0lBQ2Q7SUFDQSxtQkFBbUIsU0FBUyxpQkFBaUIsSUFDM0MsU0FBVSxRQUEwQixFQUFxQjtRQUN2RCxNQUFNLElBQUksTUFDUixvRUFDQTtJQUNKO0lBQ0YsaUJBQWlCLFNBQVMsZUFBZSxJQUFJLFdBQVk7UUFDdkQsTUFBTSxJQUFJLE1BQ1Isa0VBQ0E7SUFDSjtJQUNBLEtBQUssU0FBUyxHQUFHLElBQUk7UUFDbkIsY0FBYSxTQUFpQixFQUFFO1lBQzlCLE1BQU0sSUFBSSxNQUNSLGlEQUNBO1FBQ0o7SUFDRjtBQUNGLEVBQUUifQ==