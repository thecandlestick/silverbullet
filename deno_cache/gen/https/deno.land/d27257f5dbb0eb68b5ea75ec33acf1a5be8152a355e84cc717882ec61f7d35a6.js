// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import * as DenoUnstable from "../_deno_unstable.ts";
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { getFileInfoType, isSubdir } from "./_util.ts";
import { assert } from "../_util/assert.ts";
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
        throw new Error(`'${dest}' already exists.`);
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
        throw new Error(`'${dest}' already exists.`);
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
        await DenoUnstable.utime(dest, statInfo.atime, statInfo.mtime);
    }
}
/* copy file to dest synchronously */ function copyFileSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    Deno.copyFileSync(src, dest);
    if (options.preserveTimestamps) {
        const statInfo = Deno.statSync(src);
        assert(statInfo.atime instanceof Date, `statInfo.atime is unavailable`);
        assert(statInfo.mtime instanceof Date, `statInfo.mtime is unavailable`);
        DenoUnstable.utimeSync(dest, statInfo.atime, statInfo.mtime);
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
        await DenoUnstable.utime(dest, statInfo.atime, statInfo.mtime);
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
        DenoUnstable.utimeSync(dest, statInfo.atime, statInfo.mtime);
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
        await DenoUnstable.utime(dest, srcStatInfo.atime, srcStatInfo.mtime);
    }
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
        DenoUnstable.utimeSync(dest, srcStatInfo.atime, srcStatInfo.mtime);
    }
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
    src = path.resolve(src);
    dest = path.resolve(dest);
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
    src = path.resolve(src);
    dest = path.resolve(dest);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEzMS4wL2ZzL2NvcHkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbmltcG9ydCAqIGFzIERlbm9VbnN0YWJsZSBmcm9tIFwiLi4vX2Rlbm9fdW5zdGFibGUudHNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcIi4uL3BhdGgvbW9kLnRzXCI7XG5pbXBvcnQgeyBlbnN1cmVEaXIsIGVuc3VyZURpclN5bmMgfSBmcm9tIFwiLi9lbnN1cmVfZGlyLnRzXCI7XG5pbXBvcnQgeyBnZXRGaWxlSW5mb1R5cGUsIGlzU3ViZGlyIH0gZnJvbSBcIi4vX3V0aWwudHNcIjtcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuLi9fdXRpbC9hc3NlcnQudHNcIjtcbmltcG9ydCB7IGlzV2luZG93cyB9IGZyb20gXCIuLi9fdXRpbC9vcy50c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIG92ZXJ3cml0ZSBleGlzdGluZyBmaWxlIG9yIGRpcmVjdG9yeS4gRGVmYXVsdCBpcyBgZmFsc2VgXG4gICAqL1xuICBvdmVyd3JpdGU/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hlbiBgdHJ1ZWAsIHdpbGwgc2V0IGxhc3QgbW9kaWZpY2F0aW9uIGFuZCBhY2Nlc3MgdGltZXMgdG8gdGhlIG9uZXMgb2YgdGhlXG4gICAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAgICogV2hlbiBgZmFsc2VgLCB0aW1lc3RhbXAgYmVoYXZpb3IgaXMgT1MtZGVwZW5kZW50LlxuICAgKiBEZWZhdWx0IGlzIGBmYWxzZWAuXG4gICAqL1xuICBwcmVzZXJ2ZVRpbWVzdGFtcHM/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgSW50ZXJuYWxDb3B5T3B0aW9ucyBleHRlbmRzIENvcHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIGRlZmF1bHQgaXMgYGZhbHNlYFxuICAgKi9cbiAgaXNGb2xkZXI/OiBib29sZWFuO1xufVxuXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVWYWxpZENvcHkoXG4gIHNyYzogc3RyaW5nLFxuICBkZXN0OiBzdHJpbmcsXG4gIG9wdGlvbnM6IEludGVybmFsQ29weU9wdGlvbnMsXG4pOiBQcm9taXNlPERlbm8uRmlsZUluZm8gfCB1bmRlZmluZWQ+IHtcbiAgbGV0IGRlc3RTdGF0OiBEZW5vLkZpbGVJbmZvO1xuXG4gIHRyeSB7XG4gICAgZGVzdFN0YXQgPSBhd2FpdCBEZW5vLmxzdGF0KGRlc3QpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuTm90Rm91bmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuaXNGb2xkZXIgJiYgIWRlc3RTdGF0LmlzRGlyZWN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYENhbm5vdCBvdmVyd3JpdGUgbm9uLWRpcmVjdG9yeSAnJHtkZXN0fScgd2l0aCBkaXJlY3RvcnkgJyR7c3JjfScuYCxcbiAgICApO1xuICB9XG4gIGlmICghb3B0aW9ucy5vdmVyd3JpdGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2Rlc3R9JyBhbHJlYWR5IGV4aXN0cy5gKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0U3RhdDtcbn1cblxuZnVuY3Rpb24gZW5zdXJlVmFsaWRDb3B5U3luYyhcbiAgc3JjOiBzdHJpbmcsXG4gIGRlc3Q6IHN0cmluZyxcbiAgb3B0aW9uczogSW50ZXJuYWxDb3B5T3B0aW9ucyxcbik6IERlbm8uRmlsZUluZm8gfCB1bmRlZmluZWQge1xuICBsZXQgZGVzdFN0YXQ6IERlbm8uRmlsZUluZm87XG4gIHRyeSB7XG4gICAgZGVzdFN0YXQgPSBEZW5vLmxzdGF0U3luYyhkZXN0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyciBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLk5vdEZvdW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IGVycjtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmlzRm9sZGVyICYmICFkZXN0U3RhdC5pc0RpcmVjdG9yeSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBDYW5ub3Qgb3ZlcndyaXRlIG5vbi1kaXJlY3RvcnkgJyR7ZGVzdH0nIHdpdGggZGlyZWN0b3J5ICcke3NyY30nLmAsXG4gICAgKTtcbiAgfVxuICBpZiAoIW9wdGlvbnMub3ZlcndyaXRlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAnJHtkZXN0fScgYWxyZWFkeSBleGlzdHMuYCk7XG4gIH1cblxuICByZXR1cm4gZGVzdFN0YXQ7XG59XG5cbi8qIGNvcHkgZmlsZSB0byBkZXN0ICovXG5hc3luYyBmdW5jdGlvbiBjb3B5RmlsZShcbiAgc3JjOiBzdHJpbmcsXG4gIGRlc3Q6IHN0cmluZyxcbiAgb3B0aW9uczogSW50ZXJuYWxDb3B5T3B0aW9ucyxcbikge1xuICBhd2FpdCBlbnN1cmVWYWxpZENvcHkoc3JjLCBkZXN0LCBvcHRpb25zKTtcbiAgYXdhaXQgRGVuby5jb3B5RmlsZShzcmMsIGRlc3QpO1xuICBpZiAob3B0aW9ucy5wcmVzZXJ2ZVRpbWVzdGFtcHMpIHtcbiAgICBjb25zdCBzdGF0SW5mbyA9IGF3YWl0IERlbm8uc3RhdChzcmMpO1xuICAgIGFzc2VydChzdGF0SW5mby5hdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5hdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIGFzc2VydChzdGF0SW5mby5tdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5tdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIGF3YWl0IERlbm9VbnN0YWJsZS51dGltZShkZXN0LCBzdGF0SW5mby5hdGltZSwgc3RhdEluZm8ubXRpbWUpO1xuICB9XG59XG4vKiBjb3B5IGZpbGUgdG8gZGVzdCBzeW5jaHJvbm91c2x5ICovXG5mdW5jdGlvbiBjb3B5RmlsZVN5bmMoXG4gIHNyYzogc3RyaW5nLFxuICBkZXN0OiBzdHJpbmcsXG4gIG9wdGlvbnM6IEludGVybmFsQ29weU9wdGlvbnMsXG4pOiB2b2lkIHtcbiAgZW5zdXJlVmFsaWRDb3B5U3luYyhzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICBEZW5vLmNvcHlGaWxlU3luYyhzcmMsIGRlc3QpO1xuICBpZiAob3B0aW9ucy5wcmVzZXJ2ZVRpbWVzdGFtcHMpIHtcbiAgICBjb25zdCBzdGF0SW5mbyA9IERlbm8uc3RhdFN5bmMoc3JjKTtcbiAgICBhc3NlcnQoc3RhdEluZm8uYXRpbWUgaW5zdGFuY2VvZiBEYXRlLCBgc3RhdEluZm8uYXRpbWUgaXMgdW5hdmFpbGFibGVgKTtcbiAgICBhc3NlcnQoc3RhdEluZm8ubXRpbWUgaW5zdGFuY2VvZiBEYXRlLCBgc3RhdEluZm8ubXRpbWUgaXMgdW5hdmFpbGFibGVgKTtcbiAgICBEZW5vVW5zdGFibGUudXRpbWVTeW5jKGRlc3QsIHN0YXRJbmZvLmF0aW1lLCBzdGF0SW5mby5tdGltZSk7XG4gIH1cbn1cblxuLyogY29weSBzeW1saW5rIHRvIGRlc3QgKi9cbmFzeW5jIGZ1bmN0aW9uIGNvcHlTeW1MaW5rKFxuICBzcmM6IHN0cmluZyxcbiAgZGVzdDogc3RyaW5nLFxuICBvcHRpb25zOiBJbnRlcm5hbENvcHlPcHRpb25zLFxuKSB7XG4gIGF3YWl0IGVuc3VyZVZhbGlkQ29weShzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICBjb25zdCBvcmlnaW5TcmNGaWxlUGF0aCA9IGF3YWl0IERlbm8ucmVhZExpbmsoc3JjKTtcbiAgY29uc3QgdHlwZSA9IGdldEZpbGVJbmZvVHlwZShhd2FpdCBEZW5vLmxzdGF0KHNyYykpO1xuICBpZiAoaXNXaW5kb3dzKSB7XG4gICAgYXdhaXQgRGVuby5zeW1saW5rKG9yaWdpblNyY0ZpbGVQYXRoLCBkZXN0LCB7XG4gICAgICB0eXBlOiB0eXBlID09PSBcImRpclwiID8gXCJkaXJcIiA6IFwiZmlsZVwiLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IERlbm8uc3ltbGluayhvcmlnaW5TcmNGaWxlUGF0aCwgZGVzdCk7XG4gIH1cbiAgaWYgKG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzKSB7XG4gICAgY29uc3Qgc3RhdEluZm8gPSBhd2FpdCBEZW5vLmxzdGF0KHNyYyk7XG4gICAgYXNzZXJ0KHN0YXRJbmZvLmF0aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLmF0aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXNzZXJ0KHN0YXRJbmZvLm10aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLm10aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXdhaXQgRGVub1Vuc3RhYmxlLnV0aW1lKGRlc3QsIHN0YXRJbmZvLmF0aW1lLCBzdGF0SW5mby5tdGltZSk7XG4gIH1cbn1cblxuLyogY29weSBzeW1saW5rIHRvIGRlc3Qgc3luY2hyb25vdXNseSAqL1xuZnVuY3Rpb24gY29weVN5bWxpbmtTeW5jKFxuICBzcmM6IHN0cmluZyxcbiAgZGVzdDogc3RyaW5nLFxuICBvcHRpb25zOiBJbnRlcm5hbENvcHlPcHRpb25zLFxuKTogdm9pZCB7XG4gIGVuc3VyZVZhbGlkQ29weVN5bmMoc3JjLCBkZXN0LCBvcHRpb25zKTtcbiAgY29uc3Qgb3JpZ2luU3JjRmlsZVBhdGggPSBEZW5vLnJlYWRMaW5rU3luYyhzcmMpO1xuICBjb25zdCB0eXBlID0gZ2V0RmlsZUluZm9UeXBlKERlbm8ubHN0YXRTeW5jKHNyYykpO1xuICBpZiAoaXNXaW5kb3dzKSB7XG4gICAgRGVuby5zeW1saW5rU3luYyhvcmlnaW5TcmNGaWxlUGF0aCwgZGVzdCwge1xuICAgICAgdHlwZTogdHlwZSA9PT0gXCJkaXJcIiA/IFwiZGlyXCIgOiBcImZpbGVcIixcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBEZW5vLnN5bWxpbmtTeW5jKG9yaWdpblNyY0ZpbGVQYXRoLCBkZXN0KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByZXNlcnZlVGltZXN0YW1wcykge1xuICAgIGNvbnN0IHN0YXRJbmZvID0gRGVuby5sc3RhdFN5bmMoc3JjKTtcbiAgICBhc3NlcnQoc3RhdEluZm8uYXRpbWUgaW5zdGFuY2VvZiBEYXRlLCBgc3RhdEluZm8uYXRpbWUgaXMgdW5hdmFpbGFibGVgKTtcbiAgICBhc3NlcnQoc3RhdEluZm8ubXRpbWUgaW5zdGFuY2VvZiBEYXRlLCBgc3RhdEluZm8ubXRpbWUgaXMgdW5hdmFpbGFibGVgKTtcbiAgICBEZW5vVW5zdGFibGUudXRpbWVTeW5jKGRlc3QsIHN0YXRJbmZvLmF0aW1lLCBzdGF0SW5mby5tdGltZSk7XG4gIH1cbn1cblxuLyogY29weSBmb2xkZXIgZnJvbSBzcmMgdG8gZGVzdC4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNvcHlEaXIoXG4gIHNyYzogc3RyaW5nLFxuICBkZXN0OiBzdHJpbmcsXG4gIG9wdGlvbnM6IENvcHlPcHRpb25zLFxuKSB7XG4gIGNvbnN0IGRlc3RTdGF0ID0gYXdhaXQgZW5zdXJlVmFsaWRDb3B5KHNyYywgZGVzdCwge1xuICAgIC4uLm9wdGlvbnMsXG4gICAgaXNGb2xkZXI6IHRydWUsXG4gIH0pO1xuXG4gIGlmICghZGVzdFN0YXQpIHtcbiAgICBhd2FpdCBlbnN1cmVEaXIoZGVzdCk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5wcmVzZXJ2ZVRpbWVzdGFtcHMpIHtcbiAgICBjb25zdCBzcmNTdGF0SW5mbyA9IGF3YWl0IERlbm8uc3RhdChzcmMpO1xuICAgIGFzc2VydChzcmNTdGF0SW5mby5hdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5hdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIGFzc2VydChzcmNTdGF0SW5mby5tdGltZSBpbnN0YW5jZW9mIERhdGUsIGBzdGF0SW5mby5tdGltZSBpcyB1bmF2YWlsYWJsZWApO1xuICAgIGF3YWl0IERlbm9VbnN0YWJsZS51dGltZShkZXN0LCBzcmNTdGF0SW5mby5hdGltZSwgc3JjU3RhdEluZm8ubXRpbWUpO1xuICB9XG5cbiAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBEZW5vLnJlYWREaXIoc3JjKSkge1xuICAgIGNvbnN0IHNyY1BhdGggPSBwYXRoLmpvaW4oc3JjLCBlbnRyeS5uYW1lKTtcbiAgICBjb25zdCBkZXN0UGF0aCA9IHBhdGguam9pbihkZXN0LCBwYXRoLmJhc2VuYW1lKHNyY1BhdGggYXMgc3RyaW5nKSk7XG4gICAgaWYgKGVudHJ5LmlzU3ltbGluaykge1xuICAgICAgYXdhaXQgY29weVN5bUxpbmsoc3JjUGF0aCwgZGVzdFBhdGgsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoZW50cnkuaXNEaXJlY3RvcnkpIHtcbiAgICAgIGF3YWl0IGNvcHlEaXIoc3JjUGF0aCwgZGVzdFBhdGgsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICBhd2FpdCBjb3B5RmlsZShzcmNQYXRoLCBkZXN0UGF0aCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbi8qIGNvcHkgZm9sZGVyIGZyb20gc3JjIHRvIGRlc3Qgc3luY2hyb25vdXNseSAqL1xuZnVuY3Rpb24gY29weURpclN5bmMoc3JjOiBzdHJpbmcsIGRlc3Q6IHN0cmluZywgb3B0aW9uczogQ29weU9wdGlvbnMpOiB2b2lkIHtcbiAgY29uc3QgZGVzdFN0YXQgPSBlbnN1cmVWYWxpZENvcHlTeW5jKHNyYywgZGVzdCwge1xuICAgIC4uLm9wdGlvbnMsXG4gICAgaXNGb2xkZXI6IHRydWUsXG4gIH0pO1xuXG4gIGlmICghZGVzdFN0YXQpIHtcbiAgICBlbnN1cmVEaXJTeW5jKGRlc3QpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJlc2VydmVUaW1lc3RhbXBzKSB7XG4gICAgY29uc3Qgc3JjU3RhdEluZm8gPSBEZW5vLnN0YXRTeW5jKHNyYyk7XG4gICAgYXNzZXJ0KHNyY1N0YXRJbmZvLmF0aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLmF0aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgYXNzZXJ0KHNyY1N0YXRJbmZvLm10aW1lIGluc3RhbmNlb2YgRGF0ZSwgYHN0YXRJbmZvLm10aW1lIGlzIHVuYXZhaWxhYmxlYCk7XG4gICAgRGVub1Vuc3RhYmxlLnV0aW1lU3luYyhkZXN0LCBzcmNTdGF0SW5mby5hdGltZSwgc3JjU3RhdEluZm8ubXRpbWUpO1xuICB9XG5cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBEZW5vLnJlYWREaXJTeW5jKHNyYykpIHtcbiAgICBhc3NlcnQoZW50cnkubmFtZSAhPSBudWxsLCBcImZpbGUubmFtZSBtdXN0IGJlIHNldFwiKTtcbiAgICBjb25zdCBzcmNQYXRoID0gcGF0aC5qb2luKHNyYywgZW50cnkubmFtZSk7XG4gICAgY29uc3QgZGVzdFBhdGggPSBwYXRoLmpvaW4oZGVzdCwgcGF0aC5iYXNlbmFtZShzcmNQYXRoIGFzIHN0cmluZykpO1xuICAgIGlmIChlbnRyeS5pc1N5bWxpbmspIHtcbiAgICAgIGNvcHlTeW1saW5rU3luYyhzcmNQYXRoLCBkZXN0UGF0aCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgY29weURpclN5bmMoc3JjUGF0aCwgZGVzdFBhdGgsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICBjb3B5RmlsZVN5bmMoc3JjUGF0aCwgZGVzdFBhdGgsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvcHkgYSBmaWxlIG9yIGRpcmVjdG9yeS4gVGhlIGRpcmVjdG9yeSBjYW4gaGF2ZSBjb250ZW50cy4gTGlrZSBgY3AgLXJgLlxuICogUmVxdWlyZXMgdGhlIGAtLWFsbG93LXJlYWRgIGFuZCBgLS1hbGxvdy13cml0ZWAgZmxhZy5cbiAqIEBwYXJhbSBzcmMgdGhlIGZpbGUvZGlyZWN0b3J5IHBhdGguXG4gKiAgICAgICAgICAgIE5vdGUgdGhhdCBpZiBgc3JjYCBpcyBhIGRpcmVjdG9yeSBpdCB3aWxsIGNvcHkgZXZlcnl0aGluZyBpbnNpZGVcbiAqICAgICAgICAgICAgb2YgdGhpcyBkaXJlY3RvcnksIG5vdCB0aGUgZW50aXJlIGRpcmVjdG9yeSBpdHNlbGZcbiAqIEBwYXJhbSBkZXN0IHRoZSBkZXN0aW5hdGlvbiBwYXRoLiBOb3RlIHRoYXQgaWYgYHNyY2AgaXMgYSBmaWxlLCBgZGVzdGAgY2Fubm90XG4gKiAgICAgICAgICAgICBiZSBhIGRpcmVjdG9yeVxuICogQHBhcmFtIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvcHkoXG4gIHNyYzogc3RyaW5nLFxuICBkZXN0OiBzdHJpbmcsXG4gIG9wdGlvbnM6IENvcHlPcHRpb25zID0ge30sXG4pIHtcbiAgc3JjID0gcGF0aC5yZXNvbHZlKHNyYyk7XG4gIGRlc3QgPSBwYXRoLnJlc29sdmUoZGVzdCk7XG5cbiAgaWYgKHNyYyA9PT0gZGVzdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlNvdXJjZSBhbmQgZGVzdGluYXRpb24gY2Fubm90IGJlIHRoZSBzYW1lLlwiKTtcbiAgfVxuXG4gIGNvbnN0IHNyY1N0YXQgPSBhd2FpdCBEZW5vLmxzdGF0KHNyYyk7XG5cbiAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkgJiYgaXNTdWJkaXIoc3JjLCBkZXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBDYW5ub3QgY29weSAnJHtzcmN9JyB0byBhIHN1YmRpcmVjdG9yeSBvZiBpdHNlbGYsICcke2Rlc3R9Jy5gLFxuICAgICk7XG4gIH1cblxuICBpZiAoc3JjU3RhdC5pc1N5bWxpbmspIHtcbiAgICBhd2FpdCBjb3B5U3ltTGluayhzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkpIHtcbiAgICBhd2FpdCBjb3B5RGlyKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAoc3JjU3RhdC5pc0ZpbGUpIHtcbiAgICBhd2FpdCBjb3B5RmlsZShzcmMsIGRlc3QsIG9wdGlvbnMpO1xuICB9XG59XG5cbi8qKlxuICogQ29weSBhIGZpbGUgb3IgZGlyZWN0b3J5LiBUaGUgZGlyZWN0b3J5IGNhbiBoYXZlIGNvbnRlbnRzLiBMaWtlIGBjcCAtcmAuXG4gKiBSZXF1aXJlcyB0aGUgYC0tYWxsb3ctcmVhZGAgYW5kIGAtLWFsbG93LXdyaXRlYCBmbGFnLlxuICogQHBhcmFtIHNyYyB0aGUgZmlsZS9kaXJlY3RvcnkgcGF0aC5cbiAqICAgICAgICAgICAgTm90ZSB0aGF0IGlmIGBzcmNgIGlzIGEgZGlyZWN0b3J5IGl0IHdpbGwgY29weSBldmVyeXRoaW5nIGluc2lkZVxuICogICAgICAgICAgICBvZiB0aGlzIGRpcmVjdG9yeSwgbm90IHRoZSBlbnRpcmUgZGlyZWN0b3J5IGl0c2VsZlxuICogQHBhcmFtIGRlc3QgdGhlIGRlc3RpbmF0aW9uIHBhdGguIE5vdGUgdGhhdCBpZiBgc3JjYCBpcyBhIGZpbGUsIGBkZXN0YCBjYW5ub3RcbiAqICAgICAgICAgICAgIGJlIGEgZGlyZWN0b3J5XG4gKiBAcGFyYW0gb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29weVN5bmMoXG4gIHNyYzogc3RyaW5nLFxuICBkZXN0OiBzdHJpbmcsXG4gIG9wdGlvbnM6IENvcHlPcHRpb25zID0ge30sXG4pOiB2b2lkIHtcbiAgc3JjID0gcGF0aC5yZXNvbHZlKHNyYyk7XG4gIGRlc3QgPSBwYXRoLnJlc29sdmUoZGVzdCk7XG5cbiAgaWYgKHNyYyA9PT0gZGVzdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlNvdXJjZSBhbmQgZGVzdGluYXRpb24gY2Fubm90IGJlIHRoZSBzYW1lLlwiKTtcbiAgfVxuXG4gIGNvbnN0IHNyY1N0YXQgPSBEZW5vLmxzdGF0U3luYyhzcmMpO1xuXG4gIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5ICYmIGlzU3ViZGlyKHNyYywgZGVzdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQ2Fubm90IGNvcHkgJyR7c3JjfScgdG8gYSBzdWJkaXJlY3Rvcnkgb2YgaXRzZWxmLCAnJHtkZXN0fScuYCxcbiAgICApO1xuICB9XG5cbiAgaWYgKHNyY1N0YXQuaXNTeW1saW5rKSB7XG4gICAgY29weVN5bWxpbmtTeW5jKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAoc3JjU3RhdC5pc0RpcmVjdG9yeSkge1xuICAgIGNvcHlEaXJTeW5jKHNyYywgZGVzdCwgb3B0aW9ucyk7XG4gIH0gZWxzZSBpZiAoc3JjU3RhdC5pc0ZpbGUpIHtcbiAgICBjb3B5RmlsZVN5bmMoc3JjLCBkZXN0LCBvcHRpb25zKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBFQUEwRTtBQUMxRSxZQUFZLGtCQUFrQix1QkFBdUI7QUFDckQsWUFBWSxVQUFVLGlCQUFpQjtBQUN2QyxTQUFTLFNBQVMsRUFBRSxhQUFhLFFBQVEsa0JBQWtCO0FBQzNELFNBQVMsZUFBZSxFQUFFLFFBQVEsUUFBUSxhQUFhO0FBQ3ZELFNBQVMsTUFBTSxRQUFRLHFCQUFxQjtBQUM1QyxTQUFTLFNBQVMsUUFBUSxpQkFBaUI7QUF1QjNDLGVBQWUsZ0JBQ2IsR0FBVyxFQUNYLElBQVksRUFDWixPQUE0QixFQUNRO0lBQ3BDLElBQUk7SUFFSixJQUFJO1FBQ0YsV0FBVyxNQUFNLEtBQUssS0FBSyxDQUFDO0lBQzlCLEVBQUUsT0FBTyxLQUFLO1FBQ1osSUFBSSxlQUFlLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUN2QztRQUNGLENBQUM7UUFDRCxNQUFNLElBQUk7SUFDWjtJQUVBLElBQUksUUFBUSxRQUFRLElBQUksQ0FBQyxTQUFTLFdBQVcsRUFBRTtRQUM3QyxNQUFNLElBQUksTUFDUixDQUFDLGdDQUFnQyxFQUFFLEtBQUssa0JBQWtCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFDbkU7SUFDSixDQUFDO0lBQ0QsSUFBSSxDQUFDLFFBQVEsU0FBUyxFQUFFO1FBQ3RCLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FB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