# src

C source for matched or work-in-progress decompiled code.

Suggested layout:

- `boot/` - early boot and permanent code with linear mapping.
- `permanent/` - code resident across captured game states.
- `engine/` - shared engine systems.
- `ui/` - shared UI systems.
- `battle/` - battle/combat systems that are not better grouped by overlay.
- `overlays/` - state-specific code grouped by runtime overlay.

Do not place generated m2c dumps here directly. Curate them into readable C or
keep raw generated output under `build/`.

