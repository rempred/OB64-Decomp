# Contributing to OB64 Decomp

We welcome matching C for *Ogre Battle 64* US Rev 0, research on game behavior, and fixes to documentation and tools. Recovered game code belongs here. For changes to the Lordly Caliber editor, see the [Editor contributor guide](https://github.com/rempred/LordlyCaliber/blob/main/CONTRIBUTING.md).

Contributors work on a branch in their own fork. You can use any editor and submit through GitHub. The Director, private worker folders, paired assistants and chat watchers in [AGENTS.md](AGENTS.md) coordinate Joe's assigned team. The same [source policy](docs/SOURCE_POLICY.md) and [matching requirements](docs/WORKFLOW.md#acceptance-boundary) apply to a contribution from either route.

## Find or request a target

Start with the [current queue and Editor priorities](docs/NEXT_STEPS.md) and check the [open Decomp issues](https://github.com/rempred/OB64-Decomp/issues) and [pull requests](https://github.com/rempred/OB64-Decomp/pulls) for work already underway. The queue records internal assignments. Independent contributions are welcome when it is empty. If you pick up a posted request, reply with the functions you plan to cover so others can coordinate.

To request a match, describe the game or Editor behavior it would unlock, how to reach it, and the function or caller if known. For example, “the chapter title preview stops when the script asks whether the image reveal has finished” gives someone a specific path to trace. Label each address as a normalized ROM offset or a runtime address, and identify the overlay if known. [Open a Decomp issue](https://github.com/rempred/OB64-Decomp/issues/new)

## Try the workflow from a fresh checkout

For a worked example, compare the [original assembly](asm/original/rev0/lib/func_000135a0.s) and [accepted C](src/lib/func_000135a0.c) for `func_000135a0`. Its 196 bytes begin at ROM offset `0x000135A0` and run at `0x800831A0`. The [matching notes](docs/dossiers/func-000135a0.md) explain which source edits changed the loop and register choices. For a new target, the [assembly manifest](asm/original/rev0/manifest.json) identifies the original source file and byte range. Search the tracked [dossiers](docs/dossiers) for earlier work.

With Node.js 24 and your own US Rev 0 ROM, you can also check the target configuration before installing the compiler. From the repository root, replace the example ROM path with yours.

```powershell
node tools/verify_baserom.js --input "C:\ROMs\Ogre Battle 64.z64"
node -e "console.log(require('./tools/lib/active_targets').loadActiveTargetModel().targets.length, 'active targets')"
```

Continue after the first command reports `Rev 0 verification: PASS`. The second prints the active target count for **your checkout** or stops at the first configuration error. Rerun it after editing or regenerating target records. It checks which sections the build would replace. Compilation and linking still need to show that the C emits the recorded functions and relocations and that its calls resolve to the intended symbols.

## Send a matching-C pull request

1. Fork `rempred/OB64-Decomp` and start a branch from its current `main`. For local compilation and linked comparisons, provision the Windows host and tools in the [setup instructions](README.md#start-here). If you use another host, include the results you can reproduce and identify the checks you need a maintainer to run.
2. Inspect the target and read its research notes. Confirm the ROM range and the original assembly section that owns those bytes. Reconstruct readable C under `src/` from the ROM and project evidence. If the entry point or boundary disagrees with the repository, include the conflicting offsets and disassembly in the PR or issue. A change to the layout has its own [structural review](docs/AUDIT.md).
3. Register the symbol and source path in `config/matching-c-targets.json` and keep the original assembly as a fallback. The first linked diff can report a missing relocation contract. Review the relocations it shows, record them in numeric offset order in `config/matching-c-linkage.json`, then rerun the diff. Use the names exported by the actual code or data providers. A descriptive assembly filename can differ from its exported symbol. [Relocation workflow](docs/WORKFLOW.md#4-review-relocation-evidence)
4. Push to your fork and open a PR with **rempred/OB64-Decomp → main** as the base. Link the request, list the symbols and ROM ranges covered, and report the checks you ran, their results, and any remaining mismatch. For a group of functions, distinguish the ones tested individually from those verified together. Keep ROMs, savestates, toolchains, compiled objects and generated build reports out of the PR. [Compare branches](https://github.com/rempred/OB64-Decomp/compare)

If your finding comes from another decompilation, open an issue with the upstream revision, file, symbol, addresses and verification method before bringing over source. Those facts let maintainers reproduce the finding and agree on what source can be used. [Clean-room policy](AGENTS.md#clean-room-boundary)

## Verify a match

On a provisioned checkout, substitute your target symbol for `func_XXXXXXXX`. Read its assembly and research intake, then identify what its caller supplies and which result or side effect the caller uses.

```powershell
$symbol = 'func_XXXXXXXX'
node tools/match.js inspect $symbol
node tools/match.js intake $symbol
```

For an ordinary standalone target, the optional workbench can generate a first C draft before activation. Run `node tools/match.js prepare $symbol --variant structured` with the pinned m2c checkout. Save your working C under an ignored scratch path, then compare it with `node tools/match.js watch $symbol --source "path/to/candidate.c"`. Check that the draft covers the whole function. At the first differing instruction, distinguish a changed operation from an address the linker still has to resolve. Make one source change that tests your explanation, then compare again. [Workbench examples](docs/MATCHING_WORKBENCH.md#a-small-useful-loop)

Once the source and its target record are in place on your branch, use the linked diff and source classifier. Read the byte and relocation results even if the diff command exits successfully.

```powershell
node tools/diff.js $symbol
node tools/source_policy.js --target $symbol
```

Provision the separate diagnostic frontend using the [C interface setup instructions](docs/WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary) before final verification.

When the complete set is ready, run `node tools/verify.js` once. For each matching function, the verifier must confirm `PURE_C`, sole ownership of the target section by the C object, correct placement and relocations, and exact linked bytes. The complete rebuilt ROM must also equal the normalized US Rev 0 input byte for byte. Inline assembly is classified as `HYBRID_C`, even when the bytes match. [Source policy](docs/SOURCE_POLICY.md)

In the PR, identify the commit you tested. If you used a different compiler or compared individual functions, give the compiler, byte ranges and results. A first differing offset or exact error is enough for a maintainer to start reproducing a failure.

## Respond to review

Push revisions to the same PR branch and summarize what changed. If you or your tools find that a review suggestion is incorrect, say so in the review thread. A caller, linker-map entry, or reproducible command showing the discrepancy gives both sides a way to settle it. The integration maintainer verifies the combined revision. Joe reviews the findings and authorizes any public response or acceptance. An Editor feature can then link the accepted Decomp commit in its own PR.
