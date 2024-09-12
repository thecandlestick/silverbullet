import { resolveImportMap, resolveModuleSpecifier, toFileUrl } from "./deps.ts";
import { load as nativeLoad } from "./src/native_loader.ts";
import { load as portableLoad } from "./src/portable_loader.ts";
/** The default loader to use. */ export const DEFAULT_LOADER = typeof Deno.run === "function" ? "native" : "portable";
export function denoPlugin(options = {}) {
    const loader = options.loader ?? DEFAULT_LOADER;
    return {
        name: "deno",
        setup (build) {
            const infoCache = new Map();
            let importMap = null;
            build.onStart(async function onStart() {
                if (options.importMapURL !== undefined) {
                    const resp = await fetch(options.importMapURL.href);
                    const txt = await resp.text();
                    importMap = resolveImportMap(JSON.parse(txt), options.importMapURL);
                } else {
                    importMap = null;
                }
            });
            build.onResolve({
                filter: /.*/
            }, function onResolve(args) {
                // console.log("To resolve", args.path);
                const resolveDir = args.resolveDir ? `${toFileUrl(args.resolveDir).href}/` : "";
                const referrer = args.importer || resolveDir;
                let resolved;
                if (importMap !== null) {
                    const res = resolveModuleSpecifier(args.path, importMap, new URL(referrer) || undefined);
                    resolved = new URL(res);
                } else {
                    resolved = new URL(args.path, referrer);
                }
                // console.log("Resolved", resolved.href);
                if (build.initialOptions.external) {
                    for (const external of build.initialOptions.external){
                        if (resolved.href.startsWith(external)) {
                            // console.log("Got external", args.path, resolved.href);
                            return {
                                path: resolved.href,
                                external: true
                            };
                        }
                    }
                }
                const href = resolved.href;
                // Don't use the deno loader for any of the specific loader file extensions
                const loaderExts = Object.keys(build.initialOptions.loader || {});
                for (const ext of loaderExts){
                    if (href.endsWith(ext)) {
                        console.log("Skipping", href);
                        return {
                            path: resolved.href.substring("file://".length)
                        };
                    }
                }
                return {
                    path: resolved.href,
                    namespace: "deno"
                };
            });
            build.onLoad({
                filter: /.*/
            }, function onLoad(args) {
                if (args.path.endsWith(".css")) {
                    return Promise.resolve(null);
                }
                const url = new URL(args.path);
                switch(loader){
                    case "native":
                        return nativeLoad(infoCache, url, options);
                    case "portable":
                        return portableLoad(url, options);
                }
            });
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L3BsdWdvcy9mb3JrZWQvZXNidWlsZF9kZW5vX2xvYWRlci9tb2QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgZXNidWlsZCxcbiAgSW1wb3J0TWFwLFxuICByZXNvbHZlSW1wb3J0TWFwLFxuICByZXNvbHZlTW9kdWxlU3BlY2lmaWVyLFxuICB0b0ZpbGVVcmwsXG59IGZyb20gXCIuL2RlcHMudHNcIjtcbmltcG9ydCB7IGxvYWQgYXMgbmF0aXZlTG9hZCB9IGZyb20gXCIuL3NyYy9uYXRpdmVfbG9hZGVyLnRzXCI7XG5pbXBvcnQgeyBsb2FkIGFzIHBvcnRhYmxlTG9hZCB9IGZyb20gXCIuL3NyYy9wb3J0YWJsZV9sb2FkZXIudHNcIjtcbmltcG9ydCB7IE1vZHVsZUVudHJ5IH0gZnJvbSBcIi4vc3JjL2Rlbm8udHNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBEZW5vUGx1Z2luT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBVUkwgdG8gYW4gaW1wb3J0IG1hcCB0byB1c2Ugd2hlbiByZXNvbHZpbmcgaW1wb3J0IHNwZWNpZmllcnMuXG4gICAqIFRoZSBVUkwgbXVzdCBiZSBmZXRjaGFibGUgd2l0aCBgZmV0Y2hgLlxuICAgKi9cbiAgaW1wb3J0TWFwVVJMPzogVVJMO1xuICAvKipcbiAgICogU3BlY2lmeSB3aGljaCBsb2FkZXIgdG8gdXNlLiBCeSBkZWZhdWx0IHRoaXMgd2lsbCB1c2UgdGhlIGBuYXRpdmVgIGxvYWRlcixcbiAgICogdW5sZXNzIGBEZW5vLnJ1bmAgaXMgbm90IGF2YWlsYWJsZS5cbiAgICpcbiAgICogLSBgbmF0aXZlYDogICAgIFNoZWxscyBvdXQgdG8gdGhlIERlbm8gZXhlY3VhdGJsZSB1bmRlciB0aGUgaG9vZCB0byBsb2FkXG4gICAqICAgICAgICAgICAgICAgICBmaWxlcy4gUmVxdWlyZXMgLS1hbGxvdy1yZWFkIGFuZCAtLWFsbG93LXJ1bi5cbiAgICogLSBgcG9ydGFibGVgOiAgIERvIG1vZHVsZSBkb3dubG9hZGluZyBhbmQgY2FjaGluZyB3aXRoIG9ubHkgV2ViIEFQSXMuXG4gICAqICAgICAgICAgICAgICAgICBSZXF1aXJlcyAtLWFsbG93LW5ldC5cbiAgICovXG4gIGxvYWRlcj86IFwibmF0aXZlXCIgfCBcInBvcnRhYmxlXCI7XG59XG5cbi8qKiBUaGUgZGVmYXVsdCBsb2FkZXIgdG8gdXNlLiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTE9BREVSOiBcIm5hdGl2ZVwiIHwgXCJwb3J0YWJsZVwiID1cbiAgdHlwZW9mIERlbm8ucnVuID09PSBcImZ1bmN0aW9uXCIgPyBcIm5hdGl2ZVwiIDogXCJwb3J0YWJsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVub1BsdWdpbihvcHRpb25zOiBEZW5vUGx1Z2luT3B0aW9ucyA9IHt9KTogZXNidWlsZC5QbHVnaW4ge1xuICBjb25zdCBsb2FkZXIgPSBvcHRpb25zLmxvYWRlciA/PyBERUZBVUxUX0xPQURFUjtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcImRlbm9cIixcbiAgICBzZXR1cChidWlsZCkge1xuICAgICAgY29uc3QgaW5mb0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIE1vZHVsZUVudHJ5PigpO1xuICAgICAgbGV0IGltcG9ydE1hcDogSW1wb3J0TWFwIHwgbnVsbCA9IG51bGw7XG5cbiAgICAgIGJ1aWxkLm9uU3RhcnQoYXN5bmMgZnVuY3Rpb24gb25TdGFydCgpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaW1wb3J0TWFwVVJMICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2gob3B0aW9ucy5pbXBvcnRNYXBVUkwuaHJlZik7XG4gICAgICAgICAgY29uc3QgdHh0ID0gYXdhaXQgcmVzcC50ZXh0KCk7XG4gICAgICAgICAgaW1wb3J0TWFwID0gcmVzb2x2ZUltcG9ydE1hcChKU09OLnBhcnNlKHR4dCksIG9wdGlvbnMuaW1wb3J0TWFwVVJMKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbXBvcnRNYXAgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYnVpbGQub25SZXNvbHZlKFxuICAgICAgICB7IGZpbHRlcjogLy4qLyB9LFxuICAgICAgICBmdW5jdGlvbiBvblJlc29sdmUoXG4gICAgICAgICAgYXJnczogZXNidWlsZC5PblJlc29sdmVBcmdzLFxuICAgICAgICApOiBlc2J1aWxkLk9uUmVzb2x2ZVJlc3VsdCB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVG8gcmVzb2x2ZVwiLCBhcmdzLnBhdGgpO1xuICAgICAgICAgIGNvbnN0IHJlc29sdmVEaXIgPSBhcmdzLnJlc29sdmVEaXJcbiAgICAgICAgICAgID8gYCR7dG9GaWxlVXJsKGFyZ3MucmVzb2x2ZURpcikuaHJlZn0vYFxuICAgICAgICAgICAgOiBcIlwiO1xuICAgICAgICAgIGNvbnN0IHJlZmVycmVyID0gYXJncy5pbXBvcnRlciB8fCByZXNvbHZlRGlyO1xuICAgICAgICAgIGxldCByZXNvbHZlZDogVVJMO1xuICAgICAgICAgIGlmIChpbXBvcnRNYXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IHJlc29sdmVNb2R1bGVTcGVjaWZpZXIoXG4gICAgICAgICAgICAgIGFyZ3MucGF0aCxcbiAgICAgICAgICAgICAgaW1wb3J0TWFwLFxuICAgICAgICAgICAgICBuZXcgVVJMKHJlZmVycmVyKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVzb2x2ZWQgPSBuZXcgVVJMKHJlcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmVkID0gbmV3IFVSTChhcmdzLnBhdGgsIHJlZmVycmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coXCJSZXNvbHZlZFwiLCByZXNvbHZlZC5ocmVmKTtcbiAgICAgICAgICBpZiAoYnVpbGQuaW5pdGlhbE9wdGlvbnMuZXh0ZXJuYWwpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXh0ZXJuYWwgb2YgYnVpbGQuaW5pdGlhbE9wdGlvbnMuZXh0ZXJuYWwpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc29sdmVkLmhyZWYuc3RhcnRzV2l0aChleHRlcm5hbCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdvdCBleHRlcm5hbFwiLCBhcmdzLnBhdGgsIHJlc29sdmVkLmhyZWYpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHBhdGg6IHJlc29sdmVkLmhyZWYsIGV4dGVybmFsOiB0cnVlIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaHJlZiA9IHJlc29sdmVkLmhyZWY7XG4gICAgICAgICAgLy8gRG9uJ3QgdXNlIHRoZSBkZW5vIGxvYWRlciBmb3IgYW55IG9mIHRoZSBzcGVjaWZpYyBsb2FkZXIgZmlsZSBleHRlbnNpb25zXG4gICAgICAgICAgY29uc3QgbG9hZGVyRXh0cyA9IE9iamVjdC5rZXlzKGJ1aWxkLmluaXRpYWxPcHRpb25zLmxvYWRlciB8fCB7fSk7XG4gICAgICAgICAgZm9yIChjb25zdCBleHQgb2YgbG9hZGVyRXh0cykge1xuICAgICAgICAgICAgaWYgKGhyZWYuZW5kc1dpdGgoZXh0KSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNraXBwaW5nXCIsIGhyZWYpO1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHBhdGg6IHJlc29sdmVkLmhyZWYuc3Vic3RyaW5nKFwiZmlsZTovL1wiLmxlbmd0aCksXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7IHBhdGg6IHJlc29sdmVkLmhyZWYsIG5hbWVzcGFjZTogXCJkZW5vXCIgfTtcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGJ1aWxkLm9uTG9hZChcbiAgICAgICAgeyBmaWx0ZXI6IC8uKi8gfSxcbiAgICAgICAgZnVuY3Rpb24gb25Mb2FkKFxuICAgICAgICAgIGFyZ3M6IGVzYnVpbGQuT25Mb2FkQXJncyxcbiAgICAgICAgKTogUHJvbWlzZTxlc2J1aWxkLk9uTG9hZFJlc3VsdCB8IG51bGw+IHtcbiAgICAgICAgICBpZiAoYXJncy5wYXRoLmVuZHNXaXRoKFwiLmNzc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChhcmdzLnBhdGgpO1xuICAgICAgICAgIHN3aXRjaCAobG9hZGVyKSB7XG4gICAgICAgICAgICBjYXNlIFwibmF0aXZlXCI6XG4gICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMb2FkKGluZm9DYWNoZSwgdXJsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIGNhc2UgXCJwb3J0YWJsZVwiOlxuICAgICAgICAgICAgICByZXR1cm4gcG9ydGFibGVMb2FkKHVybCwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9LFxuICB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBR0UsZ0JBQWdCLEVBQ2hCLHNCQUFzQixFQUN0QixTQUFTLFFBQ0osWUFBWTtBQUNuQixTQUFTLFFBQVEsVUFBVSxRQUFRLHlCQUF5QjtBQUM1RCxTQUFTLFFBQVEsWUFBWSxRQUFRLDJCQUEyQjtBQXFCaEUsK0JBQStCLEdBQy9CLE9BQU8sTUFBTSxpQkFDWCxPQUFPLEtBQUssR0FBRyxLQUFLLGFBQWEsV0FBVyxVQUFVLENBQUM7QUFFekQsT0FBTyxTQUFTLFdBQVcsVUFBNkIsQ0FBQyxDQUFDLEVBQWtCO0lBQzFFLE1BQU0sU0FBUyxRQUFRLE1BQU0sSUFBSTtJQUNqQyxPQUFPO1FBQ0wsTUFBTTtRQUNOLE9BQU0sS0FBSyxFQUFFO1lBQ1gsTUFBTSxZQUFZLElBQUk7WUFDdEIsSUFBSSxZQUE4QixJQUFJO1lBRXRDLE1BQU0sT0FBTyxDQUFDLGVBQWUsVUFBVTtnQkFDckMsSUFBSSxRQUFRLFlBQVksS0FBSyxXQUFXO29CQUN0QyxNQUFNLE9BQU8sTUFBTSxNQUFNLFFBQVEsWUFBWSxDQUFDLElBQUk7b0JBQ2xELE1BQU0sTUFBTSxNQUFNLEtBQUssSUFBSTtvQkFDM0IsWUFBWSxpQkFBaUIsS0FBSyxLQUFLLENBQUMsTUFBTSxRQUFRLFlBQVk7Z0JBQ3BFLE9BQU87b0JBQ0wsWUFBWSxJQUFJO2dCQUNsQixDQUFDO1lBQ0g7WUFFQSxNQUFNLFNBQVMsQ0FDYjtnQkFBRSxRQUFRO1lBQUssR0FDZixTQUFTLFVBQ1AsSUFBMkIsRUFDaUI7Z0JBQzVDLHdDQUF3QztnQkFDeEMsTUFBTSxhQUFhLEtBQUssVUFBVSxHQUM5QixDQUFDLEVBQUUsVUFBVSxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQ3JDLEVBQUU7Z0JBQ04sTUFBTSxXQUFXLEtBQUssUUFBUSxJQUFJO2dCQUNsQyxJQUFJO2dCQUNKLElBQUksY0FBYyxJQUFJLEVBQUU7b0JBQ3RCLE1BQU0sTUFBTSx1QkFDVixLQUFLLElBQUksRUFDVCxXQUNBLElBQUksSUFBSSxhQUFhO29CQUV2QixXQUFXLElBQUksSUFBSTtnQkFDckIsT0FBTztvQkFDTCxXQUFXLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDaEMsQ0FBQztnQkFDRCwwQ0FBMEM7Z0JBQzFDLElBQUksTUFBTSxjQUFjLENBQUMsUUFBUSxFQUFFO29CQUNqQyxLQUFLLE1BQU0sWUFBWSxNQUFNLGNBQWMsQ0FBQyxRQUFRLENBQUU7d0JBQ3BELElBQUksU0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVc7NEJBQ3RDLHlEQUF5RDs0QkFDekQsT0FBTztnQ0FBRSxNQUFNLFNBQVMsSUFBSTtnQ0FBRSxVQUFVLElBQUk7NEJBQUM7d0JBQy9DLENBQUM7b0JBQ0g7Z0JBQ0YsQ0FBQztnQkFDRCxNQUFNLE9BQU8sU0FBUyxJQUFJO2dCQUMxQiwyRUFBMkU7Z0JBQzNFLE1BQU0sYUFBYSxPQUFPLElBQUksQ0FBQyxNQUFNLGNBQWMsQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFDL0QsS0FBSyxNQUFNLE9BQU8sV0FBWTtvQkFDNUIsSUFBSSxLQUFLLFFBQVEsQ0FBQyxNQUFNO3dCQUN0QixRQUFRLEdBQUcsQ0FBQyxZQUFZO3dCQUN4QixPQUFPOzRCQUNMLE1BQU0sU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsTUFBTTt3QkFDaEQ7b0JBQ0YsQ0FBQztnQkFDSDtnQkFDQSxPQUFPO29CQUFFLE1BQU0sU0FBUyxJQUFJO29CQUFFLFdBQVc7Z0JBQU87WUFDbEQ7WUFHRixNQUFNLE1BQU0sQ0FDVjtnQkFBRSxRQUFRO1lBQUssR0FDZixTQUFTLE9BQ1AsSUFBd0IsRUFDYztnQkFDdEMsSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUztvQkFDOUIsT0FBTyxRQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUM3QixDQUFDO2dCQUNELE1BQU0sTUFBTSxJQUFJLElBQUksS0FBSyxJQUFJO2dCQUM3QixPQUFRO29CQUNOLEtBQUs7d0JBQ0gsT0FBTyxXQUFXLFdBQVcsS0FBSztvQkFDcEMsS0FBSzt3QkFDSCxPQUFPLGFBQWEsS0FBSztnQkFDN0I7WUFDRjtRQUVKO0lBQ0Y7QUFDRixDQUFDIn0=