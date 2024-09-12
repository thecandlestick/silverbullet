import { expandGlobSync, flags, path } from "./plugos/deps.ts";
import { bundleRun } from "./plugos/bin/plugos-bundle.ts";
import { esbuild } from "./plugos/compile.ts";
if (import.meta.main) {
    const args = flags.parse(Deno.args, {
        boolean: [
            "debug",
            "watch",
            "reload",
            "info"
        ],
        string: [
            "dist",
            "importmap"
        ],
        alias: {
            w: "watch"
        }
    });
    if (!args.dist) {
        args.dist = path.resolve(path.join("dist_bundle", "_plug"));
    }
    const manifests = [];
    const pattern = path.join("plugs", "*", "*.plug.yaml");
    for (const file of expandGlobSync(pattern)){
        manifests.push(file.path);
    }
    await bundleRun(manifests, args.dist, args.watch, {
        debug: args.debug,
        reload: args.reload,
        info: args.info,
        importMap: args.importmap ? new URL(args.importmap, `file://${Deno.cwd()}/`) : undefined
    });
    esbuild.stop();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L2J1aWxkX3BsdWdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGFuZEdsb2JTeW5jLCBmbGFncywgcGF0aCB9IGZyb20gXCIuL3BsdWdvcy9kZXBzLnRzXCI7XG5pbXBvcnQgeyBidW5kbGVSdW4gfSBmcm9tIFwiLi9wbHVnb3MvYmluL3BsdWdvcy1idW5kbGUudHNcIjtcbmltcG9ydCB7IGVzYnVpbGQgfSBmcm9tIFwiLi9wbHVnb3MvY29tcGlsZS50c1wiO1xuXG5pZiAoaW1wb3J0Lm1ldGEubWFpbikge1xuICBjb25zdCBhcmdzID0gZmxhZ3MucGFyc2UoRGVuby5hcmdzLCB7XG4gICAgYm9vbGVhbjogW1wiZGVidWdcIiwgXCJ3YXRjaFwiLCBcInJlbG9hZFwiLCBcImluZm9cIl0sXG4gICAgc3RyaW5nOiBbXCJkaXN0XCIsIFwiaW1wb3J0bWFwXCJdLFxuICAgIGFsaWFzOiB7IHc6IFwid2F0Y2hcIiB9LFxuICB9KTtcblxuICBpZiAoIWFyZ3MuZGlzdCkge1xuICAgIGFyZ3MuZGlzdCA9IHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oXCJkaXN0X2J1bmRsZVwiLCBcIl9wbHVnXCIpKTtcbiAgfVxuXG4gIGNvbnN0IG1hbmlmZXN0czogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgcGF0dGVybjogc3RyaW5nID0gcGF0aC5qb2luKFwicGx1Z3NcIiwgXCIqXCIsIFwiKi5wbHVnLnlhbWxcIik7XG4gIGZvciAoY29uc3QgZmlsZSBvZiBleHBhbmRHbG9iU3luYyhwYXR0ZXJuKSkge1xuICAgIG1hbmlmZXN0cy5wdXNoKGZpbGUucGF0aCk7XG4gIH1cblxuICBhd2FpdCBidW5kbGVSdW4oXG4gICAgbWFuaWZlc3RzLFxuICAgIGFyZ3MuZGlzdCxcbiAgICBhcmdzLndhdGNoLFxuICAgIHtcbiAgICAgIGRlYnVnOiBhcmdzLmRlYnVnLFxuICAgICAgcmVsb2FkOiBhcmdzLnJlbG9hZCxcbiAgICAgIGluZm86IGFyZ3MuaW5mbyxcbiAgICAgIGltcG9ydE1hcDogYXJncy5pbXBvcnRtYXBcbiAgICAgICAgPyBuZXcgVVJMKGFyZ3MuaW1wb3J0bWFwLCBgZmlsZTovLyR7RGVuby5jd2QoKX0vYClcbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgKTtcbiAgZXNidWlsZC5zdG9wKCk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksUUFBUSxtQkFBbUI7QUFDL0QsU0FBUyxTQUFTLFFBQVEsZ0NBQWdDO0FBQzFELFNBQVMsT0FBTyxRQUFRLHNCQUFzQjtBQUU5QyxJQUFJLFlBQVksSUFBSSxFQUFFO0lBQ3BCLE1BQU0sT0FBTyxNQUFNLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNsQyxTQUFTO1lBQUM7WUFBUztZQUFTO1lBQVU7U0FBTztRQUM3QyxRQUFRO1lBQUM7WUFBUTtTQUFZO1FBQzdCLE9BQU87WUFBRSxHQUFHO1FBQVE7SUFDdEI7SUFFQSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDZCxLQUFLLElBQUksR0FBRyxLQUFLLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFlO0lBQ3BELENBQUM7SUFFRCxNQUFNLFlBQXNCLEVBQUU7SUFDOUIsTUFBTSxVQUFrQixLQUFLLElBQUksQ0FBQyxTQUFTLEtBQUs7SUFDaEQsS0FBSyxNQUFNLFFBQVEsZUFBZSxTQUFVO1FBQzFDLFVBQVUsSUFBSSxDQUFDLEtBQUssSUFBSTtJQUMxQjtJQUVBLE1BQU0sVUFDSixXQUNBLEtBQUssSUFBSSxFQUNULEtBQUssS0FBSyxFQUNWO1FBQ0UsT0FBTyxLQUFLLEtBQUs7UUFDakIsUUFBUSxLQUFLLE1BQU07UUFDbkIsTUFBTSxLQUFLLElBQUk7UUFDZixXQUFXLEtBQUssU0FBUyxHQUNyQixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQy9DLFNBQVM7SUFDZjtJQUVGLFFBQVEsSUFBSTtBQUNkLENBQUMifQ==