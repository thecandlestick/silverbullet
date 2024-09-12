// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { exists, existsSync } from "./exists.ts";
import { getFileInfoType } from "./_util.ts";
/**
 * Ensures that the hard link exists.
 * If the directory structure does not exist, it is created.
 *
 * @param src the source file path. Directory hard links are not allowed.
 * @param dest the destination link path
 */ export async function ensureLink(src, dest) {
    if (await exists(dest)) {
        const destStatInfo = await Deno.lstat(dest);
        const destFilePathType = getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
            throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
        }
        return;
    }
    await ensureDir(path.dirname(dest));
    await Deno.link(src, dest);
}
/**
 * Ensures that the hard link exists.
 * If the directory structure does not exist, it is created.
 *
 * @param src the source file path. Directory hard links are not allowed.
 * @param dest the destination link path
 */ export function ensureLinkSync(src, dest) {
    if (existsSync(dest)) {
        const destStatInfo = Deno.lstatSync(dest);
        const destFilePathType = getFileInfoType(destStatInfo);
        if (destFilePathType !== "file") {
            throw new Error(`Ensure path exists, expected 'file', got '${destFilePathType}'`);
        }
        return;
    }
    ensureDirSync(path.dirname(dest));
    Deno.linkSync(src, dest);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjEzMS4wL2ZzL2Vuc3VyZV9saW5rLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCIuLi9wYXRoL21vZC50c1wiO1xuaW1wb3J0IHsgZW5zdXJlRGlyLCBlbnN1cmVEaXJTeW5jIH0gZnJvbSBcIi4vZW5zdXJlX2Rpci50c1wiO1xuaW1wb3J0IHsgZXhpc3RzLCBleGlzdHNTeW5jIH0gZnJvbSBcIi4vZXhpc3RzLnRzXCI7XG5pbXBvcnQgeyBnZXRGaWxlSW5mb1R5cGUgfSBmcm9tIFwiLi9fdXRpbC50c1wiO1xuXG4vKipcbiAqIEVuc3VyZXMgdGhhdCB0aGUgaGFyZCBsaW5rIGV4aXN0cy5cbiAqIElmIHRoZSBkaXJlY3Rvcnkgc3RydWN0dXJlIGRvZXMgbm90IGV4aXN0LCBpdCBpcyBjcmVhdGVkLlxuICpcbiAqIEBwYXJhbSBzcmMgdGhlIHNvdXJjZSBmaWxlIHBhdGguIERpcmVjdG9yeSBoYXJkIGxpbmtzIGFyZSBub3QgYWxsb3dlZC5cbiAqIEBwYXJhbSBkZXN0IHRoZSBkZXN0aW5hdGlvbiBsaW5rIHBhdGhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUxpbmsoc3JjOiBzdHJpbmcsIGRlc3Q6IHN0cmluZykge1xuICBpZiAoYXdhaXQgZXhpc3RzKGRlc3QpKSB7XG4gICAgY29uc3QgZGVzdFN0YXRJbmZvID0gYXdhaXQgRGVuby5sc3RhdChkZXN0KTtcbiAgICBjb25zdCBkZXN0RmlsZVBhdGhUeXBlID0gZ2V0RmlsZUluZm9UeXBlKGRlc3RTdGF0SW5mbyk7XG4gICAgaWYgKGRlc3RGaWxlUGF0aFR5cGUgIT09IFwiZmlsZVwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFbnN1cmUgcGF0aCBleGlzdHMsIGV4cGVjdGVkICdmaWxlJywgZ290ICcke2Rlc3RGaWxlUGF0aFR5cGV9J2AsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBhd2FpdCBlbnN1cmVEaXIocGF0aC5kaXJuYW1lKGRlc3QpKTtcblxuICBhd2FpdCBEZW5vLmxpbmsoc3JjLCBkZXN0KTtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgdGhlIGhhcmQgbGluayBleGlzdHMuXG4gKiBJZiB0aGUgZGlyZWN0b3J5IHN0cnVjdHVyZSBkb2VzIG5vdCBleGlzdCwgaXQgaXMgY3JlYXRlZC5cbiAqXG4gKiBAcGFyYW0gc3JjIHRoZSBzb3VyY2UgZmlsZSBwYXRoLiBEaXJlY3RvcnkgaGFyZCBsaW5rcyBhcmUgbm90IGFsbG93ZWQuXG4gKiBAcGFyYW0gZGVzdCB0aGUgZGVzdGluYXRpb24gbGluayBwYXRoXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVMaW5rU3luYyhzcmM6IHN0cmluZywgZGVzdDogc3RyaW5nKTogdm9pZCB7XG4gIGlmIChleGlzdHNTeW5jKGRlc3QpKSB7XG4gICAgY29uc3QgZGVzdFN0YXRJbmZvID0gRGVuby5sc3RhdFN5bmMoZGVzdCk7XG4gICAgY29uc3QgZGVzdEZpbGVQYXRoVHlwZSA9IGdldEZpbGVJbmZvVHlwZShkZXN0U3RhdEluZm8pO1xuICAgIGlmIChkZXN0RmlsZVBhdGhUeXBlICE9PSBcImZpbGVcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRW5zdXJlIHBhdGggZXhpc3RzLCBleHBlY3RlZCAnZmlsZScsIGdvdCAnJHtkZXN0RmlsZVBhdGhUeXBlfSdgLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZW5zdXJlRGlyU3luYyhwYXRoLmRpcm5hbWUoZGVzdCkpO1xuXG4gIERlbm8ubGlua1N5bmMoc3JjLCBkZXN0KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsWUFBWSxVQUFVLGlCQUFpQjtBQUN2QyxTQUFTLFNBQVMsRUFBRSxhQUFhLFFBQVEsa0JBQWtCO0FBQzNELFNBQVMsTUFBTSxFQUFFLFVBQVUsUUFBUSxjQUFjO0FBQ2pELFNBQVMsZUFBZSxRQUFRLGFBQWE7QUFFN0M7Ozs7OztDQU1DLEdBQ0QsT0FBTyxlQUFlLFdBQVcsR0FBVyxFQUFFLElBQVksRUFBRTtJQUMxRCxJQUFJLE1BQU0sT0FBTyxPQUFPO1FBQ3RCLE1BQU0sZUFBZSxNQUFNLEtBQUssS0FBSyxDQUFDO1FBQ3RDLE1BQU0sbUJBQW1CLGdCQUFnQjtRQUN6QyxJQUFJLHFCQUFxQixRQUFRO1lBQy9CLE1BQU0sSUFBSSxNQUNSLENBQUMsMENBQTBDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxFQUNoRTtRQUNKLENBQUM7UUFDRDtJQUNGLENBQUM7SUFFRCxNQUFNLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFFN0IsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLO0FBQ3ZCLENBQUM7QUFFRDs7Ozs7O0NBTUMsR0FDRCxPQUFPLFNBQVMsZUFBZSxHQUFXLEVBQUUsSUFBWSxFQUFRO0lBQzlELElBQUksV0FBVyxPQUFPO1FBQ3BCLE1BQU0sZUFBZSxLQUFLLFNBQVMsQ0FBQztRQUNwQyxNQUFNLG1CQUFtQixnQkFBZ0I7UUFDekMsSUFBSSxxQkFBcUIsUUFBUTtZQUMvQixNQUFNLElBQUksTUFDUixDQUFDLDBDQUEwQyxFQUFFLGlCQUFpQixDQUFDLENBQUMsRUFDaEU7UUFDSixDQUFDO1FBQ0Q7SUFDRixDQUFDO0lBRUQsY0FBYyxLQUFLLE9BQU8sQ0FBQztJQUUzQixLQUFLLFFBQVEsQ0FBQyxLQUFLO0FBQ3JCLENBQUMifQ==