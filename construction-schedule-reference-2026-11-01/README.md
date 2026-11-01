# Construction Schedule Reference — 2026-11-01

## Purpose
Design reference prototype for the next `building-schedule` UI update. This is an independently implemented prototype, not copied third-party source code or assets.

## Reference research
- Procore Scheduling: https://www.procore.com/project-management
  - Reference elements: field-to-office schedule visibility, lookahead planning, integrated progress/attention states.
  - Why: validates that the schedule should connect planning with field execution rather than act as a static Gantt viewer.
- Buildxact Job Schedule: https://help.buildxact.com/en/articles/9488327-how-do-i-use-the-job-schedule-tool-in-buildxact
  - Reference elements: direct task movement, progress adjustment, dependencies, zoom/fullscreen and sharing.
  - Why: close to the client's request for hand-drawn-like direct manipulation.
- Autodesk Forma / Schedule: https://help.autodesk.com/cloudhelp/ENU/Build-Schedule/files/About_Schedule.html
  - Reference elements: schedule/workplan separation, permissions, versioned collaboration and field-oriented work planning.
  - Why: useful model for separating the master schedule from short-term field execution.

## Design decisions
1. **Schedule is the hero** — the Gantt canvas occupies the largest visual area.
2. **Direct manipulation first** — prototype bars can be dragged horizontally without opening a form.
3. **Field-first information hierarchy** — progress delta, attention items and seven-day lookahead stay adjacent to the schedule.
4. **High information density without dashboard clutter** — restrained cards, strong grid, minimal decoration.
5. **Desktop planning + mobile awareness** — desktop keeps a wide canvas; smaller screens preserve core status and horizontal schedule access.

## Files
- `index.html` — visual prototype
- `style.css` — visual system and responsive layout
- `app.js` — minimal drag interaction

## Next implementation target
Use this prototype as a design reference for a dedicated feature branch in `building-schedule`. Do not merge this prototype directly into production without reconciling existing schedule behavior and client requirements.
