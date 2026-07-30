import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context);
  }

  const target = path.join(projectRoot, specifier.slice(2));
  const extension = path.extname(target) ? "" : ".ts";

  return nextResolve(pathToFileURL(`${target}${extension}`).href, context);
}
