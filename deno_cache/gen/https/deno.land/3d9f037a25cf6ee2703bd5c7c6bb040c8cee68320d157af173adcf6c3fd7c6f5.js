// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { globToRegExp, isAbsolute, isGlob, joinGlobs, resolve, SEP_PATTERN } from "../path/mod.ts";
import { walk, walkSync } from "./walk.ts";
import { assert } from "../_util/asserts.ts";
import { isWindows } from "../_util/os.ts";
import { createWalkEntry, createWalkEntrySync, toPathString } from "./_util.ts";
function split(path) {
    const s = SEP_PATTERN.source;
    const segments = path.replace(new RegExp(`^${s}|${s}$`, "g"), "").split(SEP_PATTERN);
    const isAbsolute_ = isAbsolute(path);
    return {
        segments,
        isAbsolute: isAbsolute_,
        hasTrailingSep: !!path.match(new RegExp(`${s}$`)),
        winRoot: isWindows && isAbsolute_ ? segments.shift() : undefined
    };
}
function throwUnlessNotFound(error) {
    if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
    }
}
function comparePath(a, b) {
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    return 0;
}
/** Expand the glob string from the specified `root` directory and yield each
 * result as a `WalkEntry` object.
 *
 * See [`globToRegExp()`](../path/glob.ts#globToRegExp) for details on supported
 * syntax.
 *
 * Example:
 * ```ts
 *      import { expandGlob } from "https://deno.land/std@$STD_VERSION/fs/expand_glob.ts";
 *      for await (const file of expandGlob("**\/*.ts")) {
 *        console.log(file);
 *      }
 * ```
 */ export async function* expandGlob(glob, { root =Deno.cwd() , exclude =[] , includeDirs =true , extended =true , globstar =false , caseInsensitive  } = {}) {
    const globOptions = {
        extended,
        globstar,
        caseInsensitive
    };
    const absRoot = resolve(root);
    const resolveFromRoot = (path)=>resolve(absRoot, path);
    const excludePatterns = exclude.map(resolveFromRoot).map((s)=>globToRegExp(s, globOptions));
    const shouldInclude = (path)=>!excludePatterns.some((p)=>!!path.match(p));
    const { segments , isAbsolute: isGlobAbsolute , hasTrailingSep , winRoot  } = split(toPathString(glob));
    let fixedRoot = isGlobAbsolute ? winRoot != undefined ? winRoot : "/" : absRoot;
    while(segments.length > 0 && !isGlob(segments[0])){
        const seg = segments.shift();
        assert(seg != null);
        fixedRoot = joinGlobs([
            fixedRoot,
            seg
        ], globOptions);
    }
    let fixedRootInfo;
    try {
        fixedRootInfo = await createWalkEntry(fixedRoot);
    } catch (error) {
        return throwUnlessNotFound(error);
    }
    async function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
            return;
        } else if (globSegment == "..") {
            const parentPath = joinGlobs([
                walkInfo.path,
                ".."
            ], globOptions);
            try {
                if (shouldInclude(parentPath)) {
                    return yield await createWalkEntry(parentPath);
                }
            } catch (error) {
                throwUnlessNotFound(error);
            }
            return;
        } else if (globSegment == "**") {
            return yield* walk(walkInfo.path, {
                skip: excludePatterns,
                maxDepth: globstar ? Infinity : 1
            });
        }
        const globPattern = globToRegExp(globSegment, globOptions);
        for await (const walkEntry of walk(walkInfo.path, {
            maxDepth: 1,
            skip: excludePatterns
        })){
            if (walkEntry.path != walkInfo.path && walkEntry.name.match(globPattern)) {
                yield walkEntry;
            }
        }
    }
    let currentMatches = [
        fixedRootInfo
    ];
    for (const segment of segments){
        // Advancing the list of current matches may introduce duplicates, so we
        // pass everything through this Map.
        const nextMatchMap = new Map();
        await Promise.all(currentMatches.map(async (currentMatch)=>{
            for await (const nextMatch of advanceMatch(currentMatch, segment)){
                nextMatchMap.set(nextMatch.path, nextMatch);
            }
        }));
        currentMatches = [
            ...nextMatchMap.values()
        ].sort(comparePath);
    }
    if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry)=>entry.isDirectory);
    }
    if (!includeDirs) {
        currentMatches = currentMatches.filter((entry)=>!entry.isDirectory);
    }
    yield* currentMatches;
}
/** Synchronous version of `expandGlob()`.
 *
 * Example:
 *
 * ```ts
 *      import { expandGlobSync } from "https://deno.land/std@$STD_VERSION/fs/expand_glob.ts";
 *      for (const file of expandGlobSync("**\/*.ts")) {
 *        console.log(file);
 *      }
 * ```
 */ export function* expandGlobSync(glob, { root =Deno.cwd() , exclude =[] , includeDirs =true , extended =true , globstar =false , caseInsensitive  } = {}) {
    const globOptions = {
        extended,
        globstar,
        caseInsensitive
    };
    const absRoot = resolve(root);
    const resolveFromRoot = (path)=>resolve(absRoot, path);
    const excludePatterns = exclude.map(resolveFromRoot).map((s)=>globToRegExp(s, globOptions));
    const shouldInclude = (path)=>!excludePatterns.some((p)=>!!path.match(p));
    const { segments , isAbsolute: isGlobAbsolute , hasTrailingSep , winRoot  } = split(toPathString(glob));
    let fixedRoot = isGlobAbsolute ? winRoot != undefined ? winRoot : "/" : absRoot;
    while(segments.length > 0 && !isGlob(segments[0])){
        const seg = segments.shift();
        assert(seg != null);
        fixedRoot = joinGlobs([
            fixedRoot,
            seg
        ], globOptions);
    }
    let fixedRootInfo;
    try {
        fixedRootInfo = createWalkEntrySync(fixedRoot);
    } catch (error) {
        return throwUnlessNotFound(error);
    }
    function* advanceMatch(walkInfo, globSegment) {
        if (!walkInfo.isDirectory) {
            return;
        } else if (globSegment == "..") {
            const parentPath = joinGlobs([
                walkInfo.path,
                ".."
            ], globOptions);
            try {
                if (shouldInclude(parentPath)) {
                    return yield createWalkEntrySync(parentPath);
                }
            } catch (error) {
                throwUnlessNotFound(error);
            }
            return;
        } else if (globSegment == "**") {
            return yield* walkSync(walkInfo.path, {
                skip: excludePatterns,
                maxDepth: globstar ? Infinity : 1
            });
        }
        const globPattern = globToRegExp(globSegment, globOptions);
        for (const walkEntry of walkSync(walkInfo.path, {
            maxDepth: 1,
            skip: excludePatterns
        })){
            if (walkEntry.path != walkInfo.path && walkEntry.name.match(globPattern)) {
                yield walkEntry;
            }
        }
    }
    let currentMatches = [
        fixedRootInfo
    ];
    for (const segment of segments){
        // Advancing the list of current matches may introduce duplicates, so we
        // pass everything through this Map.
        const nextMatchMap = new Map();
        for (const currentMatch of currentMatches){
            for (const nextMatch of advanceMatch(currentMatch, segment)){
                nextMatchMap.set(nextMatch.path, nextMatch);
            }
        }
        currentMatches = [
            ...nextMatchMap.values()
        ].sort(comparePath);
    }
    if (hasTrailingSep) {
        currentMatches = currentMatches.filter((entry)=>entry.isDirectory);
    }
    if (!includeDirs) {
        currentMatches = currentMatches.filter((entry)=>!entry.isDirectory);
    }
    yield* currentMatches;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL2V4cGFuZF9nbG9iLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5pbXBvcnQge1xuICBHbG9iT3B0aW9ucyxcbiAgZ2xvYlRvUmVnRXhwLFxuICBpc0Fic29sdXRlLFxuICBpc0dsb2IsXG4gIGpvaW5HbG9icyxcbiAgcmVzb2x2ZSxcbiAgU0VQX1BBVFRFUk4sXG59IGZyb20gXCIuLi9wYXRoL21vZC50c1wiO1xuaW1wb3J0IHsgd2Fsaywgd2Fsa1N5bmMgfSBmcm9tIFwiLi93YWxrLnRzXCI7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiLi4vX3V0aWwvYXNzZXJ0cy50c1wiO1xuaW1wb3J0IHsgaXNXaW5kb3dzIH0gZnJvbSBcIi4uL191dGlsL29zLnRzXCI7XG5pbXBvcnQge1xuICBjcmVhdGVXYWxrRW50cnksXG4gIGNyZWF0ZVdhbGtFbnRyeVN5bmMsXG4gIHRvUGF0aFN0cmluZyxcbiAgV2Fsa0VudHJ5LFxufSBmcm9tIFwiLi9fdXRpbC50c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4cGFuZEdsb2JPcHRpb25zIGV4dGVuZHMgT21pdDxHbG9iT3B0aW9ucywgXCJvc1wiPiB7XG4gIHJvb3Q/OiBzdHJpbmc7XG4gIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgaW5jbHVkZURpcnM/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgU3BsaXRQYXRoIHtcbiAgc2VnbWVudHM6IHN0cmluZ1tdO1xuICBpc0Fic29sdXRlOiBib29sZWFuO1xuICBoYXNUcmFpbGluZ1NlcDogYm9vbGVhbjtcbiAgLy8gRGVmaW5lZCBmb3IgYW55IGFic29sdXRlIFdpbmRvd3MgcGF0aC5cbiAgd2luUm9vdD86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gc3BsaXQocGF0aDogc3RyaW5nKTogU3BsaXRQYXRoIHtcbiAgY29uc3QgcyA9IFNFUF9QQVRURVJOLnNvdXJjZTtcbiAgY29uc3Qgc2VnbWVudHMgPSBwYXRoXG4gICAgLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7c318JHtzfSRgLCBcImdcIiksIFwiXCIpXG4gICAgLnNwbGl0KFNFUF9QQVRURVJOKTtcbiAgY29uc3QgaXNBYnNvbHV0ZV8gPSBpc0Fic29sdXRlKHBhdGgpO1xuICByZXR1cm4ge1xuICAgIHNlZ21lbnRzLFxuICAgIGlzQWJzb2x1dGU6IGlzQWJzb2x1dGVfLFxuICAgIGhhc1RyYWlsaW5nU2VwOiAhIXBhdGgubWF0Y2gobmV3IFJlZ0V4cChgJHtzfSRgKSksXG4gICAgd2luUm9vdDogaXNXaW5kb3dzICYmIGlzQWJzb2x1dGVfID8gc2VnbWVudHMuc2hpZnQoKSA6IHVuZGVmaW5lZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGhyb3dVbmxlc3NOb3RGb3VuZChlcnJvcjogdW5rbm93bikge1xuICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLk5vdEZvdW5kKSkge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVQYXRoKGE6IFdhbGtFbnRyeSwgYjogV2Fsa0VudHJ5KTogbnVtYmVyIHtcbiAgaWYgKGEucGF0aCA8IGIucGF0aCkgcmV0dXJuIC0xO1xuICBpZiAoYS5wYXRoID4gYi5wYXRoKSByZXR1cm4gMTtcbiAgcmV0dXJuIDA7XG59XG5cbi8qKiBFeHBhbmQgdGhlIGdsb2Igc3RyaW5nIGZyb20gdGhlIHNwZWNpZmllZCBgcm9vdGAgZGlyZWN0b3J5IGFuZCB5aWVsZCBlYWNoXG4gKiByZXN1bHQgYXMgYSBgV2Fsa0VudHJ5YCBvYmplY3QuXG4gKlxuICogU2VlIFtgZ2xvYlRvUmVnRXhwKClgXSguLi9wYXRoL2dsb2IudHMjZ2xvYlRvUmVnRXhwKSBmb3IgZGV0YWlscyBvbiBzdXBwb3J0ZWRcbiAqIHN5bnRheC5cbiAqXG4gKiBFeGFtcGxlOlxuICogYGBgdHNcbiAqICAgICAgaW1wb3J0IHsgZXhwYW5kR2xvYiB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL2ZzL2V4cGFuZF9nbG9iLnRzXCI7XG4gKiAgICAgIGZvciBhd2FpdCAoY29uc3QgZmlsZSBvZiBleHBhbmRHbG9iKFwiKipcXC8qLnRzXCIpKSB7XG4gKiAgICAgICAgY29uc29sZS5sb2coZmlsZSk7XG4gKiAgICAgIH1cbiAqIGBgYFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24qIGV4cGFuZEdsb2IoXG4gIGdsb2I6IHN0cmluZyB8IFVSTCxcbiAge1xuICAgIHJvb3QgPSBEZW5vLmN3ZCgpLFxuICAgIGV4Y2x1ZGUgPSBbXSxcbiAgICBpbmNsdWRlRGlycyA9IHRydWUsXG4gICAgZXh0ZW5kZWQgPSB0cnVlLFxuICAgIGdsb2JzdGFyID0gZmFsc2UsXG4gICAgY2FzZUluc2Vuc2l0aXZlLFxuICB9OiBFeHBhbmRHbG9iT3B0aW9ucyA9IHt9LFxuKTogQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFdhbGtFbnRyeT4ge1xuICBjb25zdCBnbG9iT3B0aW9uczogR2xvYk9wdGlvbnMgPSB7IGV4dGVuZGVkLCBnbG9ic3RhciwgY2FzZUluc2Vuc2l0aXZlIH07XG4gIGNvbnN0IGFic1Jvb3QgPSByZXNvbHZlKHJvb3QpO1xuICBjb25zdCByZXNvbHZlRnJvbVJvb3QgPSAocGF0aDogc3RyaW5nKTogc3RyaW5nID0+IHJlc29sdmUoYWJzUm9vdCwgcGF0aCk7XG4gIGNvbnN0IGV4Y2x1ZGVQYXR0ZXJucyA9IGV4Y2x1ZGVcbiAgICAubWFwKHJlc29sdmVGcm9tUm9vdClcbiAgICAubWFwKChzOiBzdHJpbmcpOiBSZWdFeHAgPT4gZ2xvYlRvUmVnRXhwKHMsIGdsb2JPcHRpb25zKSk7XG4gIGNvbnN0IHNob3VsZEluY2x1ZGUgPSAocGF0aDogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgICFleGNsdWRlUGF0dGVybnMuc29tZSgocDogUmVnRXhwKTogYm9vbGVhbiA9PiAhIXBhdGgubWF0Y2gocCkpO1xuICBjb25zdCB7XG4gICAgc2VnbWVudHMsXG4gICAgaXNBYnNvbHV0ZTogaXNHbG9iQWJzb2x1dGUsXG4gICAgaGFzVHJhaWxpbmdTZXAsXG4gICAgd2luUm9vdCxcbiAgfSA9IHNwbGl0KHRvUGF0aFN0cmluZyhnbG9iKSk7XG5cbiAgbGV0IGZpeGVkUm9vdCA9IGlzR2xvYkFic29sdXRlXG4gICAgPyB3aW5Sb290ICE9IHVuZGVmaW5lZCA/IHdpblJvb3QgOiBcIi9cIlxuICAgIDogYWJzUm9vdDtcbiAgd2hpbGUgKHNlZ21lbnRzLmxlbmd0aCA+IDAgJiYgIWlzR2xvYihzZWdtZW50c1swXSkpIHtcbiAgICBjb25zdCBzZWcgPSBzZWdtZW50cy5zaGlmdCgpO1xuICAgIGFzc2VydChzZWcgIT0gbnVsbCk7XG4gICAgZml4ZWRSb290ID0gam9pbkdsb2JzKFtmaXhlZFJvb3QsIHNlZ10sIGdsb2JPcHRpb25zKTtcbiAgfVxuXG4gIGxldCBmaXhlZFJvb3RJbmZvOiBXYWxrRW50cnk7XG4gIHRyeSB7XG4gICAgZml4ZWRSb290SW5mbyA9IGF3YWl0IGNyZWF0ZVdhbGtFbnRyeShmaXhlZFJvb3QpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0aHJvd1VubGVzc05vdEZvdW5kKGVycm9yKTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uKiBhZHZhbmNlTWF0Y2goXG4gICAgd2Fsa0luZm86IFdhbGtFbnRyeSxcbiAgICBnbG9iU2VnbWVudDogc3RyaW5nLFxuICApOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8V2Fsa0VudHJ5PiB7XG4gICAgaWYgKCF3YWxrSW5mby5pc0RpcmVjdG9yeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoZ2xvYlNlZ21lbnQgPT0gXCIuLlwiKSB7XG4gICAgICBjb25zdCBwYXJlbnRQYXRoID0gam9pbkdsb2JzKFt3YWxrSW5mby5wYXRoLCBcIi4uXCJdLCBnbG9iT3B0aW9ucyk7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoc2hvdWxkSW5jbHVkZShwYXJlbnRQYXRoKSkge1xuICAgICAgICAgIHJldHVybiB5aWVsZCBhd2FpdCBjcmVhdGVXYWxrRW50cnkocGFyZW50UGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93VW5sZXNzTm90Rm91bmQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoZ2xvYlNlZ21lbnQgPT0gXCIqKlwiKSB7XG4gICAgICByZXR1cm4geWllbGQqIHdhbGsod2Fsa0luZm8ucGF0aCwge1xuICAgICAgICBza2lwOiBleGNsdWRlUGF0dGVybnMsXG4gICAgICAgIG1heERlcHRoOiBnbG9ic3RhciA/IEluZmluaXR5IDogMSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBnbG9iUGF0dGVybiA9IGdsb2JUb1JlZ0V4cChnbG9iU2VnbWVudCwgZ2xvYk9wdGlvbnMpO1xuICAgIGZvciBhd2FpdCAoXG4gICAgICBjb25zdCB3YWxrRW50cnkgb2Ygd2Fsayh3YWxrSW5mby5wYXRoLCB7XG4gICAgICAgIG1heERlcHRoOiAxLFxuICAgICAgICBza2lwOiBleGNsdWRlUGF0dGVybnMsXG4gICAgICB9KVxuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICB3YWxrRW50cnkucGF0aCAhPSB3YWxrSW5mby5wYXRoICYmXG4gICAgICAgIHdhbGtFbnRyeS5uYW1lLm1hdGNoKGdsb2JQYXR0ZXJuKVxuICAgICAgKSB7XG4gICAgICAgIHlpZWxkIHdhbGtFbnRyeTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgY3VycmVudE1hdGNoZXM6IFdhbGtFbnRyeVtdID0gW2ZpeGVkUm9vdEluZm9dO1xuICBmb3IgKGNvbnN0IHNlZ21lbnQgb2Ygc2VnbWVudHMpIHtcbiAgICAvLyBBZHZhbmNpbmcgdGhlIGxpc3Qgb2YgY3VycmVudCBtYXRjaGVzIG1heSBpbnRyb2R1Y2UgZHVwbGljYXRlcywgc28gd2VcbiAgICAvLyBwYXNzIGV2ZXJ5dGhpbmcgdGhyb3VnaCB0aGlzIE1hcC5cbiAgICBjb25zdCBuZXh0TWF0Y2hNYXA6IE1hcDxzdHJpbmcsIFdhbGtFbnRyeT4gPSBuZXcgTWFwKCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBjdXJyZW50TWF0Y2hlcy5tYXAoYXN5bmMgKGN1cnJlbnRNYXRjaCkgPT4ge1xuICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IG5leHRNYXRjaCBvZiBhZHZhbmNlTWF0Y2goY3VycmVudE1hdGNoLCBzZWdtZW50KSkge1xuICAgICAgICAgIG5leHRNYXRjaE1hcC5zZXQobmV4dE1hdGNoLnBhdGgsIG5leHRNYXRjaCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gICAgY3VycmVudE1hdGNoZXMgPSBbLi4ubmV4dE1hdGNoTWFwLnZhbHVlcygpXS5zb3J0KGNvbXBhcmVQYXRoKTtcbiAgfVxuXG4gIGlmIChoYXNUcmFpbGluZ1NlcCkge1xuICAgIGN1cnJlbnRNYXRjaGVzID0gY3VycmVudE1hdGNoZXMuZmlsdGVyKFxuICAgICAgKGVudHJ5OiBXYWxrRW50cnkpOiBib29sZWFuID0+IGVudHJ5LmlzRGlyZWN0b3J5LFxuICAgICk7XG4gIH1cbiAgaWYgKCFpbmNsdWRlRGlycykge1xuICAgIGN1cnJlbnRNYXRjaGVzID0gY3VycmVudE1hdGNoZXMuZmlsdGVyKFxuICAgICAgKGVudHJ5OiBXYWxrRW50cnkpOiBib29sZWFuID0+ICFlbnRyeS5pc0RpcmVjdG9yeSxcbiAgICApO1xuICB9XG4gIHlpZWxkKiBjdXJyZW50TWF0Y2hlcztcbn1cblxuLyoqIFN5bmNocm9ub3VzIHZlcnNpb24gb2YgYGV4cGFuZEdsb2IoKWAuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogICAgICBpbXBvcnQgeyBleHBhbmRHbG9iU3luYyB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAJFNURF9WRVJTSU9OL2ZzL2V4cGFuZF9nbG9iLnRzXCI7XG4gKiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBleHBhbmRHbG9iU3luYyhcIioqXFwvKi50c1wiKSkge1xuICogICAgICAgIGNvbnNvbGUubG9nKGZpbGUpO1xuICogICAgICB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uKiBleHBhbmRHbG9iU3luYyhcbiAgZ2xvYjogc3RyaW5nIHwgVVJMLFxuICB7XG4gICAgcm9vdCA9IERlbm8uY3dkKCksXG4gICAgZXhjbHVkZSA9IFtdLFxuICAgIGluY2x1ZGVEaXJzID0gdHJ1ZSxcbiAgICBleHRlbmRlZCA9IHRydWUsXG4gICAgZ2xvYnN0YXIgPSBmYWxzZSxcbiAgICBjYXNlSW5zZW5zaXRpdmUsXG4gIH06IEV4cGFuZEdsb2JPcHRpb25zID0ge30sXG4pOiBJdGVyYWJsZUl0ZXJhdG9yPFdhbGtFbnRyeT4ge1xuICBjb25zdCBnbG9iT3B0aW9uczogR2xvYk9wdGlvbnMgPSB7IGV4dGVuZGVkLCBnbG9ic3RhciwgY2FzZUluc2Vuc2l0aXZlIH07XG4gIGNvbnN0IGFic1Jvb3QgPSByZXNvbHZlKHJvb3QpO1xuICBjb25zdCByZXNvbHZlRnJvbVJvb3QgPSAocGF0aDogc3RyaW5nKTogc3RyaW5nID0+IHJlc29sdmUoYWJzUm9vdCwgcGF0aCk7XG4gIGNvbnN0IGV4Y2x1ZGVQYXR0ZXJucyA9IGV4Y2x1ZGVcbiAgICAubWFwKHJlc29sdmVGcm9tUm9vdClcbiAgICAubWFwKChzOiBzdHJpbmcpOiBSZWdFeHAgPT4gZ2xvYlRvUmVnRXhwKHMsIGdsb2JPcHRpb25zKSk7XG4gIGNvbnN0IHNob3VsZEluY2x1ZGUgPSAocGF0aDogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgICFleGNsdWRlUGF0dGVybnMuc29tZSgocDogUmVnRXhwKTogYm9vbGVhbiA9PiAhIXBhdGgubWF0Y2gocCkpO1xuICBjb25zdCB7XG4gICAgc2VnbWVudHMsXG4gICAgaXNBYnNvbHV0ZTogaXNHbG9iQWJzb2x1dGUsXG4gICAgaGFzVHJhaWxpbmdTZXAsXG4gICAgd2luUm9vdCxcbiAgfSA9IHNwbGl0KHRvUGF0aFN0cmluZyhnbG9iKSk7XG5cbiAgbGV0IGZpeGVkUm9vdCA9IGlzR2xvYkFic29sdXRlXG4gICAgPyB3aW5Sb290ICE9IHVuZGVmaW5lZCA/IHdpblJvb3QgOiBcIi9cIlxuICAgIDogYWJzUm9vdDtcbiAgd2hpbGUgKHNlZ21lbnRzLmxlbmd0aCA+IDAgJiYgIWlzR2xvYihzZWdtZW50c1swXSkpIHtcbiAgICBjb25zdCBzZWcgPSBzZWdtZW50cy5zaGlmdCgpO1xuICAgIGFzc2VydChzZWcgIT0gbnVsbCk7XG4gICAgZml4ZWRSb290ID0gam9pbkdsb2JzKFtmaXhlZFJvb3QsIHNlZ10sIGdsb2JPcHRpb25zKTtcbiAgfVxuXG4gIGxldCBmaXhlZFJvb3RJbmZvOiBXYWxrRW50cnk7XG4gIHRyeSB7XG4gICAgZml4ZWRSb290SW5mbyA9IGNyZWF0ZVdhbGtFbnRyeVN5bmMoZml4ZWRSb290KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gdGhyb3dVbmxlc3NOb3RGb3VuZChlcnJvcik7XG4gIH1cblxuICBmdW5jdGlvbiogYWR2YW5jZU1hdGNoKFxuICAgIHdhbGtJbmZvOiBXYWxrRW50cnksXG4gICAgZ2xvYlNlZ21lbnQ6IHN0cmluZyxcbiAgKTogSXRlcmFibGVJdGVyYXRvcjxXYWxrRW50cnk+IHtcbiAgICBpZiAoIXdhbGtJbmZvLmlzRGlyZWN0b3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChnbG9iU2VnbWVudCA9PSBcIi4uXCIpIHtcbiAgICAgIGNvbnN0IHBhcmVudFBhdGggPSBqb2luR2xvYnMoW3dhbGtJbmZvLnBhdGgsIFwiLi5cIl0sIGdsb2JPcHRpb25zKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChzaG91bGRJbmNsdWRlKHBhcmVudFBhdGgpKSB7XG4gICAgICAgICAgcmV0dXJuIHlpZWxkIGNyZWF0ZVdhbGtFbnRyeVN5bmMocGFyZW50UGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93VW5sZXNzTm90Rm91bmQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoZ2xvYlNlZ21lbnQgPT0gXCIqKlwiKSB7XG4gICAgICByZXR1cm4geWllbGQqIHdhbGtTeW5jKHdhbGtJbmZvLnBhdGgsIHtcbiAgICAgICAgc2tpcDogZXhjbHVkZVBhdHRlcm5zLFxuICAgICAgICBtYXhEZXB0aDogZ2xvYnN0YXIgPyBJbmZpbml0eSA6IDEsXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgZ2xvYlBhdHRlcm4gPSBnbG9iVG9SZWdFeHAoZ2xvYlNlZ21lbnQsIGdsb2JPcHRpb25zKTtcbiAgICBmb3IgKFxuICAgICAgY29uc3Qgd2Fsa0VudHJ5IG9mIHdhbGtTeW5jKHdhbGtJbmZvLnBhdGgsIHtcbiAgICAgICAgbWF4RGVwdGg6IDEsXG4gICAgICAgIHNraXA6IGV4Y2x1ZGVQYXR0ZXJucyxcbiAgICAgIH0pXG4gICAgKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHdhbGtFbnRyeS5wYXRoICE9IHdhbGtJbmZvLnBhdGggJiZcbiAgICAgICAgd2Fsa0VudHJ5Lm5hbWUubWF0Y2goZ2xvYlBhdHRlcm4pXG4gICAgICApIHtcbiAgICAgICAgeWllbGQgd2Fsa0VudHJ5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBjdXJyZW50TWF0Y2hlczogV2Fsa0VudHJ5W10gPSBbZml4ZWRSb290SW5mb107XG4gIGZvciAoY29uc3Qgc2VnbWVudCBvZiBzZWdtZW50cykge1xuICAgIC8vIEFkdmFuY2luZyB0aGUgbGlzdCBvZiBjdXJyZW50IG1hdGNoZXMgbWF5IGludHJvZHVjZSBkdXBsaWNhdGVzLCBzbyB3ZVxuICAgIC8vIHBhc3MgZXZlcnl0aGluZyB0aHJvdWdoIHRoaXMgTWFwLlxuICAgIGNvbnN0IG5leHRNYXRjaE1hcDogTWFwPHN0cmluZywgV2Fsa0VudHJ5PiA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGN1cnJlbnRNYXRjaCBvZiBjdXJyZW50TWF0Y2hlcykge1xuICAgICAgZm9yIChjb25zdCBuZXh0TWF0Y2ggb2YgYWR2YW5jZU1hdGNoKGN1cnJlbnRNYXRjaCwgc2VnbWVudCkpIHtcbiAgICAgICAgbmV4dE1hdGNoTWFwLnNldChuZXh0TWF0Y2gucGF0aCwgbmV4dE1hdGNoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY3VycmVudE1hdGNoZXMgPSBbLi4ubmV4dE1hdGNoTWFwLnZhbHVlcygpXS5zb3J0KGNvbXBhcmVQYXRoKTtcbiAgfVxuXG4gIGlmIChoYXNUcmFpbGluZ1NlcCkge1xuICAgIGN1cnJlbnRNYXRjaGVzID0gY3VycmVudE1hdGNoZXMuZmlsdGVyKFxuICAgICAgKGVudHJ5OiBXYWxrRW50cnkpOiBib29sZWFuID0+IGVudHJ5LmlzRGlyZWN0b3J5LFxuICAgICk7XG4gIH1cbiAgaWYgKCFpbmNsdWRlRGlycykge1xuICAgIGN1cnJlbnRNYXRjaGVzID0gY3VycmVudE1hdGNoZXMuZmlsdGVyKFxuICAgICAgKGVudHJ5OiBXYWxrRW50cnkpOiBib29sZWFuID0+ICFlbnRyeS5pc0RpcmVjdG9yeSxcbiAgICApO1xuICB9XG4gIHlpZWxkKiBjdXJyZW50TWF0Y2hlcztcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsU0FFRSxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLFdBQVcsUUFDTixpQkFBaUI7QUFDeEIsU0FBUyxJQUFJLEVBQUUsUUFBUSxRQUFRLFlBQVk7QUFDM0MsU0FBUyxNQUFNLFFBQVEsc0JBQXNCO0FBQzdDLFNBQVMsU0FBUyxRQUFRLGlCQUFpQjtBQUMzQyxTQUNFLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsWUFBWSxRQUVQLGFBQWE7QUFnQnBCLFNBQVMsTUFBTSxJQUFZLEVBQWE7SUFDdEMsTUFBTSxJQUFJLFlBQVksTUFBTTtJQUM1QixNQUFNLFdBQVcsS0FDZCxP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