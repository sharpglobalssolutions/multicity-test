# Hero background video

Drop your video file in this folder using this exact name — the hero
section picks it up automatically, no code changes needed:

- `hero.mp4` (H.264-encoded MP4 — the format every modern browser plays
  without a plugin)

Recommended specs:

- 1920×1080 (or 1280×720 is fine — the section scales it to cover the
  container, so extreme resolution isn't necessary)
- 15–30 seconds, edited to loop reasonably smoothly since it plays on
  repeat
- Keep the file under ~10–15MB where possible — it autoplays on page
  load, so a smaller file means a faster first paint. Compress with
  something like HandBrake if your export is larger.
- No audio needed — the video always plays muted (autoplay in every
  browser requires it), so dialogue or music won't be heard anyway.

Until a file is added here, the hero section falls back to the existing
static background image — nothing breaks in the meantime.
