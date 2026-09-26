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
| Video | `#video` — four-task rollout gallery | Update `assets/videos.js` and the gallery markup when recordings become available. |

No dataset or model-hosting resource links are included. The supplied GitHub repository hosts the website; it is not presented as the implementation repository.

No authors, affiliations, acceptance status, or publication identifiers were supplied in the current anonymous paper. None were invented.

## Content and evidence

Source snapshot: local manuscript on 2026-09-26.

- Title: `paper/main.tex` in the parent research workspace.
- Method text: `paper/sections/method.tex`; exact GRV / TAFR names and independent anchor/correction update preserved.
- Paper: an unchanged copy of `paper/main.pdf`.
- Images: rendered from `paper/pics/introduction.pdf` and `paper/pics/framework.pdf`. The hero displays the complete introduction figure. It is explicitly labeled as a schematic, not an empirical rollout.
- Results: `assets/results.js` transcribes the π0.5 and π0.5 + MARS rows of Table `tab:vla-arena` in `paper/sections/evaluation.tex`, including all five suites and three levels. Each entry is `[base SR, base CC, MARS SR, MARS CC]`.
- The simulation explorer is synchronized with the current VLA-Arena per-level table, including the revised cumulative-cost values.
- Dynamic-obstacle cost increases and other mixed results remain visible. Results are manuscript-reported, not independently reproduced.
- Incomplete LIBERO-Safety collision-rate cells, real-world `todo` measurements, and planned ablations are not promoted into website claims. The downloadable manuscript is synchronized from the current local paper build.

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

GRV now uses Qwen3-VL-8B-Instruct, 256 × 256 inputs, confidence/relevance filtering, a retained-risk cap, and the four-cycle / one-cycle invocation schedule. The real-world protocol has four task families; Affordance-aware grasping is the clean training subtask demonstration, while the other three tasks have outcome-labeled safety rollouts. The 15 displayed VLA-Arena comparisons were rechecked against the current table and are unchanged. The local code landing page no longer quotes the release-upon-acceptance statement, which is commented out in the current manuscript.

## Final rollout gallery (2026-09-21)

Source collection: `exp_figure/videos/final`. Directory `cr16` is displayed as **Dobot CR-10**, and `a1x` as **Galaxea A1X**, using the manuscript's official platform names. Terminal `-0` means failure and `-1` means success. The user confirmed that all untagged Affordance-aware grasping clips and `a1x/pickupscrewdriver0` are successful. Affordance clips are explicitly labeled training demonstrations, not held-out evaluation evidence.

The superseded `Obstacle avoidance-1-old` folder is excluded. The `trimmed_16s` pair replaces its parent Affordance episode where supplied; it is not counted twice. Cautious grasp videos use the screwdriver protocol described in the current manuscript. Missing failure slots retain the previously specified candle placeholder with an explicit label.

`assets/video-sources.json` records relative source paths, exact outcome assignments, and episode indices. Rebuild with `python3 scripts/update_videos.py /path/to/final`. Requires ffmpeg. The source path itself is never embedded in website assets. Metadata and audio are omitted; H.264 video is remuxed without quality loss, with fast-start indexing and JPEG posters. Paired playback aligns start times but does not promise frame-accurate hardware synchronization.

The real-world protocol summary is updated to four task families. The downloadable PDF and simulation results remain the separately maintained manuscript snapshot described above; this update concerns the final video collection.

## Visual design refresh

The current presentation is inspired by [PILOT](https://github.com/pilot-wam-2026/pilot-wam-2026.github.io): a centered project wordmark, gold/rose/lavender palette, warm paper surfaces, rounded figures and video cards, and a light/dark toggle. `assets/pilot-inspired.css` contains original MARS-specific styling; no reference-site assets, author information, or additional resource links are imported. Theme preference is stored locally in the browser; there are no third-party font requests or analytics. Video mappings, training-data labels, outcome labels, and the three resource destinations remain intact.

## Oracle success gallery

The gallery contains all 249 records whose source-browser status is exactly `success`: 193 π0.5, 40 StarVLA-PI, 13 SmolVLA, and 3 StarVLA-GR00T. Dataset labels are preserved as supplied: 155 `vla-arena`, 70 `safelibero`, and 24 `libero-safety`. These are native-policy Oracle probes, not MARS-guided rollouts or a representative success-rate sample.

All videos are bundled locally under `assets/videos/oracle`, with sanitized metadata, JPEG posters, and WebVTT execution-stage captions. `assets/oracle-videos.js` records source experiment IDs and display fields without hostnames, user names, or absolute source paths. Filtering uses Dataset only; pagination exposes all clips. Model, suite, protocol, and instructions remain visible in clip details. The source browser defines the preparation boundary as `prep_frames / 20` seconds; this timing is preserved for 39 prepared episodes. The other 210 episodes start directly from the initial state. Real-world video regeneration preserves this independent gallery.

## Manuscript figure sync (2026-09-25)

All nine figures currently referenced by the manuscript are included as 2400-pixel-wide WebP assets: introduction, framework, real-world results and setups, obstacle avoidance, qualitative simulation cases, trajectory anchoring, component analysis, experimental platforms, and complete real-world rollouts. Figures retain their complete aspect ratios. The framework keeps its enlargement dialog; added figures open at full resolution when clicked.

`assets/image-sources.json` records relative source filenames, SHA-256 hashes, asset paths, and rendered dimensions. Source metadata is not copied into the rendered images. This update synchronizes figures and their captions; the downloadable manuscript and interactive result tables retain their existing snapshots.

The standalone obstacle-avoidance figure is omitted from the page because the complete real-world rollout figure already includes that comparison. Its rendered asset remains available in the source inventory.
