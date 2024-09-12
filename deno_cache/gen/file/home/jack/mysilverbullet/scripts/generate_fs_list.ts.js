import { walk } from "https://deno.land/std@0.165.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.165.0/path/mod.ts";
import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts";
const rootDir = resolve("website_build/fs");
const allFiles = [];
for await (const file of walk(rootDir, {
    includeDirs: false,
    // Exclude hidden files
    skip: [
        /^.*\/\..+$/
    ]
})){
    const fullPath = file.path;
    const s = await Deno.stat(fullPath);
    allFiles.push({
        name: fullPath.substring(rootDir.length + 1),
        lastModified: 1,
        contentType: mime.getType(fullPath) || "application/octet-stream",
        size: s.size,
        perm: "ro"
    });
}
console.log(JSON.stringify(allFiles, null, 2));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L3NjcmlwdHMvZ2VuZXJhdGVfZnNfbGlzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZpbGVNZXRhIH0gZnJvbSBcIi4uL2NvbW1vbi90eXBlcy50c1wiO1xuXG5pbXBvcnQgeyB3YWxrIH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjE2NS4wL2ZzL21vZC50c1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xNjUuMC9wYXRoL21vZC50c1wiO1xuaW1wb3J0IHsgbWltZSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC94L21pbWV0eXBlc0B2MS4wLjAvbW9kLnRzXCI7XG5cbmNvbnN0IHJvb3REaXIgPSByZXNvbHZlKFwid2Vic2l0ZV9idWlsZC9mc1wiKTtcblxuY29uc3QgYWxsRmlsZXM6IEZpbGVNZXRhW10gPSBbXTtcbmZvciBhd2FpdCAoXG4gIGNvbnN0IGZpbGUgb2Ygd2Fsayhyb290RGlyLCB7XG4gICAgaW5jbHVkZURpcnM6IGZhbHNlLFxuICAgIC8vIEV4Y2x1ZGUgaGlkZGVuIGZpbGVzXG4gICAgc2tpcDogWy9eLipcXC9cXC4uKyQvXSxcbiAgfSlcbikge1xuICBjb25zdCBmdWxsUGF0aCA9IGZpbGUucGF0aDtcbiAgY29uc3QgcyA9IGF3YWl0IERlbm8uc3RhdChmdWxsUGF0aCk7XG4gIGFsbEZpbGVzLnB1c2goe1xuICAgIG5hbWU6IGZ1bGxQYXRoLnN1YnN0cmluZyhyb290RGlyLmxlbmd0aCArIDEpLFxuICAgIGxhc3RNb2RpZmllZDogMSxcbiAgICBjb250ZW50VHlwZTogbWltZS5nZXRUeXBlKGZ1bGxQYXRoKSB8fCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgIHNpemU6IHMuc2l6ZSxcbiAgICBwZXJtOiBcInJvXCIsXG4gIH0pO1xufVxuY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYWxsRmlsZXMsIG51bGwsIDIpKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxTQUFTLElBQUksUUFBUSwwQ0FBMEM7QUFDL0QsU0FBUyxPQUFPLFFBQVEsNENBQTRDO0FBQ3BFLFNBQVMsSUFBSSxRQUFRLDhDQUE4QztBQUVuRSxNQUFNLFVBQVUsUUFBUTtBQUV4QixNQUFNLFdBQXVCLEVBQUU7QUFDL0IsV0FDRSxNQUFNLFFBQVEsS0FBSyxTQUFTO0lBQzFCLGFBQWEsS0FBSztJQUNsQix1QkFBdUI7SUFDdkIsTUFBTTtRQUFDO0tBQWE7QUFDdEIsR0FDQTtJQUNBLE1BQU0sV0FBVyxLQUFLLElBQUk7SUFDMUIsTUFBTSxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUM7SUFDMUIsU0FBUyxJQUFJLENBQUM7UUFDWixNQUFNLFNBQVMsU0FBUyxDQUFDLFFBQVEsTUFBTSxHQUFHO1FBQzFDLGNBQWM7UUFDZCxhQUFhLEtBQUssT0FBTyxDQUFDLGFBQWE7UUFDdkMsTUFBTSxFQUFFLElBQUk7UUFDWixNQUFNO0lBQ1I7QUFDRjtBQUNBLFFBQVEsR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLFVBQVUsSUFBSSxFQUFFIn0=