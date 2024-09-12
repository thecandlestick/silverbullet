// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { getFileInfoType, toPathString } from "./_util.ts";
import { isWindows } from "../_util/os.ts";
/**
 * Ensures that the link exists.
 * If the directory structure does not exist, it is created.
 *
 * @param src the source file path
 * @param dest the destination link path
 */ export async function ensureSymlink(src, dest) {
    const srcStatInfo = await Deno.lstat(src);
    const srcFilePathType = getFileInfoType(srcStatInfo);
    await ensureDir(path.dirname(toPathString(dest)));
    const options = isWindows ? {
        type: srcFilePathType === "dir" ? "dir" : "file"
    } : undefined;
    try {
        await Deno.symlink(src, dest, options);
    } catch (error) {
        if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
        }
    }
}
/**
 * Ensures that the link exists.
 * If the directory structure does not exist, it is created.
 *
 * @param src the source file path
 * @param dest the destination link path
 */ export function ensureSymlinkSync(src, dest) {
    const srcStatInfo = Deno.lstatSync(src);
    const srcFilePathType = getFileInfoType(srcStatInfo);
    ensureDirSync(path.dirname(toPathString(dest)));
    const options = isWindows ? {
        type: srcFilePathType === "dir" ? "dir" : "file"
    } : undefined;
    try {
        Deno.symlinkSync(src, dest, options);
    } catch (error) {
        if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL2Vuc3VyZV9zeW1saW5rLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCIuLi9wYXRoL21vZC50c1wiO1xuaW1wb3J0IHsgZW5zdXJlRGlyLCBlbnN1cmVEaXJTeW5jIH0gZnJvbSBcIi4vZW5zdXJlX2Rpci50c1wiO1xuaW1wb3J0IHsgZ2V0RmlsZUluZm9UeXBlLCB0b1BhdGhTdHJpbmcgfSBmcm9tIFwiLi9fdXRpbC50c1wiO1xuaW1wb3J0IHsgaXNXaW5kb3dzIH0gZnJvbSBcIi4uL191dGlsL29zLnRzXCI7XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IHRoZSBsaW5rIGV4aXN0cy5cbiAqIElmIHRoZSBkaXJlY3Rvcnkgc3RydWN0dXJlIGRvZXMgbm90IGV4aXN0LCBpdCBpcyBjcmVhdGVkLlxuICpcbiAqIEBwYXJhbSBzcmMgdGhlIHNvdXJjZSBmaWxlIHBhdGhcbiAqIEBwYXJhbSBkZXN0IHRoZSBkZXN0aW5hdGlvbiBsaW5rIHBhdGhcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZVN5bWxpbmsoc3JjOiBzdHJpbmcgfCBVUkwsIGRlc3Q6IHN0cmluZyB8IFVSTCkge1xuICBjb25zdCBzcmNTdGF0SW5mbyA9IGF3YWl0IERlbm8ubHN0YXQoc3JjKTtcbiAgY29uc3Qgc3JjRmlsZVBhdGhUeXBlID0gZ2V0RmlsZUluZm9UeXBlKHNyY1N0YXRJbmZvKTtcblxuICBhd2FpdCBlbnN1cmVEaXIocGF0aC5kaXJuYW1lKHRvUGF0aFN0cmluZyhkZXN0KSkpO1xuXG4gIGNvbnN0IG9wdGlvbnM6IERlbm8uU3ltbGlua09wdGlvbnMgfCB1bmRlZmluZWQgPSBpc1dpbmRvd3NcbiAgICA/IHtcbiAgICAgIHR5cGU6IHNyY0ZpbGVQYXRoVHlwZSA9PT0gXCJkaXJcIiA/IFwiZGlyXCIgOiBcImZpbGVcIixcbiAgICB9XG4gICAgOiB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBEZW5vLnN5bWxpbmsoc3JjLCBkZXN0LCBvcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLkFscmVhZHlFeGlzdHMpKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgdGhlIGxpbmsgZXhpc3RzLlxuICogSWYgdGhlIGRpcmVjdG9yeSBzdHJ1Y3R1cmUgZG9lcyBub3QgZXhpc3QsIGl0IGlzIGNyZWF0ZWQuXG4gKlxuICogQHBhcmFtIHNyYyB0aGUgc291cmNlIGZpbGUgcGF0aFxuICogQHBhcmFtIGRlc3QgdGhlIGRlc3RpbmF0aW9uIGxpbmsgcGF0aFxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlU3ltbGlua1N5bmMoc3JjOiBzdHJpbmcgfCBVUkwsIGRlc3Q6IHN0cmluZyB8IFVSTCkge1xuICBjb25zdCBzcmNTdGF0SW5mbyA9IERlbm8ubHN0YXRTeW5jKHNyYyk7XG4gIGNvbnN0IHNyY0ZpbGVQYXRoVHlwZSA9IGdldEZpbGVJbmZvVHlwZShzcmNTdGF0SW5mbyk7XG5cbiAgZW5zdXJlRGlyU3luYyhwYXRoLmRpcm5hbWUodG9QYXRoU3RyaW5nKGRlc3QpKSk7XG5cbiAgY29uc3Qgb3B0aW9uczogRGVuby5TeW1saW5rT3B0aW9ucyB8IHVuZGVmaW5lZCA9IGlzV2luZG93c1xuICAgID8ge1xuICAgICAgdHlwZTogc3JjRmlsZVBhdGhUeXBlID09PSBcImRpclwiID8gXCJkaXJcIiA6IFwiZmlsZVwiLFxuICAgIH1cbiAgICA6IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIERlbm8uc3ltbGlua1N5bmMoc3JjLCBkZXN0LCBvcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLkFscmVhZHlFeGlzdHMpKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsWUFBWSxVQUFVLGlCQUFpQjtBQUN2QyxTQUFTLFNBQVMsRUFBRSxhQUFhLFFBQVEsa0JBQWtCO0FBQzNELFNBQVMsZUFBZSxFQUFFLFlBQVksUUFBUSxhQUFhO0FBQzNELFNBQVMsU0FBUyxRQUFRLGlCQUFpQjtBQUUzQzs7Ozs7O0NBTUMsR0FDRCxPQUFPLGVBQWUsY0FBYyxHQUFpQixFQUFFLElBQWtCLEVBQUU7SUFDekUsTUFBTSxjQUFjLE1BQU0sS0FBSyxLQUFLLENBQUM7SUFDckMsTUFBTSxrQkFBa0IsZ0JBQWdCO0lBRXhDLE1BQU0sVUFBVSxLQUFLLE9BQU8sQ0FBQyxhQUFhO0lBRTFDLE1BQU0sVUFBMkMsWUFDN0M7UUFDQSxNQUFNLG9CQUFvQixRQUFRLFFBQVEsTUFBTTtJQUNsRCxJQUNFLFNBQVM7SUFFYixJQUFJO1FBQ0YsTUFBTSxLQUFLLE9BQU8sQ0FBQyxLQUFLLE1BQU07SUFDaEMsRUFBRSxPQUFPLE9BQU87UUFDZCxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsS0FBSyxNQUFNLENBQUMsYUFBYSxHQUFHO1lBQ2pELE1BQU0sTUFBTTtRQUNkLENBQUM7SUFDSDtBQUNGLENBQUM7QUFFRDs7Ozs7O0NBTUMsR0FDRCxPQUFPLFNBQVMsa0JBQWtCLEdBQWlCLEVBQUUsSUFBa0IsRUFBRTtJQUN2RSxNQUFNLGNBQWMsS0FBSyxTQUFTLENBQUM7SUFDbkMsTUFBTSxrQkFBa0IsZ0JBQWdCO0lBRXhDLGNBQWMsS0FBSyxPQUFPLENBQUMsYUFBYTtJQUV4QyxNQUFNLFVBQTJDLFlBQzdDO1FBQ0EsTUFBTSxvQkFBb0IsUUFBUSxRQUFRLE1BQU07SUFDbEQsSUFDRSxTQUFTO0lBRWIsSUFBSTtRQUNGLEtBQUssV0FBVyxDQUFDLEtBQUssTUFBTTtJQUM5QixFQUFFLE9BQU8sT0FBTztRQUNkLElBQUksQ0FBQyxDQUFDLGlCQUFpQixLQUFLLE1BQU0sQ0FBQyxhQUFhLEdBQUc7WUFDakQsTUFBTSxNQUFNO1FBQ2QsQ0FBQztJQUNIO0FBQ0YsQ0FBQyJ9