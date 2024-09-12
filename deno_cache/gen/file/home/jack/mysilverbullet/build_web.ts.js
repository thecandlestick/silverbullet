// -- esbuild --
// @deno-types="https://deno.land/x/esbuild@v0.14.54/mod.d.ts"
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.14.54/wasm.js";
import * as esbuildNative from "https://deno.land/x/esbuild@v0.14.54/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts"; //"./esbuild_deno_loader/mod.ts";
import { copy } from "https://deno.land/std@0.165.0/fs/copy.ts";
import sass from "https://deno.land/x/denosass@1.0.4/mod.ts";
import { bundleFolder } from "./plugos/asset_bundle/builder.ts";
import { patchDenoLibJS } from "./plugos/hack.ts";
import { bundle as plugOsBundle } from "./plugos/bin/plugos-bundle.ts";
import * as flags from "https://deno.land/std@0.165.0/flags/mod.ts";
// @ts-ignore trust me
export const esbuild = Deno.run === undefined ? esbuildWasm : esbuildNative;
export async function prepareAssets(dist) {
    await copy("web/fonts", `${dist}`, {
        overwrite: true
    });
    await copy("web/index.html", `${dist}/index.html`, {
        overwrite: true
    });
    await copy("web/auth.html", `${dist}/auth.html`, {
        overwrite: true
    });
    await copy("web/images/favicon.png", `${dist}/favicon.png`, {
        overwrite: true
    });
    await copy("web/images/logo.png", `${dist}/logo.png`, {
        overwrite: true
    });
    await copy("web/manifest.json", `${dist}/manifest.json`, {
        overwrite: true
    });
    const compiler = sass(Deno.readTextFileSync("web/styles/main.scss"), {
        load_paths: [
            "web/styles"
        ]
    });
    await Deno.writeTextFile(`${dist}/main.css`, compiler.to_string("expanded"));
    const globalManifest = await plugOsBundle("./plugs/global.plug.yaml");
    await Deno.writeTextFile(`${dist}/global.plug.json`, JSON.stringify(globalManifest, null, 2));
    // HACK: Patch the JS by removing an invalid regex
    let bundleJs = await Deno.readTextFile(`${dist}/client.js`);
    bundleJs = patchDenoLibJS(bundleJs);
    await Deno.writeTextFile(`${dist}/client.js`, bundleJs);
}
export async function bundle(watch, type, distDir) {
    let building = false;
    await doBuild(`${type}/boot.ts`);
    let timer;
    if (watch) {
        const watcher = Deno.watchFs([
            type,
            "dist_bundle/_plug"
        ]);
        for await (const _event of watcher){
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(()=>{
                console.log("Change detected, rebuilding...");
                doBuild(`${type}/boot.ts`);
            }, 1000);
        }
    }
    async function doBuild(mainScript) {
        if (building) {
            return;
        }
        building = true;
        if (type === "mobile") {
            await bundleFolder("dist_bundle", "dist/asset_bundle.json");
        }
        await Promise.all([
            esbuild.build({
                entryPoints: {
                    client: mainScript,
                    service_worker: "web/service_worker.ts",
                    worker: "plugos/environments/sandbox_worker.ts"
                },
                outdir: distDir,
                absWorkingDir: Deno.cwd(),
                bundle: true,
                treeShaking: true,
                sourcemap: "linked",
                minify: true,
                jsxFactory: "h",
                jsx: "automatic",
                jsxFragment: "Fragment",
                jsxImportSource: "https://esm.sh/preact@10.11.1",
                plugins: [
                    denoPlugin({
                        importMapURL: new URL("./import_map.json", import.meta.url)
                    })
                ]
            })
        ]);
        await prepareAssets(distDir);
        if (type === "web") {
            await bundleFolder("dist_bundle", "dist/asset_bundle.json");
        }
        building = false;
        console.log("Built!");
    }
}
if (import.meta.main) {
    const args = flags.parse(Deno.args, {
        boolean: [
            "watch"
        ],
        alias: {
            w: "watch"
        },
        default: {
            watch: false
        }
    });
    await bundle(args.watch, "web", "dist_bundle/web");
    if (!args.watch) {
        esbuild.stop();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9qYWNrL215c2lsdmVyYnVsbGV0L2J1aWxkX3dlYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtLSBlc2J1aWxkIC0tXG4vLyBAZGVuby10eXBlcz1cImh0dHBzOi8vZGVuby5sYW5kL3gvZXNidWlsZEB2MC4xNC41NC9tb2QuZC50c1wiXG5pbXBvcnQgKiBhcyBlc2J1aWxkV2FzbSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQveC9lc2J1aWxkQHYwLjE0LjU0L3dhc20uanNcIjtcbmltcG9ydCAqIGFzIGVzYnVpbGROYXRpdmUgZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3gvZXNidWlsZEB2MC4xNC41NC9tb2QuanNcIjtcbmltcG9ydCB7IGRlbm9QbHVnaW4gfSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQveC9lc2J1aWxkX2Rlbm9fbG9hZGVyQDAuNi4wL21vZC50c1wiOyAvL1wiLi9lc2J1aWxkX2Rlbm9fbG9hZGVyL21vZC50c1wiO1xuaW1wb3J0IHsgY29weSB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xNjUuMC9mcy9jb3B5LnRzXCI7XG5cbmltcG9ydCBzYXNzIGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC94L2Rlbm9zYXNzQDEuMC40L21vZC50c1wiO1xuaW1wb3J0IHsgYnVuZGxlRm9sZGVyIH0gZnJvbSBcIi4vcGx1Z29zL2Fzc2V0X2J1bmRsZS9idWlsZGVyLnRzXCI7XG5pbXBvcnQgeyBwYXRjaERlbm9MaWJKUyB9IGZyb20gXCIuL3BsdWdvcy9oYWNrLnRzXCI7XG5pbXBvcnQgeyBidW5kbGUgYXMgcGx1Z09zQnVuZGxlIH0gZnJvbSBcIi4vcGx1Z29zL2Jpbi9wbHVnb3MtYnVuZGxlLnRzXCI7XG5cbmltcG9ydCAqIGFzIGZsYWdzIGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xNjUuMC9mbGFncy9tb2QudHNcIjtcblxuLy8gQHRzLWlnbm9yZSB0cnVzdCBtZVxuZXhwb3J0IGNvbnN0IGVzYnVpbGQ6IHR5cGVvZiBlc2J1aWxkV2FzbSA9IERlbm8ucnVuID09PSB1bmRlZmluZWRcbiAgPyBlc2J1aWxkV2FzbVxuICA6IGVzYnVpbGROYXRpdmU7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwcmVwYXJlQXNzZXRzKGRpc3Q6IHN0cmluZykge1xuICBhd2FpdCBjb3B5KFwid2ViL2ZvbnRzXCIsIGAke2Rpc3R9YCwgeyBvdmVyd3JpdGU6IHRydWUgfSk7XG4gIGF3YWl0IGNvcHkoXCJ3ZWIvaW5kZXguaHRtbFwiLCBgJHtkaXN0fS9pbmRleC5odG1sYCwge1xuICAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgfSk7XG4gIGF3YWl0IGNvcHkoXCJ3ZWIvYXV0aC5odG1sXCIsIGAke2Rpc3R9L2F1dGguaHRtbGAsIHtcbiAgICBvdmVyd3JpdGU6IHRydWUsXG4gIH0pO1xuICBhd2FpdCBjb3B5KFwid2ViL2ltYWdlcy9mYXZpY29uLnBuZ1wiLCBgJHtkaXN0fS9mYXZpY29uLnBuZ2AsIHtcbiAgICBvdmVyd3JpdGU6IHRydWUsXG4gIH0pO1xuICBhd2FpdCBjb3B5KFwid2ViL2ltYWdlcy9sb2dvLnBuZ1wiLCBgJHtkaXN0fS9sb2dvLnBuZ2AsIHtcbiAgICBvdmVyd3JpdGU6IHRydWUsXG4gIH0pO1xuICBhd2FpdCBjb3B5KFwid2ViL21hbmlmZXN0Lmpzb25cIiwgYCR7ZGlzdH0vbWFuaWZlc3QuanNvbmAsIHtcbiAgICBvdmVyd3JpdGU6IHRydWUsXG4gIH0pO1xuICBjb25zdCBjb21waWxlciA9IHNhc3MoXG4gICAgRGVuby5yZWFkVGV4dEZpbGVTeW5jKFwid2ViL3N0eWxlcy9tYWluLnNjc3NcIiksXG4gICAge1xuICAgICAgbG9hZF9wYXRoczogW1wid2ViL3N0eWxlc1wiXSxcbiAgICB9LFxuICApO1xuICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoXG4gICAgYCR7ZGlzdH0vbWFpbi5jc3NgLFxuICAgIGNvbXBpbGVyLnRvX3N0cmluZyhcImV4cGFuZGVkXCIpIGFzIHN0cmluZyxcbiAgKTtcbiAgY29uc3QgZ2xvYmFsTWFuaWZlc3QgPSBhd2FpdCBwbHVnT3NCdW5kbGUoXCIuL3BsdWdzL2dsb2JhbC5wbHVnLnlhbWxcIik7XG4gIGF3YWl0IERlbm8ud3JpdGVUZXh0RmlsZShcbiAgICBgJHtkaXN0fS9nbG9iYWwucGx1Zy5qc29uYCxcbiAgICBKU09OLnN0cmluZ2lmeShnbG9iYWxNYW5pZmVzdCwgbnVsbCwgMiksXG4gICk7XG5cbiAgLy8gSEFDSzogUGF0Y2ggdGhlIEpTIGJ5IHJlbW92aW5nIGFuIGludmFsaWQgcmVnZXhcbiAgbGV0IGJ1bmRsZUpzID0gYXdhaXQgRGVuby5yZWFkVGV4dEZpbGUoYCR7ZGlzdH0vY2xpZW50LmpzYCk7XG4gIGJ1bmRsZUpzID0gcGF0Y2hEZW5vTGliSlMoYnVuZGxlSnMpO1xuICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoYCR7ZGlzdH0vY2xpZW50LmpzYCwgYnVuZGxlSnMpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVuZGxlKFxuICB3YXRjaDogYm9vbGVhbixcbiAgdHlwZTogXCJ3ZWJcIiB8IFwibW9iaWxlXCIsXG4gIGRpc3REaXI6IHN0cmluZyxcbik6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgYnVpbGRpbmcgPSBmYWxzZTtcbiAgYXdhaXQgZG9CdWlsZChgJHt0eXBlfS9ib290LnRzYCk7XG4gIGxldCB0aW1lcjtcbiAgaWYgKHdhdGNoKSB7XG4gICAgY29uc3Qgd2F0Y2hlciA9IERlbm8ud2F0Y2hGcyhbdHlwZSwgXCJkaXN0X2J1bmRsZS9fcGx1Z1wiXSk7XG4gICAgZm9yIGF3YWl0IChjb25zdCBfZXZlbnQgb2Ygd2F0Y2hlcikge1xuICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB9XG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5nZSBkZXRlY3RlZCwgcmVidWlsZGluZy4uLlwiKTtcbiAgICAgICAgZG9CdWlsZChgJHt0eXBlfS9ib290LnRzYCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkb0J1aWxkKFxuICAgIG1haW5TY3JpcHQ6IHN0cmluZyxcbiAgKSB7XG4gICAgaWYgKGJ1aWxkaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGJ1aWxkaW5nID0gdHJ1ZTtcbiAgICBpZiAodHlwZSA9PT0gXCJtb2JpbGVcIikge1xuICAgICAgYXdhaXQgYnVuZGxlRm9sZGVyKFwiZGlzdF9idW5kbGVcIiwgXCJkaXN0L2Fzc2V0X2J1bmRsZS5qc29uXCIpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGVzYnVpbGQuYnVpbGQoe1xuICAgICAgICBlbnRyeVBvaW50czoge1xuICAgICAgICAgIGNsaWVudDogbWFpblNjcmlwdCxcbiAgICAgICAgICBzZXJ2aWNlX3dvcmtlcjogXCJ3ZWIvc2VydmljZV93b3JrZXIudHNcIixcbiAgICAgICAgICB3b3JrZXI6IFwicGx1Z29zL2Vudmlyb25tZW50cy9zYW5kYm94X3dvcmtlci50c1wiLFxuICAgICAgICB9LFxuICAgICAgICBvdXRkaXI6IGRpc3REaXIsXG4gICAgICAgIGFic1dvcmtpbmdEaXI6IERlbm8uY3dkKCksXG4gICAgICAgIGJ1bmRsZTogdHJ1ZSxcbiAgICAgICAgdHJlZVNoYWtpbmc6IHRydWUsXG4gICAgICAgIHNvdXJjZW1hcDogXCJsaW5rZWRcIixcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBqc3hGYWN0b3J5OiBcImhcIixcbiAgICAgICAganN4OiBcImF1dG9tYXRpY1wiLFxuICAgICAgICBqc3hGcmFnbWVudDogXCJGcmFnbWVudFwiLFxuICAgICAgICBqc3hJbXBvcnRTb3VyY2U6IFwiaHR0cHM6Ly9lc20uc2gvcHJlYWN0QDEwLjExLjFcIixcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIGRlbm9QbHVnaW4oe1xuICAgICAgICAgICAgaW1wb3J0TWFwVVJMOiBuZXcgVVJMKFwiLi9pbXBvcnRfbWFwLmpzb25cIiwgaW1wb3J0Lm1ldGEudXJsKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIF0pO1xuXG4gICAgYXdhaXQgcHJlcGFyZUFzc2V0cyhkaXN0RGlyKTtcbiAgICBpZiAodHlwZSA9PT0gXCJ3ZWJcIikge1xuICAgICAgYXdhaXQgYnVuZGxlRm9sZGVyKFwiZGlzdF9idW5kbGVcIiwgXCJkaXN0L2Fzc2V0X2J1bmRsZS5qc29uXCIpO1xuICAgIH1cblxuICAgIGJ1aWxkaW5nID0gZmFsc2U7XG4gICAgY29uc29sZS5sb2coXCJCdWlsdCFcIik7XG4gIH1cbn1cblxuaWYgKGltcG9ydC5tZXRhLm1haW4pIHtcbiAgY29uc3QgYXJncyA9IGZsYWdzLnBhcnNlKERlbm8uYXJncywge1xuICAgIGJvb2xlYW46IFtcIndhdGNoXCJdLFxuICAgIGFsaWFzOiB7IHc6IFwid2F0Y2hcIiB9LFxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHdhdGNoOiBmYWxzZSxcbiAgICB9LFxuICB9KTtcbiAgYXdhaXQgYnVuZGxlKGFyZ3Mud2F0Y2gsIFwid2ViXCIsIFwiZGlzdF9idW5kbGUvd2ViXCIpO1xuICBpZiAoIWFyZ3Mud2F0Y2gpIHtcbiAgICBlc2J1aWxkLnN0b3AoKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdCQUFnQjtBQUNoQiw4REFBOEQ7QUFDOUQsWUFBWSxpQkFBaUIsK0NBQStDO0FBQzVFLFlBQVksbUJBQW1CLDhDQUE4QztBQUM3RSxTQUFTLFVBQVUsUUFBUSx1REFBdUQsQ0FBQyxpQ0FBaUM7QUFDcEgsU0FBUyxJQUFJLFFBQVEsMkNBQTJDO0FBRWhFLE9BQU8sVUFBVSw0Q0FBNEM7QUFDN0QsU0FBUyxZQUFZLFFBQVEsbUNBQW1DO0FBQ2hFLFNBQVMsY0FBYyxRQUFRLG1CQUFtQjtBQUNsRCxTQUFTLFVBQVUsWUFBWSxRQUFRLGdDQUFnQztB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