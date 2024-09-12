import { globToRegExp, path, walk } from "../deps.ts";
import { AssetBundle } from "./bundle.ts";
export async function bundleAssets(rootPath, patterns) {
    const bundle = new AssetBundle();
    if (patterns.length === 0) {
        return bundle;
    }
    const matchRegexes = patterns.map((pat)=>globToRegExp(pat));
    for await (const file of walk(rootPath)){
        const cleanPath = file.path.substring(rootPath.length + 1);
        let match = false;
        // console.log("Considering", rootPath, file.path, cleanPath);
        for (const matchRegex of matchRegexes){
            if (matchRegex.test(cleanPath)) {
                match = true;
                break;
            }
        }
        if (match) {
            bundle.writeFileSync(cleanPath, await Deno.readFile(file.path));
        }
    }
    return bundle;
}
export async function bundleFolder(rootPath, bundlePath) {
    const bundle = new AssetBundle();
    await Deno.mkdir(path.dirname(bundlePath), {
        recursive: true
    });
    for await (const { path: filePath  } of walk(rootPath, {
        includeDirs: false
    })){
        console.log("Bundling", filePath);
        const cleanPath = filePath.substring(`${rootPath}/`.length);
        bundle.writeFileSync(cleanPath, await Deno.readFile(filePath));
    }
    await Deno.writeTextFile(bundlePath, JSON.stringify(bundle.toJSON(), null, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L3BsdWdvcy9hc3NldF9idW5kbGUvYnVpbGRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnbG9iVG9SZWdFeHAsIHBhdGgsIHdhbGsgfSBmcm9tIFwiLi4vZGVwcy50c1wiO1xuaW1wb3J0IHsgQXNzZXRCdW5kbGUgfSBmcm9tIFwiLi9idW5kbGUudHNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bmRsZUFzc2V0cyhcbiAgcm9vdFBhdGg6IHN0cmluZyxcbiAgcGF0dGVybnM6IHN0cmluZ1tdLFxuKTogUHJvbWlzZTxBc3NldEJ1bmRsZT4ge1xuICBjb25zdCBidW5kbGUgPSBuZXcgQXNzZXRCdW5kbGUoKTtcbiAgaWYgKHBhdHRlcm5zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBidW5kbGU7XG4gIH1cbiAgY29uc3QgbWF0Y2hSZWdleGVzID0gcGF0dGVybnMubWFwKChwYXQpID0+IGdsb2JUb1JlZ0V4cChwYXQpKTtcbiAgZm9yIGF3YWl0IChcbiAgICBjb25zdCBmaWxlIG9mIHdhbGsocm9vdFBhdGgpXG4gICkge1xuICAgIGNvbnN0IGNsZWFuUGF0aCA9IGZpbGUucGF0aC5zdWJzdHJpbmcocm9vdFBhdGgubGVuZ3RoICsgMSk7XG4gICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgLy8gY29uc29sZS5sb2coXCJDb25zaWRlcmluZ1wiLCByb290UGF0aCwgZmlsZS5wYXRoLCBjbGVhblBhdGgpO1xuICAgIGZvciAoY29uc3QgbWF0Y2hSZWdleCBvZiBtYXRjaFJlZ2V4ZXMpIHtcbiAgICAgIGlmIChtYXRjaFJlZ2V4LnRlc3QoY2xlYW5QYXRoKSkge1xuICAgICAgICBtYXRjaCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGJ1bmRsZS53cml0ZUZpbGVTeW5jKGNsZWFuUGF0aCwgYXdhaXQgRGVuby5yZWFkRmlsZShmaWxlLnBhdGgpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ1bmRsZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bmRsZUZvbGRlcihyb290UGF0aDogc3RyaW5nLCBidW5kbGVQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgYnVuZGxlID0gbmV3IEFzc2V0QnVuZGxlKCk7XG4gIGF3YWl0IERlbm8ubWtkaXIocGF0aC5kaXJuYW1lKGJ1bmRsZVBhdGgpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgZm9yIGF3YWl0IChcbiAgICBjb25zdCB7IHBhdGg6IGZpbGVQYXRoIH0gb2Ygd2Fsayhyb290UGF0aCwgeyBpbmNsdWRlRGlyczogZmFsc2UgfSlcbiAgKSB7XG4gICAgY29uc29sZS5sb2coXCJCdW5kbGluZ1wiLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgY2xlYW5QYXRoID0gZmlsZVBhdGguc3Vic3RyaW5nKGAke3Jvb3RQYXRofS9gLmxlbmd0aCk7XG4gICAgYnVuZGxlLndyaXRlRmlsZVN5bmMoY2xlYW5QYXRoLCBhd2FpdCBEZW5vLnJlYWRGaWxlKGZpbGVQYXRoKSk7XG4gIH1cbiAgYXdhaXQgRGVuby53cml0ZVRleHRGaWxlKFxuICAgIGJ1bmRsZVBhdGgsXG4gICAgSlNPTi5zdHJpbmdpZnkoYnVuZGxlLnRvSlNPTigpLCBudWxsLCAyKSxcbiAgKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxRQUFRLGFBQWE7QUFDdEQsU0FBUyxXQUFXLFFBQVEsY0FBYztBQUUxQyxPQUFPLGVBQWUsYUFDcEIsUUFBZ0IsRUFDaEIsUUFBa0IsRUFDSTtJQUN0QixNQUFNLFNBQVMsSUFBSTtJQUNuQixJQUFJLFNBQVMsTUFBTSxLQUFLLEdBQUc7UUFDekIsT0FBTztJQUNULENBQUM7SUFDRCxNQUFNLGVBQWUsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFRLGFBQWE7SUFDeEQsV0FDRSxNQUFNLFFBQVEsS0FBSyxVQUNuQjtRQUNBLE1BQU0sWUFBWSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxNQUFNLEdBQUc7UUFDeEQsSUFBSSxRQUFRLEtBQUs7UUFDakIsOERBQThEO1FBQzlELEtBQUssTUFBTSxjQUFjLGFBQWM7WUFDckMsSUFBSSxXQUFXLElBQUksQ0FBQyxZQUFZO2dCQUM5QixRQUFRLElBQUk7Z0JBQ1osS0FBTTtZQUNSLENBQUM7UUFDSDtRQUNBLElBQUksT0FBTztZQUNULE9BQU8sYUFBYSxDQUFDLFdBQVcsTUFBTSxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUk7UUFDL0QsQ0FBQztJQUNIO0lBQ0EsT0FBTztBQUNULENBQUM7QUFFRCxPQUFPLGVBQWUsYUFBYSxRQUFnQixFQUFFLFVBQWtCLEVBQUU7SUFDdkUsTUFBTSxTQUFTLElBQUk7SUFDbkIsTUFBTSxLQUFLLEtBQUssQ0FBQyxLQUFLLE9BQU8sQ0FBQyxhQUFhO1FBQUUsV0FBVyxJQUFJO0lBQUM7SUFDN0QsV0FDRSxNQUFNLEVBQUUsTUFBTSxTQUFRLEVBQUUsSUFBSSxLQUFLLFVBQVU7UUFBRSxhQUFhLEtBQUs7SUFBQyxHQUNoRTtRQUNBLFFBQVEsR0FBRyxDQUFDLFlBQVk7UUFDeEIsTUFBTSxZQUFZLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU07UUFDMUQsT0FBTyxhQUFhLENBQUMsV0FBVyxNQUFNLEtBQUssUUFBUSxDQUFDO0lBQ3REO0lBQ0EsTUFBTSxLQUFLLGFBQWEsQ0FDdEIsWUFDQSxLQUFLLFNBQVMsQ0FBQyxPQUFPLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFFMUMsQ0FBQyJ9