# Contributing to OB64 Decomp

We welcome matching C for *Ogre Battle 64* US Rev 0, research on game behavior, and fixes to documentation and tools. Recovered game code belongs here. For changes to the Lordly Caliber editor, see the [Editor contributor guide](https://github.com/rempred/LordlyCaliber/blob/main/CONTRIBUTING.md).

## Find or request a target

Start with the [current queue and Editor priorities](docs/NEXT_STEPS.md) and check the [open Decomp issues](https://github.com/rempred/OB64-Decomp/issues) and [pull requests](https://github.com/rempred/OB64-Decomp/pulls) for work already underway. If you pick up a posted request, reply with the functions you plan to cover so others can coordinate.

To request a match, describe the game or Editor behavior it would unlock, how to reach it, and the function or caller if known. For example, “the chapter title preview stops when the script asks whether the image reveal has finished” gives someone a specific path to trace. Label each address as a normalized ROM offset or a runtime address, and identify the overlay if known. [Open a Decomp issue](https://github.com/rempred/OB64-Decomp/issues/new)

## Send a matching-C pull request

1. Fork `rempred/OB64-Decomp` and start a branch from its current `main`. For local matching, follow the [setup instructions](README.md#start-here) with your own US Rev 0 ROM and the pinned tools.
2. Inspect the target and read its research notes. Confirm the ROM range and the original assembly section that owns those bytes. Reconstruct readable C under `src/` from the ROM and project evidence. If the entry point or boundary disagrees with the repository, include the conflicting offsets and disassembly in the PR or issue. A change to the layout has its own [structural review](docs/AUDIT.md).
3. Register the symbol and source path in `config/matching-c-targets.json`. Review the relocations emitted by the compiled object and record them in numeric offset order in `config/matching-c-linkage.json`. Reuse existing definitions for called functions and referenced data. Keep the original assembly as a fallback. The [matching workflow](docs/WORKFLOW.md#normal-matching-loop) walks through activation and the first linked diff.
4. Push to your fork and open a PR with **rempred/OB64-Decomp → main** as the base. Link the request, list the symbols and ROM ranges covered, and report the checks you ran, their results, and any remaining mismatch. For a group of functions, distinguish the ones tested individually from those verified together. Keep ROMs, savestates, toolchains, compiled objects and generated build reports out of the PR. [Compare branches](https://github.com/rempred/OB64-Decomp/compare)

If your finding comes from another decompilation, open an issue with the upstream revision, file, symbol, addresses and verification method before bringing over source. Those facts let maintainers reproduce the finding and agree on what source can be used. [Clean-room policy](AGENTS.md#clean-room-boundary)

## Verify a match

From the repository root, substitute your target symbol for `func_XXXXXXXX`. Run the first two commands when choosing a target. Once its C source is active, use the last two as you iterate.

```powershell
$symbol = 'func_XXXXXXXX'
node tools/match.js inspect $symbol
node tools/match.js intake $symbol

node tools/diff.js $symbol
node tools/source_policy.js --target $symbol
```

When the complete set is ready, run `node tools/verify.js` once. For each matching function, the verifier must confirm `PURE_C`, sole ownership of the target section by the C object, correct placement and relocations, and exact linked bytes. The complete rebuilt ROM must also equal the normalized US Rev 0 input byte for byte. Inline assembly is classified as `HYBRID_C`, even when the bytes match. [Source policy](docs/SOURCE_POLICY.md)

If you lack the pinned build host, you can still submit a candidate. State which compiler and comparison you used, what range matched, and which checks remain for a maintainer. If you hit a mismatch, the first differing offset or exact error makes it easier to reproduce.

## Respond to review

Push revisions to the same PR branch and summarize what changed. If you or your tools find that a review suggestion is incorrect, say so in the review thread. A caller, linker-map entry, or reproducible command showing the discrepancy gives both sides a way to settle it. A maintainer runs the full verifier on the combined revision before accepting matching C. An Editor feature that uses the result can then link the accepted Decomp commit in its own PR.
