// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { getFileInfoType, toPathString } from "./_util.ts";
/**
 * Ensures that the file exists.
 * If the file that is requested to be created is in directories that do not
 * exist.
 * these directories are created. If the file already exists,
 * it is NOTMODIFIED.
 * Requires the `--allow-read` and `--allow-write` flag.
 */ export async function ensureFile(filePath) {
    try {
        // if file exists
        const stat = await Deno.lstat(filePath);
        if (!stat.isFile) {
            throw new Error(`Ensure path exists, expected 'file', got '${getFileInfoType(stat)}'`);
        }
    } catch (err) {
        // if file not exists
        if (err instanceof Deno.errors.NotFound) {
            // ensure dir exists
            await ensureDir(path.dirname(toPathString(filePath)));
            // create file
            await Deno.writeFile(filePath, new Uint8Array());
            return;
        }
        throw err;
    }
}
/**
 * Ensures that the file exists.
 * If the file that is requested to be created is in directories that do not
 * exist,
 * these directories are created. If the file already exists,
 * it is NOT MODIFIED.
 * Requires the `--allow-read` and `--allow-write` flag.
 */ export function ensureFileSync(filePath) {
    try {
        // if file exists
        const stat = Deno.lstatSync(filePath);
        if (!stat.isFile) {
            throw new Error(`Ensure path exists, expected 'file', got '${getFileInfoType(stat)}'`);
        }
    } catch (err) {
        // if file not exists
        if (err instanceof Deno.errors.NotFound) {
            // ensure dir exists
            ensureDirSync(path.dirname(toPathString(filePath)));
            // create file
            Deno.writeFileSync(filePath, new Uint8Array());
            return;
        }
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL2Vuc3VyZV9maWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjIgdGhlIERlbm8gYXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gTUlUIGxpY2Vuc2UuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCIuLi9wYXRoL21vZC50c1wiO1xuaW1wb3J0IHsgZW5zdXJlRGlyLCBlbnN1cmVEaXJTeW5jIH0gZnJvbSBcIi4vZW5zdXJlX2Rpci50c1wiO1xuaW1wb3J0IHsgZ2V0RmlsZUluZm9UeXBlLCB0b1BhdGhTdHJpbmcgfSBmcm9tIFwiLi9fdXRpbC50c1wiO1xuXG4vKipcbiAqIEVuc3VyZXMgdGhhdCB0aGUgZmlsZSBleGlzdHMuXG4gKiBJZiB0aGUgZmlsZSB0aGF0IGlzIHJlcXVlc3RlZCB0byBiZSBjcmVhdGVkIGlzIGluIGRpcmVjdG9yaWVzIHRoYXQgZG8gbm90XG4gKiBleGlzdC5cbiAqIHRoZXNlIGRpcmVjdG9yaWVzIGFyZSBjcmVhdGVkLiBJZiB0aGUgZmlsZSBhbHJlYWR5IGV4aXN0cyxcbiAqIGl0IGlzIE5PVE1PRElGSUVELlxuICogUmVxdWlyZXMgdGhlIGAtLWFsbG93LXJlYWRgIGFuZCBgLS1hbGxvdy13cml0ZWAgZmxhZy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZUZpbGUoZmlsZVBhdGg6IHN0cmluZyB8IFVSTCkge1xuICB0cnkge1xuICAgIC8vIGlmIGZpbGUgZXhpc3RzXG4gICAgY29uc3Qgc3RhdCA9IGF3YWl0IERlbm8ubHN0YXQoZmlsZVBhdGgpO1xuICAgIGlmICghc3RhdC5pc0ZpbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEVuc3VyZSBwYXRoIGV4aXN0cywgZXhwZWN0ZWQgJ2ZpbGUnLCBnb3QgJyR7Z2V0RmlsZUluZm9UeXBlKHN0YXQpfSdgLFxuICAgICAgKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIGlmIGZpbGUgbm90IGV4aXN0c1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkge1xuICAgICAgLy8gZW5zdXJlIGRpciBleGlzdHNcbiAgICAgIGF3YWl0IGVuc3VyZURpcihwYXRoLmRpcm5hbWUodG9QYXRoU3RyaW5nKGZpbGVQYXRoKSkpO1xuICAgICAgLy8gY3JlYXRlIGZpbGVcbiAgICAgIGF3YWl0IERlbm8ud3JpdGVGaWxlKGZpbGVQYXRoLCBuZXcgVWludDhBcnJheSgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aHJvdyBlcnI7XG4gIH1cbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgdGhlIGZpbGUgZXhpc3RzLlxuICogSWYgdGhlIGZpbGUgdGhhdCBpcyByZXF1ZXN0ZWQgdG8gYmUgY3JlYXRlZCBpcyBpbiBkaXJlY3RvcmllcyB0aGF0IGRvIG5vdFxuICogZXhpc3QsXG4gKiB0aGVzZSBkaXJlY3RvcmllcyBhcmUgY3JlYXRlZC4gSWYgdGhlIGZpbGUgYWxyZWFkeSBleGlzdHMsXG4gKiBpdCBpcyBOT1QgTU9ESUZJRUQuXG4gKiBSZXF1aXJlcyB0aGUgYC0tYWxsb3ctcmVhZGAgYW5kIGAtLWFsbG93LXdyaXRlYCBmbGFnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlRmlsZVN5bmMoZmlsZVBhdGg6IHN0cmluZyB8IFVSTCkge1xuICB0cnkge1xuICAgIC8vIGlmIGZpbGUgZXhpc3RzXG4gICAgY29uc3Qgc3RhdCA9IERlbm8ubHN0YXRTeW5jKGZpbGVQYXRoKTtcbiAgICBpZiAoIXN0YXQuaXNGaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFbnN1cmUgcGF0aCBleGlzdHMsIGV4cGVjdGVkICdmaWxlJywgZ290ICcke2dldEZpbGVJbmZvVHlwZShzdGF0KX0nYCxcbiAgICAgICk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBpZiBmaWxlIG5vdCBleGlzdHNcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuTm90Rm91bmQpIHtcbiAgICAgIC8vIGVuc3VyZSBkaXIgZXhpc3RzXG4gICAgICBlbnN1cmVEaXJTeW5jKHBhdGguZGlybmFtZSh0b1BhdGhTdHJpbmcoZmlsZVBhdGgpKSk7XG4gICAgICAvLyBjcmVhdGUgZmlsZVxuICAgICAgRGVuby53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBuZXcgVWludDhBcnJheSgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEVBQTBFO0FBQzFFLFlBQVksVUFBVSxpQkFBaUI7QUFDdkMsU0FBUyxTQUFTLEVBQUUsYUFBYSxRQUFRLGtCQUFrQjtBQUMzRCxTQUFTLGVBQWUsRUFBRSxZQUFZLFFBQVEsYUFBYTtBQUUzRDs7Ozs7OztDQU9DLEdBQ0QsT0FBTyxlQUFlLFdBQVcsUUFBc0IsRUFBRTtJQUN2RCxJQUFJO1FBQ0YsaUJBQWlCO1FBQ2pCLE1BQU0sT0FBTyxNQUFNLEtBQUssS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUNoQixNQUFNLElBQUksTUFDUixDQUFDLDBDQUEwQyxFQUFFLGdCQUFnQixNQUFNLENBQUMsQ0FBQyxFQUNyRTtRQUNKLENBQUM7SUFDSCxFQUFFLE9BQU8sS0FBSztRQUNaLHFCQUFxQjtRQUNyQixJQUFJLGVBQWUsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLG9CQUFvQjtZQUNwQixNQUFNLFVBQVUsS0FBSyxPQUFPLENBQUMsYUFBYTtZQUMxQyxjQUFjO1lBQ2QsTUFBTSxLQUFLLFNBQVMsQ0FBQyxVQUFVLElBQUk7WUFDbkM7UUFDRixDQUFDO1FBRUQsTUFBTSxJQUFJO0lBQ1o7QUFDRixDQUFDO0FBRUQ7Ozs7Ozs7Q0FPQyxHQUNELE9BQU8sU0FBUyxlQUFlLFFBQXNCLEVBQUU7SUFDckQsSUFBSTtRQUNGLGlCQUFpQjtRQUNqQixNQUFNLE9BQU8sS0FBSyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxNQUNSLENBQUMsMENBQTBDLEVBQUUsZ0JBQWdCLE1BQU0sQ0FBQyxDQUFDLEVBQ3JFO1FBQ0osQ0FBQztJQUNILEVBQUUsT0FBTyxLQUFLO1FBQ1oscUJBQXFCO1FBQ3JCLElBQUksZUFBZSxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDdkMsb0JBQW9CO1lBQ3BCLGNBQWMsS0FBSyxPQUFPLENBQUMsYUFBYTtZQUN4QyxjQUFjO1lBQ2QsS0FBSyxhQUFhLENBQUMsVUFBVSxJQUFJO1lBQ2pDO1FBQ0YsQ0FBQztRQUNELE1BQU0sSUFBSTtJQUNaO0FBQ0YsQ0FBQyJ9