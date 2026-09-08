# 6098: exact hybrid constraints and the pure-C reference

This is a stable source-specific record of the provisional result committed at `4bf6c07d` on 2026-09-08. Joe authorized the smallest assembly intervention for the three unresolved W8 targets. The complete fourteen-target wave and its final full-ROM verifier remain separate requirements; this record does not establish completed-wave acceptance or increase matching-C counts.

## Source pair

| Source | Authored SHA-256 | Compiler-input SHA-256 | Measured result |
| --- | --- | --- | --- |
| Preserved D764 pure-C reference | `D76444B2C4AF7AD44E40DA2F68456E894355AA9F1B6BF4D44F4B792DC10097E1` | `DDD67BBE5FC0CD363CED8B62EB65E12105AB36A55B1CE69029FBD4E5065A4BA6` | 4148 bytes, frame 408, 56 bytes / 46 instruction words different |
| Final hybrid working source | `720791A9D1523EC3E46B564C965EB77D6EBFB09E849EAB8C19B985FF77027B9C` | `CC4BD34E2593B79569414FA753990390E2F3529B20894809CA701DE0D332BDEB` | Canonical focused HYBRID_C exact: 4148 bytes, frame 456 |

The curated observations retain both exact authored sources and link the hybrid to the pure-C reference. Retrieve them with `node tools/match.js intake func_001F6098 --limit 20 --json`. The pure-C reference remains useful for future conversion; it is not the active exact source.

Both sources retain two inherited CRLF sequences. Git stores the final hybrid as LF-only source `540E980207EA0D1EEB010621B9F8DA57E1EAADB97A28B996C55C8D8BFDAA1EA2`. Independent source-policy checks classify both final spellings HYBRID_C and produce identical compiler input and dependencies. Exact curated C bytes must not be normalized or edited in place.

## Minimal intervention

The C body remains intact. Twenty-one added lines provide comments, six explicitly assembly-owned scratch scalars, two empty lifetime templates and one point register constraint. Every assembly template is empty: no explicit assembly instruction, data word or padding byte is injected.

Three scratch scalars are declared before `sourceY` and three after it. Empty `=g` outputs follow the factor-zero early exit; empty `g` inputs occur at the outer-loop entry. Their opaque lifetimes cross actual calls and the backedge. The pinned compiler assigns six unaccessed reload homes, preserving the existing accessed homes and save-register masks. These scalars represent hybrid frame control, not game values or identified original C locals. They do not escape or feed C computations.

The resulting unused word positions are `0x164`, `0x16C`, `0x174`, `0x184`, `0x18C` and `0x194`. The existing `sourceY` home becomes `0x17C`, and the decoded-address home becomes `0x19C`. Each scalar home occupies eight aligned bytes in this compiler, explaining the 48-byte frame difference. The earlier accessed positions remain unchanged.

After the real `x0` load, an empty tied-input/output constraint briefly binds that value to register 23 and returns it to the ordinary C variable. This fixes the remaining sixteen register-choice words. A function-wide binding instead changed packet scheduling; the point constraint preserves the required code.

## Evidence and limits

The final authored source, source policy, expanded input, private linked result and canonical focused report are retained under ignored `build/combat-draw-wave8-r12/6098/hybrid-final/`. Exact-input diagnostic agreement and the home/access map are under `build/combat-draw-wave8-r12/6098-traces/hybrid-final/`. Git-normalization authentication is `build/combat-draw-wave8-r12/6098-staged-authentication.json`. Bulk compiler and ROM evidence remains untracked.

The canonical focused report establishes one 4148-byte contribution from `objects/c/func_001F6098.o`, no original-assembly fallback contribution or fill, exact placement, all 162 linked relocation words, and exact complete target bytes. Linked and expected target SHA-256 are both `53A1ADB9DDA377E04496E49893D1E145CC13B8299B6F4CFD46046836FDCFF5EC`. The compiler assembly is not rewritten. The focused command took 133979 ms, with one requested target compilation and 601 authenticated sibling cache hits.

Failed all-register-clobber controls reached the pinned compiler's fixed/forbidden-register reload error. Successful lifetime controls initially changed entry/return scheduling; placing the two constraints at the final boundaries recovered the original extent. These are candidate-specific observations. They neither identify six original C variables nor prove that the same reservation recipe transfers unchanged to another function.

Removing this hybrid mechanism in future requires a real pure-C source explanation that recovers the frame and allocation, followed by the normal source-class and complete-wave gates. The six unexplained original reservations remain a source-recovery question. Do not relabel this result PURE_C because its assembly templates emit no instructions.
