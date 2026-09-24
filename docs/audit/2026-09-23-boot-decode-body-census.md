# Boot decompression logical-body census review

Date: 2026-09-23. This review supports a bounded addition to `config/logical-functions.json`. It does not change physical owners, activate C, prove runtime use, or establish matching progress.

## Accepted structural interpretation

All intervals below are normalized Rev 0 ROM with exclusive ends. Runtime addresses in this boot interval are ROM + `0x8006FC00`.

| Preserved physical owner | Reviewed logical intervals |
|---|---|
| `43D4..46F4` (800 bytes) | `43D4..4450`, `4450..4480`, `4480..44F0`, `44F0..45A8`, `45A8..462C`, `462C..46F4` |
| `A510..AF7C` (2668 bytes) | Existing `A510..ABE0`, `ABE0..AC0C`; added `AC0C..AF30`, `AF30..AF7C` |
| `F5A0..F618` (120 bytes) | `F5A0..F5F8`, `F5F8..F618` |
| `F618..F734` (284 bytes) | `F618..F634`, `F634..F714`, `F714..F734` |
| `F734..F808` (212 bytes) | `F734..F808` |
| `4894..4AC8` (564 bytes) | `4894..4AB8` is a reviewed research body; `4AB8..4AC8` remains unknown coverage |

The delta contains fourteen new records completing five owner censuses, plus the encoder research body. The two pre-existing A510 records are unchanged. Existing symbols and address aliases are retained without creating linker exports. The registry pins each canonical interval hash and its ordered physical-source intersections.

## Evidence

The independent reviewer read both governing AGENTS files, the structural audit rules, the bounded coverage workflow, complete disputed assembly owners, and the callback table consumer. Every `.word` in all six physical owners was independently checked against the authenticated normalized ROM. Its SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Each admitted cut follows a complete `jr ra` and delay slot. Direct non-call branches and jumps remain inside the associated body; successors derive their working state from fresh arguments, globals, or constants. These combined control/data-flow properties support the census; prologue and return patterns alone do not.

The cursor owner contains one record-reset operation followed by five self-contained cursor operations. The helper bodies use global state at `0x800AEFB0..0x800AEFC0` with independently established inputs and complete returns. Calls to the first body occur at ROM `0x242C` and `0x273C`. The absence of established callers for the other five does not establish unused code or invalidate their body coverage.

The custom decoder at `AC0C` consumes fresh destination, table, and index arguments, derives all decoding state, and converges on the return at `AF28/AF2C`. The independent length reader at `AF30` returns at `AF74/AF78`. Both select size from header bytes 2–3 for modes 0–2 and entry bytes 0–1 otherwise. No non-call flow connects these to the two previously registered bodies. Static caller reachability remains unproved.

The callback entries have direct data-reference and consumer evidence. Driver ROM `C354..C3BC` computes `12 * method`, copies three words from runtime `0x800A876C + 12 * method` to `0x800AF3B4`, and calls the copied fields at `C410` (+8), `C458` (+0), and `C4E4` (+4). Method indices 6 and 7 select:

| Pointer ROM | Target ROM |
|---|---|
| `38BB4` | `F5A0` |
| `38BB8` | `F5F8` |
| `38BBC` | `F618` |
| `38BC0` | `F634` |
| `38BC4` | `F714` |
| `38BC8` | `F734` |

All six entries independently return without cross-body non-call flow. Existing semantic owner names do not override this census.

## Encoder tail remains unresolved

The branch at `48C4` executes the stack setup at `48C8` in its delay slot. Earlier instructions establish live data and cursor state, so `48C8` is not independently supported as a function. The main body ends after `4AB0: jr ra` and `4AB4: addiu sp,sp,8`.

The following words are `0`, `0`, `03E00008`, `0`. A 16-aligned return at `4AC0` and preceding zeros support an alignment/empty-function hypothesis but do not establish padding, object boundaries, or an independently callable body. Entry at `4AB8`, dead residual code, and producer artifacts remain competing explanations. No new padding or empty-function record is admitted. A generic padding contract would not itself supply the missing evidence.

The full 564-byte physical owner must remain conserved. Its 548-byte logical selection does not authorize a shorter production replacement. No pure-C impossibility or assembly exception is established.

A follow-up used the completed placement model to scan all 4,885 mapped executable
slices (610,740 words), including boot, manual-load slabs and overlays. No direct
jump/call/branch or standard immediate address construction targets runtime
`800746B8`, `800746BC`, `800746C0` or `800746C4`. These negative results do not
exclude computed or runtime references. Neighboring owners provide no original
object, alignment or symbol provenance. The tail therefore remains unknown;
reproducing a plausible empty-function layout would not alone prove its boundary.

## Concrete metadata review and verification boundary

The reviewer compared all fifteen concrete additions against independently recorded canonical byte hashes and endpoints, re-derived their fragments through the accepted model, and validated the registry. Fragment offsets, source hashes, boot runtime placement, and six physical envelopes agree. Existing A510/ABE0 records, padding records, and preserved production envelopes are unchanged. No discrepancy was found in the reviewed delta.

The independent review was read-only and performed without compilation or a full build.
Its metadata conclusions were then checked by the focused regression and the combined
`node tools/audit.js` run, which passed on September 24, 2026 at 05:03:02 UTC. The
changed-input structural protections and CURRENT exact-ROM gates passed with 650
source-to-object proofs. The encoder-owner preparation still rejects incomplete
coverage. No runtime-use claim or global absence-of-callers proof follows from the
bounded static scans. See the [trial report](2026-09-23-boot-decompression-trial.md).

The selection regression exposed and corrected a metadata interaction before acceptance:
nonempty alias lists on new primary bodies invoked the existing historical-correction
path and shortened complete multi-body scratch selections. The final primary records
at 43D4/F5A0/F618/F734 use their address symbols with empty alias lists, as the existing
A510 primary does. This preserves complete physical producer selections without
changing shared tooling. The 4894 alias correction remains intentional for its
548-byte research selection, with its 564-byte original owner checked separately.
The focused static test passed five complete envelopes, six callback references,
the unresolved encoder tail, and 21 negative controls after this correction.
