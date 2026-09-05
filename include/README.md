# include

Shared C headers for the decomp.

Suggested layout:

- `common/` - integer aliases, compiler macros, ABI helpers.
- `game/` - verified game structs and constants.
- `overlays/` - overlay-local declarations.

Headers may intentionally depend on cautious local integer aliases declared by
their consumers when moving those aliases would broaden a matching change. For
example, `game/class_entry.h` requires `u8` and `u16` to be visible before it is
included. Keep partial or differently evidenced struct views local until their
layouts are independently reconciled.
