# MARS project website

A standalone, responsive research homepage for **Look Before You Flow: Inference-Time Risk Steering for Frozen Flow-Matching VLAs**.

Plain HTML, CSS, and JavaScript. No package installation, build step, remote font, analytics, or runtime CDN dependency. The cloned origin is `https://github.com/MARS-ICLR-2026/MARS-ICLR-2026.github.io.git`.

## Preview locally

Run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Opening `index.html` directly also works.

## The three resource links

| Button | Current destination | How to update |
| --- | --- | --- |
| GitHub Code | `code/index.html` — a local release-status page | Replace the first resource anchor in `index.html` with the implementation repository URL when available. |
| Paper | `assets/paper/mars.pdf` | Replace the PDF with the finalized paper or update the resource anchor. |
| Video | `#video` — an explicit “Video coming soon” section | Replace the placeholder with a real video player and keep the anchor, or point the resource anchor to the video URL. |

No dataset or model-hosting resource links are included. The supplied GitHub repository hosts the website; it is not presented as the implementation repository.

No authors, affiliations, acceptance status, or publication identifiers were supplied in the current anonymous paper. None were invented.

## Content and evidence

Source snapshot: local manuscript on 2026-09-17.

- Title: `paper/main.tex` in the parent research workspace.
- Method text: `paper/sections/method.tex`; exact GRV / TAFR names and independent anchor/correction update preserved.
- Paper: an unchanged copy of `paper/main.pdf`.
- Images: rendered from `paper/pics/introduction.pdf` and `paper/pics/framework.pdf`. The hero crops the MARS panel from the introduction figure. It is explicitly labeled as a schematic, not an empirical rollout.
- Results: `assets/results.js` transcribes the π0.5 and π0.5 + MARS rows of Table `tab:vla-arena` in `paper/sections/evaluation.tex`, including all five suites and three levels. Each entry is `[base SR, base CC, MARS SR, MARS CC]`.
- The 98.8% highlight is `(7.613 - 0.095) / 7.613 * 100`, rounded to one decimal. This uses table precision; the manuscript prose uses rounded numbers and reports 98.7%.
- Dynamic-obstacle cost increases and other mixed results remain visible. Results are manuscript-reported, not independently reproduced.
- Incomplete LIBERO-Safety collision-rate cells, real-world `todo` measurements, and planned ablations are not promoted into website claims. The downloadable manuscript remains an unmodified draft.

Edit `index.html` for prose/resources, `assets/style.css` for design, and `assets/results.js` for result data. When updating results, also update the initial no-JavaScript HazardAvoidance L0 chart and highlight figures in `index.html`.

## Open-source research and design references

Inspected on 2026-09-17:

1. [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) — academic title/resource grouping, teaser/abstract/method/media structure, responsive project-page conventions. README and HTML inspected; documented license: CC BY-SA 4.0.
2. [Nerfies project page](https://github.com/nerfies/nerfies.github.io) — original research-page reference cited by the template. README inspected; documented license: CC BY-SA 4.0.
3. [Vue academic project template](https://github.com/JunyaoHu/academic-project-page-template-vue) — surfaced by GitHub repository search; not adopted because this page does not need a framework/build toolchain.

This implementation uses original markup, styling, and behavior, with the paper's own figures and text summaries. No template source code or third-party image assets were copied. The references above record design inspiration rather than a vendored dependency.

## GitHub Pages

This repository is ready to serve as a static user/organization site. After review and pushing the files to the remote repository, select the published branch and `/ (root)` in **Settings → Pages → Deploy from a branch**. `.nojekyll` bypasses Jekyll processing. The expected domain is https://MARS-ICLR-2026.github.io/.

The website files are maintained in the repository’s `main` branch. Repository visibility and GitHub Pages availability are separate settings. Add the actual video and implementation URL when available; review the draft PDF before publication.

## Validation

Check all local asset/anchor targets, JavaScript syntax, the 15 source-data comparisons, resource navigation, the framework dialog (including Escape/focus return), and responsive layouts. The initial chart remains visible without JavaScript; interactive filtering needs JavaScript.

## Anonymous review

The page identifies its authors only as “Anonymous authors”. No author names, affiliations, email addresses, personal profiles, local filesystem paths, analytics, or external runtime resources are included. The current PDF has a blank Author field, no embedded files, and an anonymous title page. Website commits use `Anonymous Authors <anonymous@example.invalid>` for both author and committer, without a personal signature. GitHub account-level ownership, membership, access logs, and push-event attribution are controlled by GitHub and are not anonymized by website source code.

## Current manuscript update

GRV now describes 256 × 256 inputs, confidence/relevance filtering, a retained-risk cap, and the four-cycle / one-cycle invocation schedule. The real-world protocol has five task families, including state preservation; measurements remain pending. The 15 displayed VLA-Arena comparisons were rechecked against the current table and are unchanged. The local code landing page no longer quotes the release-upon-acceptance statement, which is commented out in the current manuscript.
