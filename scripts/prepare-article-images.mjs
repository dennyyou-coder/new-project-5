#!/usr/bin/env node

import {
  ArticleImagePreparationError,
  prepareAllArticleImages,
  prepareArticleImages
} from "./article-images/prepare.mjs";

class InvocationError extends Error {}

function parseArguments(argv) {
  let slug = null;
  let all = false;
  let dryRun = false;
  let repairGeneratedState = false;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--slug") {
      if (!argv[index + 1] || argv[index + 1].startsWith("--")) throw new InvocationError("--slug requires a value.");
      slug = argv[++index];
    } else if (argument === "--all") all = true;
    else if (argument === "--dry-run") dryRun = true;
    else if (argument === "--repair-generated-state") repairGeneratedState = true;
    else throw new InvocationError(`Unknown argument: ${argument}`);
  }
  if (Boolean(slug) === all) throw new InvocationError("Choose exactly one of --slug or --all.");
  if (repairGeneratedState && !all) throw new InvocationError("--repair-generated-state requires --all.");
  return { slug, all, dryRun, repairGeneratedState };
}

function bytes(value) {
  return `${value.toLocaleString("en-US")} bytes`;
}

function printReport(report) {
  const articles = report.mode === "all" ? report.articles : [report];
  for (const article of articles) {
    const savings = article.sourceBytes - article.desktopBytes;
    console.log(`Article: ${article.slug}`);
    console.log(`Budget class: ${article.budgetClass}`);
    console.log(`Desktop/mobile: ${bytes(article.desktopBytes)} / ${bytes(article.mobileBytes)}`);
    console.log(`Savings: ${bytes(savings)}`);
    console.log(`Files: ${article.filesCreated.length} created, ${article.filesReplaced.length} replaced, ${article.filesRemoved.length} removed`);
    console.log(`Manifest: ${article.manifestChanged ? "changed" : "unchanged"}`);
    if (article.warnings.length) console.log(`Warnings: ${article.warnings.join("; ")}`);
  }
}

async function main() {
  let invocation;
  try {
    invocation = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`Invocation error: ${error.message}`);
    process.exitCode = 2;
    return;
  }
  try {
    const result = invocation.all
      ? await prepareAllArticleImages({ dryRun: invocation.dryRun, repairGeneratedState: invocation.repairGeneratedState })
      : await prepareArticleImages({ slug: invocation.slug, dryRun: invocation.dryRun });
    printReport(result);
  } catch (error) {
    const known = error instanceof ArticleImagePreparationError;
    console.error(`Article: ${error.slug ?? invocation.slug ?? "all"}`);
    console.error(`Image: ${error.imageName ?? "n/a"}`);
    console.error(`Observed: ${error.observedValue ?? error.message}`);
    console.error(`Permitted: ${error.permittedValue ?? "the validated preparation contract"}`);
    console.error(`Next action: ${error.recommendedAction ?? "Review the error and correct the source input."}`);
    process.exitCode = known ? 1 : 1;
  }
}

await main();
