# Final review Fix Wave 1 report

Date: 2026-08-11
Branch: `codex/wcb-article-image-pipeline`
Scope: final review findings only; no push, PR, Preview, merge, deployment, article rewrite, historical primary apply, or external-library mutation

## Outcome

All eight confirmed final-review findings were repaired. The production article inventory remains 438 articles / 1,770 primary assets / 1,210 retained mobile assets. No `public` image changed. The full audit manifest was refreshed through the index-only atomic path and the compact runtime index was added.

## Confirmed findings and repairs

1. **Incremental historical maintenance** — reproduced the ordinary `--all --dry-run` failure at the History cover: a redundant re-encode produced hash `37d66f...` while the current pipeline-owned primary/classification hash was `0873f2...`. Historical preparation now reuses the complete recorded state only when processor version and current primary output hash both match. New, drifted, or unowned inputs retain the existing planner. Final consecutive dry runs are fully idempotent.
2. **SVG verification without Sharp** — a `100000 x 100000` SVG that Sharp rejects on pixel limits failed the old full verifier. Preparation and verification now share a bounded intrinsic `width`/`height`/`viewBox` parser; SVG bytes are hashed normally and never enter Sharp or mobile generation.
3. **External source audit coverage** — the old exact-filename rule had 0 matches across 10 present folders / 32 files. The full manifest now binds every file by hash to either an exact semantic repository primary or a stable explicit disposition. Verification blocks changed, missing, added, orphaned, malformed, or unbound audit state and prints exact coverage/disposition totals.
4. **Full audit versus slim runtime** — rendering no longer imports the 1,280,824-byte full manifest. `article-image-runtime.json` is a deterministic compact projection containing only URL, width, height, and optional mobile `src`/width/height. Its measured size is 301,322 bytes against a 350,000-byte gate. Preparation commits both files atomically; source verification blocks drift in either.
5. **Cover crop ratio** — explicit cover rectangles must be within 0.5% of `16:9`. Valid framing passes; square and portrait crops return actionable `COVER_CROP_RATIO_INVALID`. Body and historical preservation ratios are unchanged.
6. **Candidate repository ceiling** — phase one now scans the current guarded roots and applies every staged replacement/deletion delta before reports, backups, or commit. A candidate above 321,920,358 bytes stops with `REPOSITORY_BUDGET_EXCEEDED` and leaves repository files untouched.
7. **Exact built image contract** — the built verifier now enforces exact cover/body `sizes`, `decoding="async"`, cover `loading="eager"` plus `fetchpriority="high"`, body laziness, exact mobile/primary `srcset`, and no `srcset` when no mobile candidate is registered.
8. **Every path-component symlink** — repository roots and write/removal destinations are checked component-by-component with `lstat`. Internal links that still resolve inside the repository are rejected before commit, as are external escapes; the link and target remain unchanged.

## External source audit

- Folders: 10
- Files and hashes checked: 32 / 32
- Exact semantic bindings: 25
- Explicit dispositions: 32
  - `EXTERNAL_SOURCE_CONFLICT_FALLBACK`: 5 records
  - `INCOMPATIBLE_HISTORICAL_PRIMARY_FORMAT`: 19 records
  - `HISTORICAL_SVG_PREFIX_NORMALIZED`: 6 records
  - `EXTERNAL_SOURCE_CONTENT_CONFLICT`: 2 records

A record may be an exact binding and also carry a repository-primary disposition. This proves external identity while preserving the user's binding rule that the repository primary remains authoritative.

External library proof before and after index refresh:

- aggregate file-content SHA-256: `5fb064dfd3536ea5a5689be423ea35f130e37052054ebc43ff86293ef32f7890`
- aggregate path/size/mtime SHA-256: `bd266194c527f5ecffd995e962194a7381273b61667e573d5c577d48a693d4a2`

Both values were identical before and after. The external library was read-only.

## Final verification evidence

Consecutive ordinary production dry runs, final code:

```text
run 1: 438 articles; 0 created; 0 replaced; 0 removed; 0 primary changes; full/runtime unchanged; 23 deterministic warnings
run 2: 438 articles; 0 created; 0 replaced; 0 removed; 0 primary changes; full/runtime unchanged; 23 deterministic warnings
```

Focused and repository gates:

```text
article image focused suite             PASS 147/147
complete repository suite               PASS 510/510
content classification                  PASS
SEO audit                               PASS 7/7
asset performance                       PASS 3/3
source image verification               PASS 438/1,770/1,210
external audit                          PASS 10 folders / 32 hashes / 25 exact / 32 dispositions
repository guarded total                PASS 253,008,125 bytes / 3,391 files
```

Production build:

```text
Next compile and type check              PASS
static generation                        PASS 646/646
postbuild image verification             PASS 438 / 1,771 / 1,211
shared first-load JS                     102 kB
blog first-load JS                       110 kB
```

Some first-attempt Blog static pages crossed Next's 60-second worker timeout during the single build. Next retried them within the same session and completed all 646 pages; no second build was started.

Runtime/chunk proof:

- full audit manifest: 1,280,824 bytes
- compact runtime index: 301,322 bytes / 350,000-byte limit
- largest static chunk: 189,766 bytes
- full-audit-only token in `.next/static/chunks` and `.next/server`: 0 files
- unrelated homepage generated HTML/RSC: 62,956 / 34,055 bytes

Primary integrity proof compared Git `HEAD` blob IDs with current worktree blob IDs for every manifest primary: **0 changed out of 1,770**.

`git diff --check` passed. The final worktree contains no modified or untracked file under `public/images/articles`, `public/images/blog`, or `public/images/insights`.

## Scope handoff

Changed implementation scope is limited to the article-image preparation, manifest/runtime projection, source and built verifiers, rendering manifest import, focused tests, generated indexes, and article-image workflow/migration reports. No content article, image asset, shared page layout, dependency, analytics, form, infrastructure, or deployment configuration changed.
