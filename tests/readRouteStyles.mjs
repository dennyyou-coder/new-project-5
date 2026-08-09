import fs from "node:fs";
import path from "node:path";

export function readRouteStyles(...routeStyleFiles) {
  return ["app/globals.css", ...routeStyleFiles.map((file) => `app/styles/${file}`)]
    .map((file) => fs.readFileSync(path.join(process.cwd(), file), "utf8"))
    .join("\n");
}
