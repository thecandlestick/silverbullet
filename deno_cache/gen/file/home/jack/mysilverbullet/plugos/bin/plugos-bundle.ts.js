// The recommended way to use this for now is through `silverbullet bundle:build` until
// we fork out PlugOS as a whole
import { YAML } from "../../common/deps.ts";
import { compile, esbuild, sandboxCompileModule } from "../compile.ts";
import { cacheDir, flags, path } from "../deps.ts";
import { bundleAssets } from "../asset_bundle/builder.ts";
export async function bundle(manifestPath, options = {}) {
    const rootPath = path.dirname(manifestPath);
    const manifest = YAML.parse(await Deno.readTextFile(manifestPath));
    if (!manifest.name) {
        throw new Error(`Missing 'name' in ${manifestPath}`);
    }
    // Dependencies
    for (const [name, moduleSpec] of Object.entries(manifest.dependencies || {})){
        manifest.dependencies[name] = await sandboxCompileModule(moduleSpec);
    }
    // Assets
    const assetsBundle = await bundleAssets(path.resolve(rootPath), manifest.assets || []);
    manifest.assets = assetsBundle.toJSON();
    // Imports
    // Imports currently only "import" dependencies at this point, importing means: assume they're preloaded so we don't need to bundle them
    const plugCache = path.join(cacheDir(), "plugos-imports");
    await Deno.mkdir(plugCache, {
        recursive: true
    });
    // console.log("Cache dir", plugCache);
    const imports = [];
    for (const manifestUrl of manifest.imports || []){
        // Safe file name
        const cachedManifestPath = manifestUrl.replaceAll(/[^a-zA-Z0-9]/g, "_");
        try {
            if (options.reload) {
                throw new Error("Forced reload");
            }
            // Try to just load from the cache
            const cachedManifest = JSON.parse(await Deno.readTextFile(path.join(plugCache, cachedManifestPath)));
            imports.push(cachedManifest);
        } catch  {
            // Otherwise, download and cache
            console.log("Caching plug", manifestUrl, "to", plugCache);
            const cachedManifest = await (await fetch(manifestUrl)).json();
            await Deno.writeTextFile(path.join(plugCache, cachedManifestPath), JSON.stringify(cachedManifest));
            imports.push(cachedManifest);
        }
    }
    // Functions
    for (const def of Object.values(manifest.functions || {})){
        if (!def.path) {
            continue;
        }
        let jsFunctionName = "default", filePath = def.path;
        if (filePath.indexOf(":") !== -1) {
            [filePath, jsFunctionName] = filePath.split(":");
        }
        // Resolve path
        filePath = path.join(rootPath, filePath);
        def.code = await compile(filePath, jsFunctionName, {
            ...options,
            imports: [
                manifest,
                ...imports,
                // This is mostly for testing
                ...options.imports || []
            ]
        });
        delete def.path;
    }
    return manifest;
}
async function buildManifest(manifestPath, distPath, options = {}) {
    const generatedManifest = await bundle(manifestPath, options);
    const outFile = manifestPath.substring(0, manifestPath.length - path.extname(manifestPath).length) + ".json";
    const outPath = path.join(distPath, path.basename(outFile));
    console.log("Emitting bundle to", outPath);
    await Deno.writeTextFile(outPath, JSON.stringify(generatedManifest, null, 2));
    return {
        generatedManifest,
        outPath
    };
}
export async function bundleRun(manifestFiles, dist, watch, options = {}) {
    let building = false;
    async function buildAll() {
        if (building) {
            return;
        }
        console.log("Building", manifestFiles);
        building = true;
        Deno.mkdirSync(dist, {
            recursive: true
        });
        const startTime = Date.now();
        // Build all plugs in parallel
        await Promise.all(manifestFiles.map(async (plugManifestPath)=>{
            const manifestPath = plugManifestPath;
            try {
                await buildManifest(manifestPath, dist, options);
            } catch (e) {
                console.error(`Error building ${manifestPath}:`, e);
            }
        }));
        console.log(`Done building plugs in ${Date.now() - startTime}ms`);
        building = false;
    }
    await buildAll();
    if (watch) {
        console.log("Watching for changes...");
        const watcher = Deno.watchFs(manifestFiles.map((p)=>path.dirname(p)));
        for await (const event of watcher){
            if (event.paths.length > 0) {
                if (event.paths[0].endsWith(".json")) {
                    continue;
                }
            }
            console.log("Change detected, rebuilding...");
            buildAll();
        }
    }
}
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
    if (args._.length === 0) {
        console.log("Usage: plugos-bundle [--debug] [--reload] [--dist <path>] [--info] [--importmap import_map.json] [--exclude=package1,package2] <manifest.plug.yaml> <manifest2.plug.yaml> ...");
        Deno.exit(1);
    }
    if (!args.dist) {
        args.dist = path.resolve(".");
    }
    await bundleRun(args._, args.dist, args.watch, {
        debug: args.debug,
        reload: args.reload,
        info: args.info,
        importMap: args.importmap ? new URL(args.importmap, `file://${Deno.cwd()}/`) : undefined
    });
    esbuild.stop();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L3BsdWdvcy9iaW4vcGx1Z29zLWJ1bmRsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVjb21tZW5kZWQgd2F5IHRvIHVzZSB0aGlzIGZvciBub3cgaXMgdGhyb3VnaCBgc2lsdmVyYnVsbGV0IGJ1bmRsZTpidWlsZGAgdW50aWxcbi8vIHdlIGZvcmsgb3V0IFBsdWdPUyBhcyBhIHdob2xlXG5cbmltcG9ydCB7IE1hbmlmZXN0IH0gZnJvbSBcIi4uL3R5cGVzLnRzXCI7XG5pbXBvcnQgeyBZQU1MIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9kZXBzLnRzXCI7XG5pbXBvcnQge1xuICBjb21waWxlLFxuICBDb21waWxlT3B0aW9ucyxcbiAgZXNidWlsZCxcbiAgc2FuZGJveENvbXBpbGVNb2R1bGUsXG59IGZyb20gXCIuLi9jb21waWxlLnRzXCI7XG5pbXBvcnQgeyBjYWNoZURpciwgZmxhZ3MsIHBhdGggfSBmcm9tIFwiLi4vZGVwcy50c1wiO1xuXG5pbXBvcnQgeyBidW5kbGVBc3NldHMgfSBmcm9tIFwiLi4vYXNzZXRfYnVuZGxlL2J1aWxkZXIudHNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bmRsZShcbiAgbWFuaWZlc3RQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IENvbXBpbGVPcHRpb25zID0ge30sXG4pOiBQcm9taXNlPE1hbmlmZXN0PGFueT4+IHtcbiAgY29uc3Qgcm9vdFBhdGggPSBwYXRoLmRpcm5hbWUobWFuaWZlc3RQYXRoKTtcbiAgY29uc3QgbWFuaWZlc3QgPSBZQU1MLnBhcnNlKFxuICAgIGF3YWl0IERlbm8ucmVhZFRleHRGaWxlKG1hbmlmZXN0UGF0aCksXG4gICkgYXMgTWFuaWZlc3Q8YW55PjtcblxuICBpZiAoIW1hbmlmZXN0Lm5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgJ25hbWUnIGluICR7bWFuaWZlc3RQYXRofWApO1xuICB9XG5cbiAgLy8gRGVwZW5kZW5jaWVzXG4gIGZvciAoXG4gICAgY29uc3QgW25hbWUsIG1vZHVsZVNwZWNdIG9mIE9iamVjdC5lbnRyaWVzKG1hbmlmZXN0LmRlcGVuZGVuY2llcyB8fCB7fSlcbiAgKSB7XG4gICAgbWFuaWZlc3QuZGVwZW5kZW5jaWVzIVtuYW1lXSA9IGF3YWl0IHNhbmRib3hDb21waWxlTW9kdWxlKG1vZHVsZVNwZWMpO1xuICB9XG5cbiAgLy8gQXNzZXRzXG4gIGNvbnN0IGFzc2V0c0J1bmRsZSA9IGF3YWl0IGJ1bmRsZUFzc2V0cyhcbiAgICBwYXRoLnJlc29sdmUocm9vdFBhdGgpLFxuICAgIG1hbmlmZXN0LmFzc2V0cyBhcyBzdHJpbmdbXSB8fCBbXSxcbiAgKTtcbiAgbWFuaWZlc3QuYXNzZXRzID0gYXNzZXRzQnVuZGxlLnRvSlNPTigpO1xuXG4gIC8vIEltcG9ydHNcbiAgLy8gSW1wb3J0cyBjdXJyZW50bHkgb25seSBcImltcG9ydFwiIGRlcGVuZGVuY2llcyBhdCB0aGlzIHBvaW50LCBpbXBvcnRpbmcgbWVhbnM6IGFzc3VtZSB0aGV5J3JlIHByZWxvYWRlZCBzbyB3ZSBkb24ndCBuZWVkIHRvIGJ1bmRsZSB0aGVtXG4gIGNvbnN0IHBsdWdDYWNoZSA9IHBhdGguam9pbihjYWNoZURpcigpISwgXCJwbHVnb3MtaW1wb3J0c1wiKTtcbiAgYXdhaXQgRGVuby5ta2RpcihwbHVnQ2FjaGUsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAvLyBjb25zb2xlLmxvZyhcIkNhY2hlIGRpclwiLCBwbHVnQ2FjaGUpO1xuICBjb25zdCBpbXBvcnRzOiBNYW5pZmVzdDxhbnk+W10gPSBbXTtcbiAgZm9yIChjb25zdCBtYW5pZmVzdFVybCBvZiBtYW5pZmVzdC5pbXBvcnRzIHx8IFtdKSB7XG4gICAgLy8gU2FmZSBmaWxlIG5hbWVcbiAgICBjb25zdCBjYWNoZWRNYW5pZmVzdFBhdGggPSBtYW5pZmVzdFVybC5yZXBsYWNlQWxsKC9bXmEtekEtWjAtOV0vZywgXCJfXCIpO1xuICAgIHRyeSB7XG4gICAgICBpZiAob3B0aW9ucy5yZWxvYWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRm9yY2VkIHJlbG9hZFwiKTtcbiAgICAgIH1cbiAgICAgIC8vIFRyeSB0byBqdXN0IGxvYWQgZnJvbSB0aGUgY2FjaGVcbiAgICAgIGNvbnN0IGNhY2hlZE1hbmlmZXN0ID0gSlNPTi5wYXJzZShcbiAgICAgICAgYXdhaXQgRGVuby5yZWFkVGV4dEZpbGUocGF0aC5qb2luKHBsdWdDYWNoZSwgY2FjaGVkTWFuaWZlc3RQYXRoKSksXG4gICAgICApIGFzIE1hbmlmZXN0PGFueT47XG4gICAgICBpbXBvcnRzLnB1c2goY2FjaGVkTWFuaWZlc3QpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBkb3dubG9hZCBhbmQgY2FjaGVcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2FjaGluZyBwbHVnXCIsIG1hbmlmZXN0VXJsLCBcInRvXCIsIHBsdWdDYWNoZSk7XG4gICAgICBjb25zdCBjYWNoZWRNYW5pZmVzdCA9IGF3YWl0IChhd2FpdCBmZXRjaChtYW5pZmVzdFVybCkpXG4gICAgICAgIC5qc29uKCkgYXMgTWFuaWZlc3Q8YW55PjtcbiAgICAgIGF3YWl0IERlbm8ud3JpdGVUZXh0RmlsZShcbiAgICAgICAgcGF0aC5qb2luKHBsdWdDYWNoZSwgY2FjaGVkTWFuaWZlc3RQYXRoKSxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoY2FjaGVkTWFuaWZlc3QpLFxuICAgICAgKTtcbiAgICAgIGltcG9ydHMucHVzaChjYWNoZWRNYW5pZmVzdCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRnVuY3Rpb25zXG4gIGZvciAoY29uc3QgZGVmIG9mIE9iamVjdC52YWx1ZXMobWFuaWZlc3QuZnVuY3Rpb25zIHx8IHt9KSkge1xuICAgIGlmICghZGVmLnBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBsZXQganNGdW5jdGlvbk5hbWUgPSBcImRlZmF1bHRcIixcbiAgICAgIGZpbGVQYXRoOiBzdHJpbmcgPSBkZWYucGF0aDtcbiAgICBpZiAoZmlsZVBhdGguaW5kZXhPZihcIjpcIikgIT09IC0xKSB7XG4gICAgICBbZmlsZVBhdGgsIGpzRnVuY3Rpb25OYW1lXSA9IGZpbGVQYXRoLnNwbGl0KFwiOlwiKTtcbiAgICB9XG4gICAgLy8gUmVzb2x2ZSBwYXRoXG4gICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocm9vdFBhdGgsIGZpbGVQYXRoKTtcblxuICAgIGRlZi5jb2RlID0gYXdhaXQgY29tcGlsZShcbiAgICAgIGZpbGVQYXRoLFxuICAgICAganNGdW5jdGlvbk5hbWUsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICBtYW5pZmVzdCxcbiAgICAgICAgICAuLi5pbXBvcnRzLFxuICAgICAgICAgIC8vIFRoaXMgaXMgbW9zdGx5IGZvciB0ZXN0aW5nXG4gICAgICAgICAgLi4ub3B0aW9ucy5pbXBvcnRzIHx8IFtdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICAgIGRlbGV0ZSBkZWYucGF0aDtcbiAgfVxuICByZXR1cm4gbWFuaWZlc3Q7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkTWFuaWZlc3QoXG4gIG1hbmlmZXN0UGF0aDogc3RyaW5nLFxuICBkaXN0UGF0aDogc3RyaW5nLFxuICBvcHRpb25zOiBDb21waWxlT3B0aW9ucyA9IHt9LFxuKSB7XG4gIGNvbnN0IGdlbmVyYXRlZE1hbmlmZXN0ID0gYXdhaXQgYnVuZGxlKG1hbmlmZXN0UGF0aCwgb3B0aW9ucyk7XG4gIGNvbnN0IG91dEZpbGUgPSBtYW5pZmVzdFBhdGguc3Vic3RyaW5nKFxuICAgIDAsXG4gICAgbWFuaWZlc3RQYXRoLmxlbmd0aCAtIHBhdGguZXh0bmFtZShtYW5pZmVzdFBhdGgpLmxlbmd0aCxcbiAgKSArIFwiLmpzb25cIjtcbiAgY29uc3Qgb3V0UGF0aCA9IHBhdGguam9pbihkaXN0UGF0aCwgcGF0aC5iYXNlbmFtZShvdXRGaWxlKSk7XG4gIGNvbnNvbGUubG9nKFwiRW1pdHRpbmcgYnVuZGxlIHRvXCIsIG91dFBhdGgpO1xuICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUob3V0UGF0aCwgSlNPTi5zdHJpbmdpZnkoZ2VuZXJhdGVkTWFuaWZlc3QsIG51bGwsIDIpKTtcbiAgcmV0dXJuIHsgZ2VuZXJhdGVkTWFuaWZlc3QsIG91dFBhdGggfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bmRsZVJ1bihcbiAgbWFuaWZlc3RGaWxlczogc3RyaW5nW10sXG4gIGRpc3Q6IHN0cmluZyxcbiAgd2F0Y2g6IGJvb2xlYW4sXG4gIG9wdGlvbnM6IENvbXBpbGVPcHRpb25zID0ge30sXG4pIHtcbiAgbGV0IGJ1aWxkaW5nID0gZmFsc2U7XG4gIGFzeW5jIGZ1bmN0aW9uIGJ1aWxkQWxsKCkge1xuICAgIGlmIChidWlsZGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcIkJ1aWxkaW5nXCIsIG1hbmlmZXN0RmlsZXMpO1xuICAgIGJ1aWxkaW5nID0gdHJ1ZTtcbiAgICBEZW5vLm1rZGlyU3luYyhkaXN0LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIC8vIEJ1aWxkIGFsbCBwbHVncyBpbiBwYXJhbGxlbFxuICAgIGF3YWl0IFByb21pc2UuYWxsKG1hbmlmZXN0RmlsZXMubWFwKGFzeW5jIChwbHVnTWFuaWZlc3RQYXRoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdFBhdGggPSBwbHVnTWFuaWZlc3RQYXRoIGFzIHN0cmluZztcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGJ1aWxkTWFuaWZlc3QoXG4gICAgICAgICAgbWFuaWZlc3RQYXRoLFxuICAgICAgICAgIGRpc3QsXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgYnVpbGRpbmcgJHttYW5pZmVzdFBhdGh9OmAsIGUpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgICBjb25zb2xlLmxvZyhgRG9uZSBidWlsZGluZyBwbHVncyBpbiAke0RhdGUubm93KCkgLSBzdGFydFRpbWV9bXNgKTtcbiAgICBidWlsZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgYXdhaXQgYnVpbGRBbGwoKTtcblxuICBpZiAod2F0Y2gpIHtcbiAgICBjb25zb2xlLmxvZyhcIldhdGNoaW5nIGZvciBjaGFuZ2VzLi4uXCIpO1xuICAgIGNvbnN0IHdhdGNoZXIgPSBEZW5vLndhdGNoRnMobWFuaWZlc3RGaWxlcy5tYXAoKHApID0+IHBhdGguZGlybmFtZShwKSkpO1xuICAgIGZvciBhd2FpdCAoY29uc3QgZXZlbnQgb2Ygd2F0Y2hlcikge1xuICAgICAgaWYgKGV2ZW50LnBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKGV2ZW50LnBhdGhzWzBdLmVuZHNXaXRoKFwiLmpzb25cIikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2UgZGV0ZWN0ZWQsIHJlYnVpbGRpbmcuLi5cIik7XG4gICAgICBidWlsZEFsbCgpO1xuICAgIH1cbiAgfVxufVxuXG5pZiAoaW1wb3J0Lm1ldGEubWFpbikge1xuICBjb25zdCBhcmdzID0gZmxhZ3MucGFyc2UoRGVuby5hcmdzLCB7XG4gICAgYm9vbGVhbjogW1wiZGVidWdcIiwgXCJ3YXRjaFwiLCBcInJlbG9hZFwiLCBcImluZm9cIl0sXG4gICAgc3RyaW5nOiBbXCJkaXN0XCIsIFwiaW1wb3J0bWFwXCJdLFxuICAgIGFsaWFzOiB7IHc6IFwid2F0Y2hcIiB9LFxuICB9KTtcblxuICBpZiAoYXJncy5fLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJVc2FnZTogcGx1Z29zLWJ1bmRsZSBbLS1kZWJ1Z10gWy0tcmVsb2FkXSBbLS1kaXN0IDxwYXRoPl0gWy0taW5mb10gWy0taW1wb3J0bWFwIGltcG9ydF9tYXAuanNvbl0gWy0tZXhjbHVkZT1wYWNrYWdlMSxwYWNrYWdlMl0gPG1hbmlmZXN0LnBsdWcueWFtbD4gPG1hbmlmZXN0Mi5wbHVnLnlhbWw+IC4uLlwiLFxuICAgICk7XG4gICAgRGVuby5leGl0KDEpO1xuICB9XG5cbiAgaWYgKCFhcmdzLmRpc3QpIHtcbiAgICBhcmdzLmRpc3QgPSBwYXRoLnJlc29sdmUoXCIuXCIpO1xuICB9XG5cbiAgYXdhaXQgYnVuZGxlUnVuKFxuICAgIGFyZ3MuXyBhcyBzdHJpbmdbXSxcbiAgICBhcmdzLmRpc3QsXG4gICAgYXJncy53YXRjaCxcbiAgICB7XG4gICAgICBkZWJ1ZzogYXJncy5kZWJ1ZyxcbiAgICAgIHJlbG9hZDogYXJncy5yZWxvYWQsXG4gICAgICBpbmZvOiBhcmdzLmluZm8sXG4gICAgICBpbXBvcnRNYXA6IGFyZ3MuaW1wb3J0bWFwXG4gICAgICAgID8gbmV3IFVSTChhcmdzLmltcG9ydG1hcCwgYGZpbGU6Ly8ke0Rlbm8uY3dkKCl9L2ApXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICk7XG4gIGVzYnVpbGQuc3RvcCgpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVGQUF1RjtBQUN2RixnQ0FBZ0M7QUFHaEMsU0FBUyxJQUFJLFFBQVEsdUJBQXVCO0FBQzVDLFNBQ0UsT0FBTyxFQUVQLE9BQU8sRUFDUCxvQkFBb0IsUUFDZixnQkFBZ0I7QUFDdkIsU0FBUyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksUUFBUSxhQUFhO0FBRW5ELFNBQVMsWUFBWSxRQUFRLDZCQUE2QjtBQUUxRCxPQUFPLGVBQWUsT0FDcEIsWUFBb0IsRUFDcEIsVUFBMEIsQ0FBQyxDQUFDLEVBQ0o7SUFDeEIsTUFBTSxXQUFXLEtBQUssT0FBTyxDQUFDO0lBQzlCLE1BQU0sV0FBVyxLQUFLLEtBQUssQ0FDekIsTUFBTSxLQUFLLFlBQVksQ0FBQztJQUcxQixJQUFJLENBQUMsU0FBUyxJQUFJ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