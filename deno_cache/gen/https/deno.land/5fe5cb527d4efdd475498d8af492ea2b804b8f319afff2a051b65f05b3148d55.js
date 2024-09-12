// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Documentation and interface for walk were adapted from Go
// https://golang.org/pkg/path/filepath/#Walk
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
import { assert } from "../_util/asserts.ts";
import { join, normalize } from "../path/mod.ts";
import { createWalkEntry, createWalkEntrySync, toPathString } from "./_util.ts";
function include(path, exts, match, skip) {
    if (exts && !exts.some((ext)=>path.endsWith(ext))) {
        return false;
    }
    if (match && !match.some((pattern)=>!!path.match(pattern))) {
        return false;
    }
    if (skip && skip.some((pattern)=>!!path.match(pattern))) {
        return false;
    }
    return true;
}
function wrapErrorWithRootPath(err, root) {
    if (err instanceof Error && "root" in err) return err;
    const e = new Error();
    e.root = root;
    e.message = err instanceof Error ? `${err.message} for path "${root}"` : `[non-error thrown] for path "${root}"`;
    e.stack = err instanceof Error ? err.stack : undefined;
    e.cause = err instanceof Error ? err.cause : undefined;
    return e;
}
/** Walks the file tree rooted at root, yielding each file or directory in the
 * tree filtered according to the given options.
 *
 * Options:
 * - maxDepth?: number = Infinity;
 * - includeFiles?: boolean = true;
 * - includeDirs?: boolean = true;
 * - followSymlinks?: boolean = false;
 * - exts?: string[];
 * - match?: RegExp[];
 * - skip?: RegExp[];
 *
 * ```ts
 *       import { walk } from "https://deno.land/std@$STD_VERSION/fs/walk.ts";
 *       import { assert } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
 *
 *       for await (const entry of walk(".")) {
 *         console.log(entry.path);
 *         assert(entry.isFile);
 *       }
 * ```
 */ export async function* walk(root, { maxDepth =Infinity , includeFiles =true , includeDirs =true , followSymlinks =false , exts =undefined , match =undefined , skip =undefined  } = {}) {
    if (maxDepth < 0) {
        return;
    }
    root = toPathString(root);
    if (includeDirs && include(root, exts, match, skip)) {
        yield await createWalkEntry(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    try {
        for await (const entry of Deno.readDir(root)){
            assert(entry.name != null);
            let path = join(root, entry.name);
            let { isSymlink , isDirectory  } = entry;
            if (isSymlink) {
                if (!followSymlinks) continue;
                path = await Deno.realPath(path);
                // Caveat emptor: don't assume |path| is not a symlink. realpath()
                // resolves symlinks but another process can replace the file system
                // entity with a different type of entity before we call lstat().
                ({ isSymlink , isDirectory  } = await Deno.lstat(path));
            }
            if (isSymlink || isDirectory) {
                yield* walk(path, {
                    maxDepth: maxDepth - 1,
                    includeFiles,
                    includeDirs,
                    followSymlinks,
                    exts,
                    match,
                    skip
                });
            } else if (includeFiles && include(path, exts, match, skip)) {
                yield {
                    path,
                    ...entry
                };
            }
        }
    } catch (err) {
        throw wrapErrorWithRootPath(err, normalize(root));
    }
}
/** Same as walk() but uses synchronous ops */ export function* walkSync(root, { maxDepth =Infinity , includeFiles =true , includeDirs =true , followSymlinks =false , exts =undefined , match =undefined , skip =undefined  } = {}) {
    root = toPathString(root);
    if (maxDepth < 0) {
        return;
    }
    if (includeDirs && include(root, exts, match, skip)) {
        yield createWalkEntrySync(root);
    }
    if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
        return;
    }
    let entries;
    try {
        entries = Deno.readDirSync(root);
    } catch (err) {
        throw wrapErrorWithRootPath(err, normalize(root));
    }
    for (const entry of entries){
        assert(entry.name != null);
        let path = join(root, entry.name);
        let { isSymlink , isDirectory  } = entry;
        if (isSymlink) {
            if (!followSymlinks) continue;
            path = Deno.realPathSync(path);
            // Caveat emptor: don't assume |path| is not a symlink. realpath()
            // resolves symlinks but another process can replace the file system
            // entity with a different type of entity before we call lstat().
            ({ isSymlink , isDirectory  } = Deno.lstatSync(path));
        }
        if (isSymlink || isDirectory) {
            yield* walkSync(path, {
                maxDepth: maxDepth - 1,
                includeFiles,
                includeDirs,
                followSymlinks,
                exts,
                match,
                skip
            });
        } else if (includeFiles && include(path, exts, match, skip)) {
            yield {
                path,
                ...entry
            };
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL3dhbGsudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIERvY3VtZW50YXRpb24gYW5kIGludGVyZmFjZSBmb3Igd2FsayB3ZXJlIGFkYXB0ZWQgZnJvbSBHb1xuLy8gaHR0cHM6Ly9nb2xhbmcub3JnL3BrZy9wYXRoL2ZpbGVwYXRoLyNXYWxrXG4vLyBDb3B5cmlnaHQgMjAwOSBUaGUgR28gQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gQlNEIGxpY2Vuc2UuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiLi4vX3V0aWwvYXNzZXJ0cy50c1wiO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplIH0gZnJvbSBcIi4uL3BhdGgvbW9kLnRzXCI7XG5pbXBvcnQge1xuICBjcmVhdGVXYWxrRW50cnksXG4gIGNyZWF0ZVdhbGtFbnRyeVN5bmMsXG4gIHRvUGF0aFN0cmluZyxcbiAgV2Fsa0VudHJ5LFxufSBmcm9tIFwiLi9fdXRpbC50c1wiO1xuXG5mdW5jdGlvbiBpbmNsdWRlKFxuICBwYXRoOiBzdHJpbmcsXG4gIGV4dHM/OiBzdHJpbmdbXSxcbiAgbWF0Y2g/OiBSZWdFeHBbXSxcbiAgc2tpcD86IFJlZ0V4cFtdLFxuKTogYm9vbGVhbiB7XG4gIGlmIChleHRzICYmICFleHRzLnNvbWUoKGV4dCk6IGJvb2xlYW4gPT4gcGF0aC5lbmRzV2l0aChleHQpKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAobWF0Y2ggJiYgIW1hdGNoLnNvbWUoKHBhdHRlcm4pOiBib29sZWFuID0+ICEhcGF0aC5tYXRjaChwYXR0ZXJuKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHNraXAgJiYgc2tpcC5zb21lKChwYXR0ZXJuKTogYm9vbGVhbiA9PiAhIXBhdGgubWF0Y2gocGF0dGVybikpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB3cmFwRXJyb3JXaXRoUm9vdFBhdGgoZXJyOiB1bmtub3duLCByb290OiBzdHJpbmcpIHtcbiAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yICYmIFwicm9vdFwiIGluIGVycikgcmV0dXJuIGVycjtcbiAgY29uc3QgZSA9IG5ldyBFcnJvcigpIGFzIEVycm9yICYgeyByb290OiBzdHJpbmcgfTtcbiAgZS5yb290ID0gcm9vdDtcbiAgZS5tZXNzYWdlID0gZXJyIGluc3RhbmNlb2YgRXJyb3JcbiAgICA/IGAke2Vyci5tZXNzYWdlfSBmb3IgcGF0aCBcIiR7cm9vdH1cImBcbiAgICA6IGBbbm9uLWVycm9yIHRocm93bl0gZm9yIHBhdGggXCIke3Jvb3R9XCJgO1xuICBlLnN0YWNrID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIuc3RhY2sgOiB1bmRlZmluZWQ7XG4gIGUuY2F1c2UgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5jYXVzZSA6IHVuZGVmaW5lZDtcbiAgcmV0dXJuIGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2Fsa09wdGlvbnMge1xuICBtYXhEZXB0aD86IG51bWJlcjtcbiAgaW5jbHVkZUZpbGVzPzogYm9vbGVhbjtcbiAgaW5jbHVkZURpcnM/OiBib29sZWFuO1xuICBmb2xsb3dTeW1saW5rcz86IGJvb2xlYW47XG4gIGV4dHM/OiBzdHJpbmdbXTtcbiAgbWF0Y2g/OiBSZWdFeHBbXTtcbiAgc2tpcD86IFJlZ0V4cFtdO1xufVxuZXhwb3J0IHR5cGUgeyBXYWxrRW50cnkgfTtcblxuLyoqIFdhbGtzIHRoZSBmaWxlIHRyZWUgcm9vdGVkIGF0IHJvb3QsIHlpZWxkaW5nIGVhY2ggZmlsZSBvciBkaXJlY3RvcnkgaW4gdGhlXG4gKiB0cmVlIGZpbHRlcmVkIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAqXG4gKiBPcHRpb25zOlxuICogLSBtYXhEZXB0aD86IG51bWJlciA9IEluZmluaXR5O1xuICogLSBpbmNsdWRlRmlsZXM/OiBib29sZWFuID0gdHJ1ZTtcbiAqIC0gaW5jbHVkZURpcnM/OiBib29sZWFuID0gdHJ1ZTtcbiAqIC0gZm9sbG93U3ltbGlua3M/OiBib29sZWFuID0gZmFsc2U7XG4gKiAtIGV4dHM/OiBzdHJpbmdbXTtcbiAqIC0gbWF0Y2g/OiBSZWdFeHBbXTtcbiAqIC0gc2tpcD86IFJlZ0V4cFtdO1xuICpcbiAqIGBgYHRzXG4gKiAgICAgICBpbXBvcnQgeyB3YWxrIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vZnMvd2Fsay50c1wiO1xuICogICAgICAgaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAkU1REX1ZFUlNJT04vdGVzdGluZy9hc3NlcnRzLnRzXCI7XG4gKlxuICogICAgICAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiB3YWxrKFwiLlwiKSkge1xuICogICAgICAgICBjb25zb2xlLmxvZyhlbnRyeS5wYXRoKTtcbiAqICAgICAgICAgYXNzZXJ0KGVudHJ5LmlzRmlsZSk7XG4gKiAgICAgICB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uKiB3YWxrKFxuICByb290OiBzdHJpbmcgfCBVUkwsXG4gIHtcbiAgICBtYXhEZXB0aCA9IEluZmluaXR5LFxuICAgIGluY2x1ZGVGaWxlcyA9IHRydWUsXG4gICAgaW5jbHVkZURpcnMgPSB0cnVlLFxuICAgIGZvbGxvd1N5bWxpbmtzID0gZmFsc2UsXG4gICAgZXh0cyA9IHVuZGVmaW5lZCxcbiAgICBtYXRjaCA9IHVuZGVmaW5lZCxcbiAgICBza2lwID0gdW5kZWZpbmVkLFxuICB9OiBXYWxrT3B0aW9ucyA9IHt9LFxuKTogQXN5bmNJdGVyYWJsZUl0ZXJhdG9yPFdhbGtFbnRyeT4ge1xuICBpZiAobWF4RGVwdGggPCAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJvb3QgPSB0b1BhdGhTdHJpbmcocm9vdCk7XG4gIGlmIChpbmNsdWRlRGlycyAmJiBpbmNsdWRlKHJvb3QsIGV4dHMsIG1hdGNoLCBza2lwKSkge1xuICAgIHlpZWxkIGF3YWl0IGNyZWF0ZVdhbGtFbnRyeShyb290KTtcbiAgfVxuICBpZiAobWF4RGVwdGggPCAxIHx8ICFpbmNsdWRlKHJvb3QsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBza2lwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGZvciBhd2FpdCAoY29uc3QgZW50cnkgb2YgRGVuby5yZWFkRGlyKHJvb3QpKSB7XG4gICAgICBhc3NlcnQoZW50cnkubmFtZSAhPSBudWxsKTtcbiAgICAgIGxldCBwYXRoID0gam9pbihyb290LCBlbnRyeS5uYW1lKTtcblxuICAgICAgbGV0IHsgaXNTeW1saW5rLCBpc0RpcmVjdG9yeSB9ID0gZW50cnk7XG5cbiAgICAgIGlmIChpc1N5bWxpbmspIHtcbiAgICAgICAgaWYgKCFmb2xsb3dTeW1saW5rcykgY29udGludWU7XG4gICAgICAgIHBhdGggPSBhd2FpdCBEZW5vLnJlYWxQYXRoKHBhdGgpO1xuICAgICAgICAvLyBDYXZlYXQgZW1wdG9yOiBkb24ndCBhc3N1bWUgfHBhdGh8IGlzIG5vdCBhIHN5bWxpbmsuIHJlYWxwYXRoKClcbiAgICAgICAgLy8gcmVzb2x2ZXMgc3ltbGlua3MgYnV0IGFub3RoZXIgcHJvY2VzcyBjYW4gcmVwbGFjZSB0aGUgZmlsZSBzeXN0ZW1cbiAgICAgICAgLy8gZW50aXR5IHdpdGggYSBkaWZmZXJlbnQgdHlwZSBvZiBlbnRpdHkgYmVmb3JlIHdlIGNhbGwgbHN0YXQoKS5cbiAgICAgICAgKHsgaXNTeW1saW5rLCBpc0RpcmVjdG9yeSB9ID0gYXdhaXQgRGVuby5sc3RhdChwYXRoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1N5bWxpbmsgfHwgaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgeWllbGQqIHdhbGsocGF0aCwge1xuICAgICAgICAgIG1heERlcHRoOiBtYXhEZXB0aCAtIDEsXG4gICAgICAgICAgaW5jbHVkZUZpbGVzLFxuICAgICAgICAgIGluY2x1ZGVEaXJzLFxuICAgICAgICAgIGZvbGxvd1N5bWxpbmtzLFxuICAgICAgICAgIGV4dHMsXG4gICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgc2tpcCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGluY2x1ZGVGaWxlcyAmJiBpbmNsdWRlKHBhdGgsIGV4dHMsIG1hdGNoLCBza2lwKSkge1xuICAgICAgICB5aWVsZCB7IHBhdGgsIC4uLmVudHJ5IH07XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyB3cmFwRXJyb3JXaXRoUm9vdFBhdGgoZXJyLCBub3JtYWxpemUocm9vdCkpO1xuICB9XG59XG5cbi8qKiBTYW1lIGFzIHdhbGsoKSBidXQgdXNlcyBzeW5jaHJvbm91cyBvcHMgKi9cbmV4cG9ydCBmdW5jdGlvbiogd2Fsa1N5bmMoXG4gIHJvb3Q6IHN0cmluZyB8IFVSTCxcbiAge1xuICAgIG1heERlcHRoID0gSW5maW5pdHksXG4gICAgaW5jbHVkZUZpbGVzID0gdHJ1ZSxcbiAgICBpbmNsdWRlRGlycyA9IHRydWUsXG4gICAgZm9sbG93U3ltbGlua3MgPSBmYWxzZSxcbiAgICBleHRzID0gdW5kZWZpbmVkLFxuICAgIG1hdGNoID0gdW5kZWZpbmVkLFxuICAgIHNraXAgPSB1bmRlZmluZWQsXG4gIH06IFdhbGtPcHRpb25zID0ge30sXG4pOiBJdGVyYWJsZUl0ZXJhdG9yPFdhbGtFbnRyeT4ge1xuICByb290ID0gdG9QYXRoU3RyaW5nKHJvb3QpO1xuICBpZiAobWF4RGVwdGggPCAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChpbmNsdWRlRGlycyAmJiBpbmNsdWRlKHJvb3QsIGV4dHMsIG1hdGNoLCBza2lwKSkge1xuICAgIHlpZWxkIGNyZWF0ZVdhbGtFbnRyeVN5bmMocm9vdCk7XG4gIH1cbiAgaWYgKG1heERlcHRoIDwgMSB8fCAhaW5jbHVkZShyb290LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgc2tpcCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGVudHJpZXM7XG4gIHRyeSB7XG4gICAgZW50cmllcyA9IERlbm8ucmVhZERpclN5bmMocm9vdCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IHdyYXBFcnJvcldpdGhSb290UGF0aChlcnIsIG5vcm1hbGl6ZShyb290KSk7XG4gIH1cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgYXNzZXJ0KGVudHJ5Lm5hbWUgIT0gbnVsbCk7XG4gICAgbGV0IHBhdGggPSBqb2luKHJvb3QsIGVudHJ5Lm5hbWUpO1xuXG4gICAgbGV0IHsgaXNTeW1saW5rLCBpc0RpcmVjdG9yeSB9ID0gZW50cnk7XG5cbiAgICBpZiAoaXNTeW1saW5rKSB7XG4gICAgICBpZiAoIWZvbGxvd1N5bWxpbmtzKSBjb250aW51ZTtcbiAgICAgIHBhdGggPSBEZW5vLnJlYWxQYXRoU3luYyhwYXRoKTtcbiAgICAgIC8vIENhdmVhdCBlbXB0b3I6IGRvbid0IGFzc3VtZSB8cGF0aHwgaXMgbm90IGEgc3ltbGluay4gcmVhbHBhdGgoKVxuICAgICAgLy8gcmVzb2x2ZXMgc3ltbGlua3MgYnV0IGFub3RoZXIgcHJvY2VzcyBjYW4gcmVwbGFjZSB0aGUgZmlsZSBzeXN0ZW1cbiAgICAgIC8vIGVudGl0eSB3aXRoIGEgZGlmZmVyZW50IHR5cGUgb2YgZW50aXR5IGJlZm9yZSB3ZSBjYWxsIGxzdGF0KCkuXG4gICAgICAoeyBpc1N5bWxpbmssIGlzRGlyZWN0b3J5IH0gPSBEZW5vLmxzdGF0U3luYyhwYXRoKSk7XG4gICAgfVxuXG4gICAgaWYgKGlzU3ltbGluayB8fCBpc0RpcmVjdG9yeSkge1xuICAgICAgeWllbGQqIHdhbGtTeW5jKHBhdGgsIHtcbiAgICAgICAgbWF4RGVwdGg6IG1heERlcHRoIC0gMSxcbiAgICAgICAgaW5jbHVkZUZpbGVzLFxuICAgICAgICBpbmNsdWRlRGlycyxcbiAgICAgICAgZm9sbG93U3ltbGlua3MsXG4gICAgICAgIGV4dHMsXG4gICAgICAgIG1hdGNoLFxuICAgICAgICBza2lwLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpbmNsdWRlRmlsZXMgJiYgaW5jbHVkZShwYXRoLCBleHRzLCBtYXRjaCwgc2tpcCkpIHtcbiAgICAgIHlpZWxkIHsgcGF0aCwgLi4uZW50cnkgfTtcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsNERBQTREO0FBQzVELDZDQUE2QztBQUM3QyxtRUFBbUU7QUFDbkUsU0FBUyxNQUFNLFFBQVEsc0JBQXNCO0FBQzdDLFNBQVMsSUFBSSxFQUFFLFNBQVMsUUFBUSxpQkFBaUI7QUFDakQsU0FDRSxlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLFlBQVksUUFFUCxhQUFhO0FBRXBCLFNBQVMsUUFDUCxJQUFZLEVBQ1osSUFBZSxFQUNmLEtBQWdCLEVBQ2hCLElBQWUsRUFDTjtJQUNULElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsTUFBaUIsS0FBSyxRQUFRLENBQUMsT0FBTztRQUM1RCxPQUFPLEtBQUs7SUFDZCxDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFxQixDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsV0FBVztRQUNyRSxPQUFPLEtBQUs7SUFDZCxDQUFDO0lBQ0QsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsVUFBcUIsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLFdBQVc7UUFDbEUsT0FBTyxLQUFLO0lBQ2QsQ0FBQztJQUNELE9BQU8sSUFBSTtBQUNiO0FBRUEsU0FBUyxzQkFBc0IsR0FBWSxFQUFFLElBQVksRUFBRTtJQUN6RCxJQUFJLGVBQWUsU0FBUyxVQUFVLEtBQUssT0FBTztJQUNsRCxNQUFNLElBQUksSUFBSTtJQUNkLEVBQUUsSUFBSSxHQUFHO0lBQ1QsRUFBRSxPQUFP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