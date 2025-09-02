# Contributing to RETRO

## Game requirements
- Keep it small: ≤ ~500 lines for a first version.
- No external assets without a license. Prefer CC0, CC-BY, or your own.
- Must run with simple steps (document in a local README).

## PR checklist
- `README.md` in your game folder with controls + run instructions.
- No large binaries; put big assets in releases or link to a source.
- Lint/format (Black for Python, Prettier/ESLint for JS if present).

## Code style
- Prefer pure functions for game logic.
- Separate update (logic) from draw (render).
