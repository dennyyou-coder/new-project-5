#!/usr/bin/env node

import { verifyArticleImages } from "./article-images/verify.mjs";

class InvocationError extends Error {}

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--project-root" || argument === "--source-library-root") {
      const value = argv[++index];
      if (!value || value.startsWith("--")) throw new InvocationError(`${argument} requires a path.`);
      if (argument === "--project-root") options.projectRoot = value;
      else options.sourceLibraryRoot = value;
    } else {
      throw new InvocationError(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function printFindings(label, findings, stream) {
  if (!findings.length) return;
  stream.write(`${label}:\n`);
  for (const item of findings) {
    const location = [item.slug === "~repository" ? null : item.slug, item.url].filter(Boolean).join(" ");
    stream.write(`[${item.code}]${location ? ` ${location}` : ""}: ${item.message}\n`);
  }
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`Invocation error: ${error.message}`);
    process.exitCode = 2;
    return;
  }

  try {
    const report = await verifyArticleImages(options);
    const repository = report.repository;
    console.log(
      `Repository: current ${repository.currentBytes} bytes; baseline ${repository.baselineBytes} bytes; `
      + `allowed growth ${repository.allowedGrowth} bytes; limit ${repository.limitBytes} bytes; ${repository.fileCount} files.`
    );
    if (repository.topChanged.length) {
      console.log(`Largest new/changed files: ${repository.topChanged.map(({ file, bytes }) => `${file} (${bytes} bytes)`).join(", ")}`);
    }
    printFindings("Warnings", report.warnings, process.stdout);
    if (!report.ok) {
      printFindings(`Blocking findings (${report.failures.length})`, report.failures, process.stderr);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Article image verification passed: ${report.summary.articles} articles, ${report.summary.assets} primary assets, `
      + `${report.summary.mobileAssets} mobile assets.`
    );
  } catch (error) {
    console.error(`Verification failed unexpectedly: ${error.stack ?? error.message}`);
    process.exitCode = 1;
  }
}

await main();
