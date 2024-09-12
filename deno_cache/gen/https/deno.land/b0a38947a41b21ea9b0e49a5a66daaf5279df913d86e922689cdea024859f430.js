// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { join } from "../path/mod.ts";
import { toPathString } from "./_util.ts";
/**
 * Ensures that a directory is empty.
 * Deletes directory contents if the directory is not empty.
 * If the directory does not exist, it is created.
 * The directory itself is not deleted.
 * Requires the `--allow-read` and `--allow-write` flag.
 */ export async function emptyDir(dir) {
    try {
        const items = [];
        for await (const dirEntry of Deno.readDir(dir)){
            items.push(dirEntry);
        }
        while(items.length){
            const item = items.shift();
            if (item && item.name) {
                const filepath = join(toPathString(dir), item.name);
                await Deno.remove(filepath, {
                    recursive: true
                });
            }
        }
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        // if not exist. then create it
        await Deno.mkdir(dir, {
            recursive: true
        });
    }
}
/**
 * Ensures that a directory is empty.
 * Deletes directory contents if the directory is not empty.
 * If the directory does not exist, it is created.
 * The directory itself is not deleted.
 * Requires the `--allow-read` and `--allow-write` flag.
 */ export function emptyDirSync(dir) {
    try {
        const items = [
            ...Deno.readDirSync(dir)
        ];
        // If the directory exists, remove all entries inside it.
        while(items.length){
            const item = items.shift();
            if (item && item.name) {
                const filepath = join(toPathString(dir), item.name);
                Deno.removeSync(filepath, {
                    recursive: true
                });
            }
        }
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        // if not exist. then create it
        Deno.mkdirSync(dir, {
            recursive: true
        });
        return;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL2VtcHR5X2Rpci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDIyIHRoZSBEZW5vIGF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIE1JVCBsaWNlbnNlLlxuaW1wb3J0IHsgam9pbiB9IGZyb20gXCIuLi9wYXRoL21vZC50c1wiO1xuaW1wb3J0IHsgdG9QYXRoU3RyaW5nIH0gZnJvbSBcIi4vX3V0aWwudHNcIjtcblxuLyoqXG4gKiBFbnN1cmVzIHRoYXQgYSBkaXJlY3RvcnkgaXMgZW1wdHkuXG4gKiBEZWxldGVzIGRpcmVjdG9yeSBjb250ZW50cyBpZiB0aGUgZGlyZWN0b3J5IGlzIG5vdCBlbXB0eS5cbiAqIElmIHRoZSBkaXJlY3RvcnkgZG9lcyBub3QgZXhpc3QsIGl0IGlzIGNyZWF0ZWQuXG4gKiBUaGUgZGlyZWN0b3J5IGl0c2VsZiBpcyBub3QgZGVsZXRlZC5cbiAqIFJlcXVpcmVzIHRoZSBgLS1hbGxvdy1yZWFkYCBhbmQgYC0tYWxsb3ctd3JpdGVgIGZsYWcuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlbXB0eURpcihkaXI6IHN0cmluZyB8IFVSTCkge1xuICB0cnkge1xuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgZm9yIGF3YWl0IChjb25zdCBkaXJFbnRyeSBvZiBEZW5vLnJlYWREaXIoZGlyKSkge1xuICAgICAgaXRlbXMucHVzaChkaXJFbnRyeSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zLnNoaWZ0KCk7XG4gICAgICBpZiAoaXRlbSAmJiBpdGVtLm5hbWUpIHtcbiAgICAgICAgY29uc3QgZmlsZXBhdGggPSBqb2luKHRvUGF0aFN0cmluZyhkaXIpLCBpdGVtLm5hbWUpO1xuICAgICAgICBhd2FpdCBEZW5vLnJlbW92ZShmaWxlcGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICAvLyBpZiBub3QgZXhpc3QuIHRoZW4gY3JlYXRlIGl0XG4gICAgYXdhaXQgRGVuby5ta2RpcihkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICB9XG59XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IGEgZGlyZWN0b3J5IGlzIGVtcHR5LlxuICogRGVsZXRlcyBkaXJlY3RvcnkgY29udGVudHMgaWYgdGhlIGRpcmVjdG9yeSBpcyBub3QgZW1wdHkuXG4gKiBJZiB0aGUgZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0LCBpdCBpcyBjcmVhdGVkLlxuICogVGhlIGRpcmVjdG9yeSBpdHNlbGYgaXMgbm90IGRlbGV0ZWQuXG4gKiBSZXF1aXJlcyB0aGUgYC0tYWxsb3ctcmVhZGAgYW5kIGAtLWFsbG93LXdyaXRlYCBmbGFnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlEaXJTeW5jKGRpcjogc3RyaW5nIHwgVVJMKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4uRGVuby5yZWFkRGlyU3luYyhkaXIpXTtcblxuICAgIC8vIElmIHRoZSBkaXJlY3RvcnkgZXhpc3RzLCByZW1vdmUgYWxsIGVudHJpZXMgaW5zaWRlIGl0LlxuICAgIHdoaWxlIChpdGVtcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtcy5zaGlmdCgpO1xuICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5uYW1lKSB7XG4gICAgICAgIGNvbnN0IGZpbGVwYXRoID0gam9pbih0b1BhdGhTdHJpbmcoZGlyKSwgaXRlbS5uYW1lKTtcbiAgICAgICAgRGVuby5yZW1vdmVTeW5jKGZpbGVwYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmICghKGVyciBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLk5vdEZvdW5kKSkge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgICAvLyBpZiBub3QgZXhpc3QuIHRoZW4gY3JlYXRlIGl0XG4gICAgRGVuby5ta2RpclN5bmMoZGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICByZXR1cm47XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwRUFBMEU7QUFDMUUsU0FBUyxJQUFJLFFBQVEsaUJBQWlCO0FBQ3RDLFNBQVMsWUFBWSxRQUFRLGFBQWE7QUFFMUM7Ozs7OztDQU1DLEdBQ0QsT0FBTyxlQUFlLFNBQVMsR0FBaUIsRUFBRTtJQUNoRCxJQUFJO1FBQ0YsTUFBTSxRQUFRLEVBQUU7UUFDaEIsV0FBVyxNQUFNLFlBQVksS0FBSyxPQUFPLENBQUMsS0FBTTtZQUM5QyxNQUFNLElBQUksQ0FBQztRQUNiO1FBRUEsTUFBTyxNQUFNLE1BQU0sQ0FBRTtZQUNuQixNQUFNLE9BQU8sTUFBTSxLQUFLO1lBQ3hCLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDckIsTUFBTSxXQUFXLEtBQUssYUFBYSxNQUFNLEtBQUssSUFBSTtnQkFDbEQsTUFBTSxLQUFLLE1BQU0sQ0FBQyxVQUFVO29CQUFFLFdBQVcsSUFBSTtnQkFBQztZQUNoRCxDQUFDO1FBQ0g7SUFDRixFQUFFLE9BQU8sS0FBSztRQUNaLElBQUksQ0FBQyxDQUFDLGVBQWUsS0FBSyxNQUFNLENBQUMsUUFBUSxHQUFHO1lBQzFDLE1BQU0sSUFBSTtRQUNaLENBQUM7UUFFRCwrQkFBK0I7UUFDL0IsTUFBTSxLQUFLLEtBQUssQ0FBQyxLQUFLO1lBQUUsV0FBVyxJQUFJO1FBQUM7SUFDMUM7QUFDRixDQUFDO0FBRUQ7Ozs7OztDQU1DLEdBQ0QsT0FBTyxTQUFTLGFBQWEsR0FBaUIsRUFBRTtJQUM5QyxJQUFJO1FBQ0YsTUFBTSxRQUFRO2VBQUksS0FBSyxXQUFXLENBQUM7U0FBSztRQUV4Qyx5REFBeUQ7UUFDekQsTUFBTyxNQUFNLE1BQU0sQ0FBRTtZQUNuQixNQUFNLE9BQU8sTUFBTSxLQUFLO1lBQ3hCLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDckIsTUFBTSxXQUFXLEtBQUssYUFBYSxNQUFNLEtBQUssSUFBSTtnQkFDbEQsS0FBSyxVQUFVLENBQUMsVUFBVTtvQkFBRSxXQUFXLElBQUk7Z0JBQUM7WUFDOUMsQ0FBQztRQUNIO0lBQ0YsRUFBRSxPQUFPLEtBQUs7UUFDWixJQUFJLENBQUMsQ0FBQyxlQUFlLEtBQUssTUFBTSxDQUFDLFFBQVEsR0FBRztZQUMxQyxNQUFNLElBQUk7UUFDWixDQUFDO1FBQ0QsK0JBQStCO1FBQy9CLEtBQUssU0FBUyxDQUFDLEtBQUs7WUFBRSxXQUFXLElBQUk7UUFBQztRQUN0QztJQUNGO0FBQ0YsQ0FBQyJ9