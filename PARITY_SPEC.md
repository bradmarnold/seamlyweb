# PARITY_SPEC

## UI (must match Seamly2D)
- Light mode. Left collapsible toolbox (exact names/order). Top bar. Right tutorial panel. White drafting canvas.
- Shortcuts: Space=Pan, Shift=45°, Esc=Cancel, Enter=Confirm, Ctrl/Cmd+Z / Shift+Z=Undo/Redo.

## Tools & Behavior
- Points: Distance&Angle, Along Line, Perp Foot, From Line&Angle, Midpoint, Divide (k/n).
- Lines: Between Points (chained).
- Arcs: center–start–end, radius–angles, CW/CCW.
- Curves: Spline Path (Catmull–Rom tension), editable anchors (insert/del), right-click param dialogs.
- Snapping: points, midpoints, intersections, axis (0/90), 45°.
- Rubber-band previews for all tools.

## Editing
- Right-click any entity -> dialog (params with units & live preview).
- Move tool drags parents; dependents recompute (DAG).

## Measurements
- Separate page: create/open/save/import/export; variables usable in dialogs; simple formulas.

## Layout & Export
- Layout page: page presets (A0/A4/Letter), margins, rotation/grainline.
- Export SVG & PDF with correct scale/tiling.

## Engine Choice
- Prefer TS geometry now; optional WASM port from Seamly2D for numeric parity (GPL headers + NOTICE).

## Acceptance
- Run e2e flows to reproduce reference patterns; SVG/PDF outputs within epsilon.
