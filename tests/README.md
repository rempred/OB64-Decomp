# tests

Tests for extraction, byte-order normalization, parser behavior, segment
splitting, and ROM compare tooling belong here.

Matching tests should compare generated outputs against local `baserom/` inputs
without requiring the ROM to be committed.

`node tests/diff_exactness.js` checks final linked-byte exactness independently
from asm-differ aliases. It also covers malformed target-section failures and
the final-linked-byte requirement for relocated targets.
