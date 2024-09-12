// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { isSubdir } from "./_util.ts";
const EXISTS_ERROR = new Deno.errors.AlreadyExists("dest already exists.");
/** Moves a file or directory */ export async function move(src, dest, { overwrite =false  } = {}) {
    const srcStat = await Deno.stat(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (overwrite) {
        try {
            await Deno.remove(dest, {
                recursive: true
            });
        } catch (error) {
            if (!(error instanceof Deno.errors.NotFound)) {
                throw error;
            }
        }
    } else {
        try {
            await Deno.lstat(dest);
            return Promise.reject(EXISTS_ERROR);
        } catch  {
        // Do nothing...
        }
    }
    await Deno.rename(src, dest);
    return;
}
/** Moves a file or directory synchronously */ export function moveSync(src, dest, { overwrite =false  } = {}) {
    const srcStat = Deno.statSync(src);
    if (srcStat.isDirectory && isSubdir(src, dest)) {
        throw new Error(`Cannot move '${src}' to a subdirectory of itself, '${dest}'.`);
    }
    if (overwrite) {
        try {
            Deno.removeSync(dest, {
                recursive: true
            });
        } catch (error) {
            if (!(error instanceof Deno.errors.NotFound)) {
                throw error;
            }
        }
    } else {
        try {
            Deno.lstatSync(dest);
            throw EXISTS_ERROR;
        } catch (error) {
            if (error === EXISTS_ERROR) {
                throw error;
            }
        }
    }
    Deno.renameSync(src, dest);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL21vdmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyMiB0aGUgRGVubyBhdXRob3JzLiBBbGwgcmlnaHRzIHJlc2VydmVkLiBNSVQgbGljZW5zZS5cbmltcG9ydCB7IGlzU3ViZGlyIH0gZnJvbSBcIi4vX3V0aWwudHNcIjtcblxuY29uc3QgRVhJU1RTX0VSUk9SID0gbmV3IERlbm8uZXJyb3JzLkFscmVhZHlFeGlzdHMoXCJkZXN0IGFscmVhZHkgZXhpc3RzLlwiKTtcblxuaW50ZXJmYWNlIE1vdmVPcHRpb25zIHtcbiAgb3ZlcndyaXRlPzogYm9vbGVhbjtcbn1cblxuLyoqIE1vdmVzIGEgZmlsZSBvciBkaXJlY3RvcnkgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtb3ZlKFxuICBzcmM6IHN0cmluZyB8IFVSTCxcbiAgZGVzdDogc3RyaW5nIHwgVVJMLFxuICB7IG92ZXJ3cml0ZSA9IGZhbHNlIH06IE1vdmVPcHRpb25zID0ge30sXG4pIHtcbiAgY29uc3Qgc3JjU3RhdCA9IGF3YWl0IERlbm8uc3RhdChzcmMpO1xuXG4gIGlmIChzcmNTdGF0LmlzRGlyZWN0b3J5ICYmIGlzU3ViZGlyKHNyYywgZGVzdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgQ2Fubm90IG1vdmUgJyR7c3JjfScgdG8gYSBzdWJkaXJlY3Rvcnkgb2YgaXRzZWxmLCAnJHtkZXN0fScuYCxcbiAgICApO1xuICB9XG5cbiAgaWYgKG92ZXJ3cml0ZSkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBEZW5vLnJlbW92ZShkZXN0LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBEZW5vLmxzdGF0KGRlc3QpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KEVYSVNUU19FUlJPUik7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBEbyBub3RoaW5nLi4uXG4gICAgfVxuICB9XG5cbiAgYXdhaXQgRGVuby5yZW5hbWUoc3JjLCBkZXN0KTtcblxuICByZXR1cm47XG59XG5cbi8qKiBNb3ZlcyBhIGZpbGUgb3IgZGlyZWN0b3J5IHN5bmNocm9ub3VzbHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlU3luYyhcbiAgc3JjOiBzdHJpbmcgfCBVUkwsXG4gIGRlc3Q6IHN0cmluZyB8IFVSTCxcbiAgeyBvdmVyd3JpdGUgPSBmYWxzZSB9OiBNb3ZlT3B0aW9ucyA9IHt9LFxuKSB7XG4gIGNvbnN0IHNyY1N0YXQgPSBEZW5vLnN0YXRTeW5jKHNyYyk7XG5cbiAgaWYgKHNyY1N0YXQuaXNEaXJlY3RvcnkgJiYgaXNTdWJkaXIoc3JjLCBkZXN0KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBDYW5ub3QgbW92ZSAnJHtzcmN9JyB0byBhIHN1YmRpcmVjdG9yeSBvZiBpdHNlbGYsICcke2Rlc3R9Jy5gLFxuICAgICk7XG4gIH1cblxuICBpZiAob3ZlcndyaXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIERlbm8ucmVtb3ZlU3luYyhkZXN0LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBEZW5vLmxzdGF0U3luYyhkZXN0KTtcbiAgICAgIHRocm93IEVYSVNUU19FUlJPUjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yID09PSBFWElTVFNfRVJST1IpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgRGVuby5yZW5hbWVTeW5jKHNyYywgZGVzdCk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMEVBQTBFO0FBQzFFLFNBQVMsUUFBUSxRQUFRLGFBQWE7QUFFdEMsTUFBTSxlQUFlLElBQUksS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDO0FBTW5ELDhCQUE4QixHQUM5QixPQUFPLGVBQWUsS0FDcEIsR0FBaUIsRUFDakIsSUFBa0IsRUFDbEIsRUFBRSxXQUFZLEtBQUssQ0FBQSxFQUFlLEdBQUcsQ0FBQyxDQUFDLEVBQ3ZDO0lBQ0EsTUFBTSxVQUFVLE1BQU0sS0FBSyxJQUFJLENBQUM7SUFFaEMsSUFBSSxRQUFRLFdBQVcsSUFBSSxTQUFTLEtBQUssT0FBTztRQUM5QyxNQUFNLElBQUksTUFDUixDQUFDLGFBQWEsRUFBRSxJQUFJLGdDQUFnQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQzlEO0lBQ0osQ0FBQztJQUVELElBQUksV0FBVztRQUNiLElBQUk7WUFDRixNQUFNLEtBQUssTUFBTSxDQUFDLE1BQU07Z0JBQUUsV0FBVyxJQUFJO1lBQUM7UUFDNUMsRUFBRSxPQUFPLE9BQU87WUFDZCxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsS0FBSyxNQUFNLENBQUMsUUFBUSxHQUFHO2dCQUM1QyxNQUFNLE1BQU07WUFDZCxDQUFDO1FBQ0g7SUFDRixPQUFPO1FBQ0wsSUFBSTtZQUNGLE1BQU0sS0FBSyxLQUFLLENBQUM7WUFDakIsT0FBTyxRQUFRLE1BQU0sQ0FBQztRQUN4QixFQUFFLE9BQU07UUFDTixnQkFBZ0I7UUFDbEI7SUFDRixDQUFDO0lBRUQsTUFBTSxLQUFLLE1BQU0sQ0FBQyxLQUFLO0lBRXZCO0FBQ0YsQ0FBQztBQUVELDRDQUE0QyxHQUM1QyxPQUFPLFNBQVMsU0FDZCxHQUFpQixFQUNqQixJQUFrQixFQUNsQixFQUFFLFdBQVksS0FBSyxDQUFBLEVBQWUsR0FBRyxDQUFDLENBQUMsRUFDdkM7SUFDQSxNQUFNLFVBQVUsS0FBSyxRQUFRLENBQUM7SUFFOUIsSUFBSSxRQUFRLFdBQVcsSUFBSSxTQUFTLEtBQUssT0FBTztRQUM5QyxNQUFNLElBQUksTUFDUixDQUFDLGFBQWEsRUFBRSxJQUFJLGdDQUFnQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQzlEO0lBQ0osQ0FBQztJQUVELElBQUksV0FBVztRQUNiLElBQUk7WUFDRixLQUFLLFVBQVUsQ0FBQyxNQUFNO2dCQUFFLFdBQVcsSUFBSTtZQUFDO1FBQzFDLEVBQUUsT0FBTyxPQUFPO1lBQ2QsSUFBSSxDQUFDLENBQUMsaUJBQWlCLEtBQUssTUFBTSxDQUFDLFFBQVEsR0FBRztnQkFDNUMsTUFBTSxNQUFNO1lBQ2QsQ0FBQztRQUNIO0lBQ0YsT0FBTztRQUNMLElBQUk7WUFDRixLQUFLLFNBQVMsQ0FBQztZQUNmLE1BQU0sYUFBYTtRQUNyQixFQUFFLE9BQU8sT0FBTztZQUNkLElBQUksVUFBVSxjQUFjO2dCQUMxQixNQUFNLE1BQU07WUFDZCxDQUFDO1FBQ0g7SUFDRixDQUFDO0lBRUQsS0FBSyxVQUFVLENBQUMsS0FBSztBQUN2QixDQUFDIn0=