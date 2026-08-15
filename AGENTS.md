# World Clean Biz Visual OS

## Purpose

World Clean Biz uses a standardized visual workflow.

The goal is:

Article URL
-> Matching Visual Asset Folder
-> Automatic Image Update

No manual image mapping.

No repeated project exploration.

## Visual Asset Library

All article images are stored at:

```text
/Users/youdenny/Desktop/WorldCleanBizAssets
```

## Folder Structure

Each article has its own folder.

Folder name must equal article slug.

Example:

Article:

```text
https://worldcleanbiz.com/blog/aiper-fluidra-pool-robotics-alliance
```

Slug:

```text
aiper-fluidra-pool-robotics-alliance
```

Folder:

```text
/Users/youdenny/Desktop/WorldCleanBizAssets/aiper-fluidra-pool-robotics-alliance/
```

## Image Naming Convention

```text
01-cover.png
02-*.png
03-*.png
04-*.png
05-*.png
```

Examples:

```text
01-cover.png
02-channel-alliance-evidence.png
03-growth-path.png
04-scale-vs-speed.png
05-competition-landscape.png
```

## Visual Package Rules

Image 01:

```text
01-cover.png
```

Use as:

- Article cover image
- Page thumbnail
- Social image, if applicable

Images 02+:

- Use as article body images
- Insert sequentially throughout the article
- Distribute naturally according to article structure
- Do not place all images together

## Article Update Workflow

When asked to update article visuals:

Step 1:

Extract article slug.

Example:

```text
https://worldcleanbiz.com/blog/anker-shallow-sea-strategy-and-talent-platform
```

Slug:

```text
anker-shallow-sea-strategy-and-talent-platform
```

Step 2:

Locate image folder:

```text
/Users/youdenny/Desktop/WorldCleanBizAssets/{slug}/
```

Step 3:

Load images:

```text
01-cover.png
02+
```

Step 4:

Update article:

- Replace cover image
- Insert body images
- Replace outdated visuals when appropriate

## Validation

Before completion, confirm:

- Cover image renders correctly
- All body images render correctly
- No broken image links
- The article-image verifier passes; use the Vercel production build as the routine build gate

## Mandatory Article Image Preparation

Every generated visual and every user-provided photo must enter the website through:

```text
npm run prepare:article-images -- --slug {slug}
```

- Keep the unchanged original in `/Users/youdenny/Desktop/WorldCleanBizAssets/{slug}/`.
- Do not copy raw large PNG or JPEG files directly into `public`.
- Preparation is the only image write path; build verification is read-only and must never auto-fix a failure.
- `visual_archive` is reserved for the explicitly allowlisted historical archive with more than 50 unique body images and complete hash-bound classification. It is not available to normal new articles.
- Follow `docs/operations/wcb-article-image-publishing.md` for generation sizes, crop review, validation, and historical maintenance.

## SEO Buyer Guide Publishing Rule

When publishing a new World Clean Biz SEO Buyer Guide or Sourcing Guide from an Obsidian release package:

- Copy the approved MDX source and approved images exactly as requested.
- Do not rewrite the article body.
- Do not change title, slug, meta_description, category, tags, excerpt, CTA, FAQ, JSON-LD, or image paths unless the user explicitly asks.
- Ensure the article frontmatter includes publish sorting fields before build:

```text
date: "YYYY-MM-DD"
publishedAt: "YYYY-MM-DDTHH:mm:ss+08:00"
sortDate: "YYYY-MM-DDTHH:mm:ss+08:00"
```

- If the approved source package does not include these fields, add them using the actual publishing time for this article.
- This timestamp update is required because the Blog index sorts by `sortDate`; without it, the article page may exist but not appear near the top of `/blog`.
- After adding or verifying these fields, run build and confirm the new article appears in the expected Blog index order.

## Failure Rule

If this folder does not exist:

```text
/Users/youdenny/Desktop/WorldCleanBizAssets/{slug}/
```

Stop execution.

Return:

```text
Visual Asset Folder Not Found
```

Do not guess.

Do not search other folders.

Do not create placeholder images.

## Scope

Allowed:

- Article file
- Article image references
- Article image assets

Not allowed:

- Homepage
- Navigation
- Styles
- Components
- Unrelated articles
- Project architecture changes

## User Command

Future command format:

```text
Update article visuals:
https://worldcleanbiz.com/blog/ARTICLE-SLUG
```

The system should automatically:

1. Extract slug
2. Locate image folder
3. Update images
4. Validate the article images and target page
5. Return modified file list

## Production Release Rule

GitHub `main` is the only authoritative source for the production website.

This repository is primarily a page and article website. Treat ordinary work as a page update unless the final change clearly affects shared infrastructure.

### Routine page and article updates

Examples include article content, metadata, links, prepared article images, page-local copy, icons, spacing, colors, and styles or components confined to the requested experience.

For these changes:

1. Preserve unrelated user changes and edit only the requested page or article scope.
2. Do not require a separate design document, implementation plan, TDD cycle, multi-agent review, full test suite, local production build, or Vercel Preview unless the user explicitly asks for one.
3. Run only the check that directly covers the change. For visual changes, inspect the target page; add a 390 px check only when responsive layout may be affected.
4. Article images must still use `npm run prepare:article-images -- --slug {slug}` and the required image verifier.
5. Use one focused Git branch/PR, merge it automatically after the targeted check passes, and let the Vercel Git integration deploy `main`.
6. Do not ask for another production confirmation after the user has confirmed the requested change. Verify the live target URL and report the result once.

Routine page updates must not create release-specific specs, plans, audit records, screenshots, or operation documents unless they are themselves requested deliverables.

### High-impact changes

Use the stricter engineering workflow only for dependencies, build or deployment configuration, environment variables, global routing/layout, authentication, payments, analytics, forms, destructive actions, data migration, or changes spanning multiple site systems.

For high-impact work, use relevant regression tests, a local build when it provides distinct evidence, Vercel Preview, and one meaningful production approval. Avoid duplicate checks that prove the same thing.

Routine production releases must not use `vercel --prod` or another direct local-to-production deployment command.

A direct CLI production deployment is allowed only for an explicitly approved emergency recovery when the GitHub-to-Vercel release path is unavailable. After emergency recovery, reconcile the deployed code back into GitHub `main` before any further release.
