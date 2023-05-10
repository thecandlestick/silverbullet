import type { FileMeta } from "../common/types.ts";

import { walk } from "https://deno.land/std@0.165.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.165.0/path/mod.ts";
import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts";

const rootDir = resolve("website_build/fs");

const allFiles: FileMeta[] = [];
for await (
  const file of walk(rootDir, {
    includeDirs: false,
    // Exclude hidden files
    skip: [/^.*\/\..+$/],
  })
) {
  const fullPath = file.path;
  const s = await Deno.stat(fullPath);
  allFiles.push({
    name: fullPath.substring(rootDir.length + 1),
    lastModified: 1,
    contentType: mime.getType(fullPath) || "application/octet-stream",
    size: s.size,
    perm: "ro",
  });
}
console.log(JSON.stringify(allFiles, null, 2));
