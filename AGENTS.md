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
- Build passes successfully

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
4. Validate build
5. Return modified file list

## Production Release Rule

GitHub `main` is the only authoritative source for the production website.

Required release sequence:

1. Work on an isolated feature branch or worktree.
2. Run relevant focused tests and `npm run build`.
3. Push the feature branch to GitHub.
4. Create a Vercel Preview deployment and validate desktop, mobile, forms, analytics, and browser errors as applicable.
5. Obtain explicit user approval for production.
6. Merge the approved branch into `main` and push `main` to GitHub.
7. Allow the Vercel Git integration to deploy production automatically.
8. Verify `worldcleanbiz.com` after deployment and report the commit and deployment result.

Routine production releases must not use `vercel --prod` or another direct local-to-production deployment command.

A direct CLI production deployment is allowed only for an explicitly approved emergency recovery when the GitHub-to-Vercel release path is unavailable. After emergency recovery, reconcile the deployed code back into GitHub `main` before any further release.
