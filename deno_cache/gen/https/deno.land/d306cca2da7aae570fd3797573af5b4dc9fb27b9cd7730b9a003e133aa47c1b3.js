// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// @ts-nocheck Bypass static errors for missing --unstable.
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { getFileInfoType, isSubdir, toPathString } from "./_util.ts";
import { assert } from "../_util/asserts.ts";
import { isWindows } from "../_util/os.ts";
async function ensureValidCopy(src, dest, options) {
    let destStat;
    try {
        destStat = await Deno.lstat(dest);
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return;
        }
        throw err;
    }
    if (options.isFolder && !destStat.isDirectory) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!options.overwrite) {
        throw new Deno.errors.AlreadyExists(`'${dest}' already exists.`);
    }
    return destStat;
}
function ensureValidCopySync(src, dest, options) {
    let destStat;
    try {
        destStat = Deno.lstatSync(dest);
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return;
        }
        throw err;
    }
    if (options.isFolder && !destStat.isDirectory) {
        throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!options.overwrite) {
        throw new Deno.errors.AlreadyExists(`'${dest}' already exists.`);
    }
    return destStat;
}
/* copy file to dest */ async function copyFile(src, dest, options) {
    await ensureValidCopy(src, dest, options);
    await Deno.copyFile(src, dest);
    if (options.preserveTimestamps) {
        const statInfo = await Deno.stat(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        await Deno.utime(dest, statInfo.atime, statInfo.mtime);
    }
}
/* copy file to dest synchronously */ function copyFileSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    Deno.copyFileSync(src, dest);
    if (options.preserveTimestamps) {
        const statInfo = Deno.statSync(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
    }
}
/* copy symlink to dest */ async function copySymLink(src, dest, options) {
    await ensureValidCopy(src, dest, options);
    const originSrcFilePath = await Deno.readLink(src);
    const type = getFileInfoType(await Deno.lstat(src));
    if (isWindows) {
        await Deno.symlink(originSrcFilePath, dest, {
            type: type === "dir" ? "dir" : "file"
        });
    } else {
        await Deno.symlink(originSrcFilePath, dest);
    }
    if (options.preserveTimestamps) {
        const statInfo = await Deno.lstat(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        await Deno.utime(dest, statInfo.atime, statInfo.mtime);
    }
}
/* copy symlink to dest synchronously */ function copySymlinkSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    const originSrcFilePath = Deno.readLinkSync(src);
    const type = getFileInfoType(Deno.lstatSync(src));
    if (isWindows) {
        Deno.symlinkSync(originSrcFilePath, dest, {
            type: type === "dir" ? "dir" : "file"
        });
    } else {
        Deno.symlinkSync(originSrcFilePath, dest);
    }
    if (options.preserveTimestamps) {
        const statInfo = Deno.lstatSync(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        Deno.utimeSync(dest, statInfo.atime, statInfo.mtime);
    }
}
/* copy folder from src to dest. */ async function copyDir(src, dest, options) {
    const destStat = await ensureValidCopy(src, dest, {
        ...options,
        isFolder: true
    });
    if (!destStat) {
        await ensureDir(dest);
    }
    if (options.preserveTimestamps) {
        const srcStatInfo = await Deno.stat(src);
        assert(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        await Deno.utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
    }
    src = toPathString(src);
    dest = toPathString(dest);
    for await (const entry of Deno.readDir(src)){
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, path.basename(srcPath));
        if (entry.isSymlink) {
            await copySymLink(srcPath, destPath, options);
        } else if (entry.isDirectory) {
            await copyDir(srcPath, destPath, options);
        } else if (entry.isFile) {
            await copyFile(srcPath, destPath, options);
        }
    }
}
/* copy folder from src to dest synchronously */ function copyDirSync(src, dest, options) {
    const destStat = ensureValidCopySync(src, dest, {
        ...options,
        isFolder: true
    });
    if (!destStat) {
        ensureDirSync(dest);
    }
    if (options.preserveTimestamps) {
        const srcStatInfo = Deno.statSync(src);
        assert(srcStatInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(srcStatInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        Deno.utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
    }
    src = toPathString(src);
    dest = toPathString(dest);
    for (const entry of Deno.readDirSync(src)){
        assert(entry.name != null, "file.name must be set");
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, path.basename(srcPath));
        if (entry.isSymlink) {
            copySymlinkSync(srcPath, destPath, options);
        } else if (entry.isDirectory) {
            copyDirSync(srcPath, destPath, options);
        } else if (entry.isFile) {
            copyFileSync(srcPath, destPath, options);
        }
    }
}
/**
 * Copy a file or directory. The directory can have contents. Like `cp -r`.
 * Requires the `--allow-read` and `--allow-write` flag.
 * @param src the file/directory path.
 *            Note that if `src` is a directory it will copy everything inside
 *            of this directory, not the entire directory itself
 * @param dest the destination path. Note that if `src` is a file, `dest` cannot
 *             be a directory
 * @param options
 */ export async function copy(src, dest, options = {}) {
    src = path.resolve(toPathString(src));
    dest = path.resolve(toPathString(dest));
    if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
    }
    const srcStat = await Deno.lstat(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (srcStat.isSymlink) {
        await copySymLink(src, dest, options);
    } else if (srcStat.isDirectory) {
        await copyDir(src, dest, options);
    } else if (srcStat.isFile) {
        await copyFile(src, dest, options);
    }
}
/**
 * Copy a file or directory. The directory can have contents. Like `cp -r`.
 * Requires the `--allow-read` and `--allow-write` flag.
 * @param src the file/directory path.
 *            Note that if `src` is a directory it will copy everything inside
 *            of this directory, not the entire directory itself
 * @param dest the destination path. Note that if `src` is a file, `dest` cannot
 *             be a directory
 * @param options
 */ export function copySync(src, dest, options = {}) {
    src = path.resolve(toPathString(src));
    dest = path.resolve(toPathString(dest));
    if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
    }
    const srcStat = Deno.lstatSync(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (srcStat.isSymlink) {
        copySymlinkSync(src, dest, options);
    } else if (srcStat.isDirectory) {
        copyDirSync(src, dest, options);
    } else if (srcStat.isFile) {
        copyFileSync(src, dest, options);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL2NvcHkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbi8vIEB0cy1ub2NoZWNrIEJ5cGFzcyBzdGF0aWMgZXJyb3JzIGZvciBtaXNzaW5nIC0tdW5zdGFibGUuXG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcIi4uL3BhdGgvbW9kLnRzXCI7XG5pbXBvcnQgeyBlbnN1cmVEaXIsIGVuc3VyZURpclN5bmMgfSBmcm9tIFwiLi9lbnN1cmVfZGlyLnRzXCI7XG5pbXBvcnQgeyBnZXRGaWxlSW5mb1R5cGUsIGlzU3ViZGlyLCB0b1BhdGhTdHJpbmcgfSBmcm9tIFwiLi9fdXRpbC50c1wiO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4uL191dGlsL2Fzc2VydHMudHNcIjtcbmltcG9ydCB7IGlzV2luZG93cyB9IGZyb20gXCIuLi9fdXRpbC9vcy50c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIG92ZXJ3cml0ZSBleGlzdGluZyBmaWxlIG9yIGRpcmVjdG9yeS4gRGVmYXVsdCBpcyBgZmFsc2VgXG4gICAqL1xuICBvdmVyd3JpdGU/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hlbiBgdHJ1ZWAsIHdpbGwgc2V0IGxhc3QgbW9kaWZpY2F0aW9uIGFuZCBhY2Nlc3MgdGltZXMgdG8gdGhlIG9uZXMgb2YgdGhlXG4gICAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAgICogV2hlbiBgZmFsc2VgLCB0aW1lc3RhbXAgYmVoYXZpb3IgaXMgT1MtZGVwZW5kZW50LlxuICAgKiBEZWZhdWx0IGlzIGBmYWxzZWAuXG4gICAqL1xuICBwcmVzZXJ2ZVRpbWVzdGFtcHM/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgSW50ZXJuYWxDb3B5T3B0aW9ucyBleHRlbmRzIENvcHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIGRlZmF1bHQgaXMgYGZhbHNlYFxuICAgKi9cbiAgaXNGb2xkZXI/OiBib29sZWFuO1xufVxuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVWYWxpZENvcHkoXG4gIHNyYzogc3RyaW5nIHwgVVJMLFxuICBkZXN0OiBzdHJpbmcgfCBVUkwsXG4gIG9wdGlvbnM6IEludGVybmFsQ29weU9wdGlvbnMsXG4pOiBQcm9taXNlPERlbm8uRmlsZUluZm8gfCB1bmRlZmluZWQ+IHtcbiAgbGV0IGRlc3RTdGF0OiBEZW5vLkZpbGVJbmZvO1xuXG4gIHRyeSB7XG4gICAgZGVzdFN0YXQgPSBhd2FpdCBEZW5vLmxzdGF0KGRlc3QpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuTm90Rm91bmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaXNGb2xkZXIgJiYgIWRlc3RTdGF0LmlzRGlyZWN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYCxcbiAgICApO1xuICB9XG4gIGlmICghb3B0aW9ucy5vdmVyd3JpdGUpIHtcbiAgICB0aHJvdyBuZXcgRGVuby5lcnJvcnMuQWxyZWFkeUV4aXN0cyhgJyR7ZGVzdH0nIGFscmVhZHkgZXhpc3RzLmApO1xuICB9XG5cbiAgcmV0dXJuIGRlc3RTdGF0O1xufVxuXG5mdW5jdGlvbiBlbnN1cmVWYWxpZENvcHlTeW5jKFxuICBzcmM6IHN0cmluZyB8IFVSTCxcbiAgZGVzdDogc3RyaW5nIHwgVVJMLFxuICBvcHRpb25zOiBJbnRlcm5hbENvcHlPcHRpb25zLFxuKTogRGVuby5GaWxlSW5mbyB8IHVuZGVmaW5lZCB7XG4gIGxldCBkZXN0U3RhdDogRGVuby5GaWxlSW5mbztcbiAgdHJ5IHtcbiAgICBkZXN0U3RhdCA9IERlbm8ubHN0YXRTeW5jKGRlc3QpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuTm90Rm91bmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaXNGb2xkZXIgJiYgIWRlc3RTdGF0LmlzRGlyZWN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYCxcbiAgICApO1xuICB9XG4gIGlmICghb3B0aW9ucy5vdmVyd3JpdGUpIHtcbiAgICB0aHJvdyBuZXcgRGVuby5lcnJvcnMuQWxyZWFkeUV4aXN0cyhgJyR7ZGVzdH0nIGFscmVhZHkgZXhpc3RzLmApO1xuICB9XG5cbiAgcmV0dXJuIGRlc3RTdGF0O1xufVxuXG4vKiBjb3B5IGZpbGUgdG8gZGVzdCAqL1xuYXN5bmMgZnVuY3Rpb24gY29weUZpbGUoXG4gIHNyYzogc3RyaW5nIHwgVVJMLFxuICBkZXN0OiBzdHJpbmcgfCBVUkwsXG4gIG9wdGlvbnM6IEludGVybmFsQ29weU9wdGlvbnMsXG4pIHtcbiAgYXdhaXQgZW5zdXJlVmFsaWRDb3B5KHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIGF3YWl0IERlbm8uY29weUZpbGUoc3JjLCBkZXN0KTtcbiAgaWYgKG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzKSB7XG4gICAgY29uc3Qgc3RhdEluZm8gPSBhd2FpdCBEZW5vLnN0YXQoc3JjKTtcbiAgICBhc3NlcnQoc3RhdEluZm8uYXRpbWUgaW5zdGFuY2VvZiBEYXRlLCBgc3RhdEluZm8uYXRpbWUgaXMgdW5hdmFpbGFibGVgKTtcbiAgICBhc3NlcnQoc3RhdEluZm8ubXRpbWUgaW5zdGFuY2VvZiBEYXRlLCBgc3RhdEluZm8ubXRpbWUgaXMgdW5hdmFpbGFibGVgKTtcbiAgICBhd2FpdCBEZW5vLnV0aW1lKGRlc3QsIHN0YXRJbmZvLmF0aW1lLCBzdGF0SW5mby5tdGltZSk7XG4gIH1cbn1cbi8qIGNvcHkgZmlsZSB0byBkZXN0IHN5bmNocm9ub3VzbHkgKi9cbmZ1bmN0aW9uIGNvcHlGaWxlU3luYyhcbiAgc3JjOiBzdHJpbmcgfCBVUkwsXG4gIGRlc3Q6IHN0cmluZyB8IFVSTCxcbiAgb3B0aW9uczogSW50ZXJuYWxDb3B5T3B0aW9ucyxcbikge1xuICBlbnN1cmVWYWxpZENvcHlTeW5jKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIERlbm8uY29weUZpbGVTeW5jKHNyYywgZGVzdCk7XG4gIGlmIChvcHRpb25zLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgIGNvbnN0IHN0YXRJbmZvID0gRGVuby5zdGF0U3luYyhzcmMpO1xuICAgIGFzc2VydChzdGF0SW5mby5hdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5hdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIGFzc2VydChzdGF0SW5mby5tdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5tdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIERlbm8udXRpbWVTeW5jKGRlc3QsIHN0YXRJbmZvLmF0aW1lLCBzdGF0SW5mby5tdGltZSk7XG4gIH1cbn1cblxuLyogY29weSBzeW1saW5rIHRvIGRlc3QgKi9cbmFzeW5jIGZ1bmN0aW9uIGNvcHlTeW1MaW5rKFxuICBzcmM6IHN0cmluZyB8IFVSTCxcbiAgZGVzdDogc3RyaW5nIHwgVVJMLFxuICBvcHRpb25zOiBJbnRlcm5hbENvcHlPcHRpb25zLFxuKSB7XG4gIGF3YWl0IGVuc3VyZVZhbGlkQ29weShzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICBjb25zdCBvcmlnaW5TcmNGaWxlUGF0aCA9IGF3YWl0IERlbm8ucmVhZExpbmsoc3JjKTtcbiAgY29uc3QgdHlwZSA9IGdldEZpbGVJbmZvVHlwZShhd2FpdCBEZW5vLmxzdGF0KHNyYykpO1xuICBpZiAoaXNXaW5kb3dzKSB7XG4gICAgYXdhaXQgRGVuby5zeW1saW5rKG9yaWdpblNyY0ZpbGVQYXRoLCBkZXN0LCB7XG4gICAgICB0eXBlOiB0eXBlID09PSBcImRpclwiID8gXCJkaXJcIiA6IFwiZmlsZVwiLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IERlbm8uc3ltbGluayhvcmlnaW5TcmNGaWxlUGF0aCwgZGVzdCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzKSB7XG4gICAgY29uc3Qgc3RhdEluZm8gPSBhd2FpdCBEZW5vLmxzdGF0KHNyYyk7XG4gICAgYXNzZXJ0KHN0YXRJbmZvLmF0aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLmF0aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXNzZXJ0KHN0YXRJbmZvLm10aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLm10aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXdhaXQgRGVuby51dGltZShkZXN0LCBzdGF0SW5mby5hdGltZSwgc3RhdEluZm8ubXRpbWUpO1xuICB9XG59XG5cbi8qIGNvcHkgc3ltbGluayB0byBkZXN0IHN5bmNocm9ub3VzbHkgKi9cbmZ1bmN0aW9uIGNvcHlTeW1saW5rU3luYyhcbiAgc3JjOiBzdHJpbmcgfCBVUkwsXG4gIGRlc3Q6IHN0cmluZyB8IFVSTCxcbiAgb3B0aW9uczogSW50ZXJuYWxDb3B5T3B0aW9ucyxcbikge1xuICBlbnN1cmVWYWxpZENvcHlTeW5jKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIGNvbnN0IG9yaWdpblNyY0ZpbGVQYXRoID0gRGVuby5yZWFkTGlua1N5bmMoc3JjKTtcbiAgY29uc3QgdHlwZSA9IGdldEZpbGVJbmZvVHlwZShEZW5vLmxzdGF0U3luYyhzcmMpKTtcbiAgaWYgKGlzV2luZG93cykge1xuICAgIERlbm8uc3ltbGlua1N5bmMob3JpZ2luU3JjRmlsZVBhdGgsIGRlc3QsIHtcbiAgICAgIHR5cGU6IHR5cGUgPT09IFwiZGlyXCIgPyBcImRpclwiIDogXCJmaWxlXCIsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgRGVuby5zeW1saW5rU3luYyhvcmlnaW5TcmNGaWxlUGF0aCwgZGVzdCk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5wcmVzZXJ2ZVRpbWVzdGFtcHMpIHtcbiAgICBjb25zdCBzdGF0SW5mbyA9IERlbm8ubHN0YXRTeW5jKHNyYyk7XG4gICAgYXNzZXJ0KHN0YXRJbmZvLmF0aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLmF0aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXNzZXJ0KHN0YXRJbmZvLm10aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLm10aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgRGVuby51dGltZVN5bmMoZGVzdCwgc3RhdEluZm8uYXRpbWUsIHN0YXRJbmZvLm10aW1lKTtcbiAgfVxufVxuXG4vKiBjb3B5IGZvbGRlciBmcm9tIHNyYyB0byBkZXN0LiAqL1xuYXN5bmMgZnVuY3Rpb24gY29weURpcihcbiAgc3JjOiBzdHJpbmcgfCBVUkwsXG4gIGRlc3Q6IHN0cmluZyB8IFVSTCxcbiAgb3B0aW9uczogQ29weU9wdGlvbnMsXG4pIHtcbiAgY29uc3QgZGVzdFN0YXQgPSBhd2FpdCBlbnN1cmVWYWxpZENvcHkoc3JjLCBkZXN0LCB7XG4gICAgLi4ub3B0aW9ucyxcbiAgICBpc0ZvbGRlcjogdHJ1ZSxcbiAgfSk7XG5cbiAgaWYgKCFkZXN0U3RhdCkge1xuICAgIGF3YWl0IGVuc3VyZURpcihkZXN0KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgIGNvbnN0IHNyY1N0YXRJbmZvID0gYXdhaXQgRGVuby5zdGF0KHNyYyk7XG4gICAgYXNzZXJ0KHNyY1N0YXRJbmZvLmF0aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLmF0aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXNzZXJ0KHNyY1N0YXRJbmZvLm10aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLm10aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXdhaXQgRGVuby51dGltZShkZXN0LCBzcmNTdGF0SW5mby5hdGltZSwgc3JjU3RhdEluZm8ubXRpbWUpO1xuICB9XG5cbiAgc3JjID0gdG9QYXRoU3RyaW5nKHNyYyk7XG4gIGRlc3QgPSB0b1BhdGhTdHJpbmcoZGVzdCk7XG5cbiAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBEZW5vLnJlYWREaXIoc3JjKSkge1xuICAgIGNvbnN0IHNyY1BhdGggPSBwYXRoLmpvaW4oc3JjLCBlbnRyeS5uYW1lKTtcbiAgICBjb25zdCBkZXN0UGF0aCA9IHBhdGguam9pbihkZXN0LCBwYXRoLmJhc2VuYW1lKHNyY1BhdGggYXMgc3RyaW5nKSk7XG4gICAgaWYgKGVudHJ5LmlzU3ltbGluaykge1xuICAgICAgYXdhaXQgY29weVN5bUxpbmsoc3JjUGF0aCwgZGVzdFBhdGgsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgIGF3YWl0IGNvcHlEaXIoc3JjUGF0aCwgZGVzdFBhdGgsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICBhd2FpdCBjb3B5RmlsZShzcmNQYXRoLCBkZXN0UGF0aCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbi8qIGNvcHkgZm9sZGVyIGZyb20gc3JjIHRvIGRlc3Qgc3luY2hyb25vdXNseSAqL1xuZnVuY3Rpb24gY29weURpclN5bmMoXG4gIHNyYzogc3RyaW5nIHwgVVJMLFxuICBkZXN0OiBzdHJpbmcgfCBVUkwsXG4gIG9wdGlvbnM6IENvcHlPcHRpb25zLFxuKSB7XG4gIGNvbnN0IGRlc3RTdGF0ID0gZW5zdXJlVmFsaWRDb3B5U3luYyhzcmMsIGRlc3QsIHtcbiAgICAuLi5vcHRpb25zLFxuICAgIGlzRm9sZGVyOiB0cnVlLFxuICB9KTtcblxuICBpZiAoIWRlc3RTdGF0KSB7XG4gICAgZW5zdXJlRGlyU3luYyhkZXN0KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgIGNvbnN0IHNyY1N0YXRJbmZvID0gRGVuby5zdGF0U3luYyhzcmMpO1xuICAgIGFzc2VydChzcmNTdGF0SW5mby5hdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5hdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIGFzc2VydChzcmNTdGF0SW5mby5tdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5tdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIERlbm8udXRpbWVTeW5jKGRlc3QsIHNyY1N0YXRJbmZvLmF0aW1lLCBzcmNTdGF0SW5mby5tdGltZSk7XG4gIH1cblxuICBzcmMgPSB0b1BhdGhTdHJpbmcoc3JjKTtcbiAgZGVzdCA9IHRvUGF0aFN0cmluZyhkZXN0KTtcblxuICBmb3IgKGNvbnN0IGVudHJ5IG9mIERlbm8ucmVhZERpclN5bmMoc3JjKSkge1xuICAgIGFzc2VydChlbnRyeS5uYW1lICE9IG51bGwsIFwiZmlsZS5uYW1lIG11c3QgYmUgc2V0XCIpO1xuICAgIGNvbnN0IHNyY1BhdGggPSBwYXRoLmpvaW4oc3JjLCBlbnRyeS5uYW1lKTtcbiAgICBjb25zdCBkZXN0UGF0aCA9IHBhdGguam9pbihkZXN0LCBwYXRoLmJhc2VuYW1lKHNyY1BhdGggYXMgc3RyaW5nKSk7XG4gICAgaWYgKGVudHJ5LmlzU3ltbGluaykge1xuICAgICAgY29weVN5bWxpbmtTeW5jKHNyY1BhdGgsIGRlc3RQYXRoLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG4gICAgICBjb3B5RGlyU3luYyhzcmNQYXRoLCBkZXN0UGF0aCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChlbnRyeS5pc0ZpbGUpIHtcbiAgICAgIGNvcHlGaWxlU3luYyhzcmNQYXRoLCBkZXN0UGF0aCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29weSBhIGZpbGUgb3IgZGlyZWN0b3J5LiBUaGUgZGlyZWN0b3J5IGNhbiBoYXZlIGNvbnRlbnRzLiBMaWtlIGBjcCAtcmAuXG4gKiBSZXF1aXJlcyB0aGUgYC0tYWxsb3ctcmVhZGAgYW5kIGAtLWFsbG93LXdyaXRlYCBmbGFnLlxuICogQHBhcmFtIHNyYyB0aGUgZmlsZS9kaXJlY3RvcnkgcGF0aC5cbiAqICAgICAgICAgICAgTm90ZSB0aGF0IGlmIGBzcmNgIGlzIGEgZGlyZWN0b3J5IGl0IHdpbGwgY29weSBldmVyeXRoaW5nIGluc2lkZVxuICogICAgICAgICAgICBvZiB0aGlzIGRpcmVjdG9yeSwgbm90IHRoZSBlbnRpcmUgZGlyZWN0b3J5IGl0c2VsZlxuICogQHBhcmFtIGRlc3QgdGhlIGRlc3RpbmF0aW9uIHBhdGguIE5vdGUgdGhhdCBpZiBgc3JjYCBpcyBhIGZpbGUsIGBkZXN0YCBjYW5ub3RcbiAqICAgICAgICAgICAgIGJlIGEgZGlyZWN0b3J5XG4gKiBAcGFyYW0gb3B0aW9uc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29weShcbiAgc3JjOiBzdHJpbmcgfCBVUkwsXG4gIGRlc3Q6IHN0cmluZyB8IFVSTCxcbiAgb3B0aW9uczogQ29weU9wdGlvbnMgPSB7fSxcbikge1xuICBzcmMgPSBwYXRoLnJlc29sdmUodG9QYXRoU3RyaW5nKHNyYykpO1xuICBkZXN0ID0gcGF0aC5yZXNvbHZlKHRvUGF0aFN0cmluZyhkZXN0KSk7XG5cbiAgaWYgKHNyYyA9PT0gZGVzdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlNvdXJjZSBhbmQgZGVzdGluYXRpb24gY2Fubm90IGJlIHRoZSBzYW1lLlwiKTtcbiAgfVxuXG4gIGNvbnN0IHNyY1N0YXQgPSBhd2FpdCBEZW5vLmxzdGF0KHNyYyk7XG5cbiAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkgJiYgaXNTdWJkaXIoc3JjLCBkZXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBDYW5ub3QgY29weSAnJHtzcmN9JyB0byBhIHN1YmRpcmVjdG9yeSBvZiBpdHNlbGYsICcke2Rlc3R9Jy5gLFxuICAgICk7XG4gIH1cblxuICBpZiAoc3JjU3RhdC5pc1N5bWxpbmspIHtcbiAgICBhd2FpdCBjb3B5U3ltTGluayhzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkpIHtcbiAgICBhd2FpdCBjb3B5RGlyKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAoc3JjU3RhdC5pc0ZpbGUpIHtcbiAgICBhd2FpdCBjb3B5RmlsZShzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICB9XG59XG5cbi8qKlxuICogQ29weSBhIGZpbGUgb3IgZGlyZWN0b3J5LiBUaGUgZGlyZWN0b3J5IGNhbiBoYXZlIGNvbnRlbnRzLiBMaWtlIGBjcCAtcmAuXG4gKiBSZXF1aXJlcyB0aGUgYC0tYWxsb3ctcmVhZGAgYW5kIGAtLWFsbG93LXdyaXRlYCBmbGFnLlxuICogQHBhcmFtIHNyYyB0aGUgZmlsZS9kaXJlY3RvcnkgcGF0aC5cbiAqICAgICAgICAgICAgTm90ZSB0aGF0IGlmIGBzcmNgIGlzIGEgZGlyZWN0b3J5IGl0IHdpbGwgY29weSBldmVyeXRoaW5nIGluc2lkZVxuICogICAgICAgICAgICBvZiB0aGlzIGRpcmVjdG9yeSwgbm90IHRoZSBlbnRpcmUgZGlyZWN0b3J5IGl0c2VsZlxuICogQHBhcmFtIGRlc3QgdGhlIGRlc3RpbmF0aW9uIHBhdGguIE5vdGUgdGhhdCBpZiBgc3JjYCBpcyBhIGZpbGUsIGBkZXN0YCBjYW5ub3RcbiAqICAgICAgICAgICAgIGJlIGEgZGlyZWN0b3J5XG4gKiBAcGFyYW0gb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29weVN5bmMoXG4gIHNyYzogc3RyaW5nIHwgVVJMLFxuICBkZXN0OiBzdHJpbmcgfCBVUkwsXG4gIG9wdGlvbnM6IENvcHlPcHRpb25zID0ge30sXG4pIHtcbiAgc3JjID0gcGF0aC5yZXNvbHZlKHRvUGF0aFN0cmluZyhzcmMpKTtcbiAgZGVzdCA9IHBhdGgucmVzb2x2ZSh0b1BhdGhTdHJpbmcoZGVzdCkpO1xuXG4gIGlmIChzcmMgPT09IGRlc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGNhbm5vdCBiZSB0aGUgc2FtZS5cIik7XG4gIH1cblxuICBjb25zdCBzcmNTdGF0ID0gRGVuby5sc3RhdFN5bmMoc3JjKTtcblxuICBpZiAoc3JjU3RhdC5pc0RpcmVjdG9yeSAmJiBpc1N1YmRpcihzcmMsIGRlc3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYENhbm5vdCBjb3B5ICcke3NyY30nIHRvIGEgc3ViZGlyZWN0b3J5IG9mIGl0c2VsZiwgJyR7ZGVzdH0nLmAsXG4gICAgKTtcbiAgfVxuXG4gIGlmIChzcmNTdGF0LmlzU3ltbGluaykge1xuICAgIGNvcHlTeW1saW5rU3luYyhzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkpIHtcbiAgICBjb3B5RGlyU3luYyhzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKHNyY1N0YXQuaXNGaWxlKSB7XG4gICAgY29weUZpbGVTeW5jKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsMkRBQTJEO0FBRTNELFlBQVksVUFBVSxpQkFBaUI7QUFDdkMsU0FBUyxTQUFTLEVBQUUsYUFBYSxRQUFRLGtCQUFrQjtBQUMzRCxTQUFTLGVBQWUsRUFBRSxRQUFRLEVBQUUsWUFBWSxRQUFRLGFBQWE7QUFDckUsU0FBUyxNQUFNLFFBQVEsc0JBQXNCO0FBQzdDLFNBQVMsU0FBUyxRQUFRLGlCQUFpQjtBQXVCM0MsZUFBZSxnQkFDYixHQUFpQixFQUNqQixJQUFrQixFQUNsQixPQUE0QixFQUNRO0lBQ3BDLElBQUk7SUFFSixJQUFJO1FBQ0YsV0FBVyxNQUFNLEtB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