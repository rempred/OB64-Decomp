# Combat discovery r2 independent review

Verdict: **Accepted**. The frozen r2 evidence supports excluding
`func_001F0C24` from the selected body/pose family as a shared attack-label
image/cache service at static scope. The exact resource decode, 101-strip
transformation, complete mapper range, two known mapper-to-image-to-draw paths,
and final texture-rectangle consumer all passed independent checks. The
untyped `00 39 12 70` occurrence has no resource-loader provenance and does not
count as another reference. The selector table bytes and local negative-edge
claims also passed, but they do not identify a consumer. The Director may
propagate the fixed-image exclusion and close that discovery gate. The Director
must retain the `func_00201778` consumer-provenance gate and keep later runtime
retrieval separate until an interpreted result receives its own review.

## Frozen subject and eligibility

The frozen subject is canonical commit
`1f68aa001c612e2a7ce160e0cdf1d83a0c8b2048`. The reviewed files are
`docs/Plans/combat-discovery-r2.md` and
`docs/Plans/task-logs/combat-discovery-r2.md`, with the exact ignored evidence
under `build/combat-discovery-r2/`. The delivered report SHA-256 is
`8D1D02505C724F486B99D5A73245344CDA75FEE1DE436AF2D3A2116D246A44D7`.
The working report and log had no difference from the frozen commit. Every
worker artifact matched `artifact-manifest.json`.

The worker reported completed and released its writes. I did not produce the
result. The r2 review claim, report, and ignored review root were absent at
activation. I created the complete claim atomically before any other review
write for launch `COMBAT-DISCOVERY-REVIEW-20260906-02`. It identifies reviewer
task `/root/combat_discovery_review` on host `local`.

The Director identified launch main `c89108d804871973718d90504c378e28994b7279`.
The checkout had advanced on `main` through descendant commits while production
tooling and separate retrieval work continued on disjoint surfaces. The frozen
subject precedes the launch commit, and all review inputs and owned paths stayed
separate from those writes. The review remained eligible under the `NORMAL`
inventory profile.

Accepted r1 dispositions remain frozen at `150c9fc` with review `a862298`.
Parent commit `e445991cc357a56e9d8f3d3866c247d6f52e1634` contains the
citation-corrected propagation. This r2 review changes only the remaining
fixed-image disposition and the additional bounded selector facts.

## Claims reviewed

The material claims were:

- resource key `0x00391270` decodes exactly to a 90-by-1515 source image with
  101 consecutive 15-row strips;
- `func_001F0C24` converts the two-bit source indices into the 90-by-15 cached
  image form, including the stated row strides and unwritten padding;
- the readable content, both known mapper paths, cache publication, and final
  rectangle-draw chain support an attack-label image-service exclusion;
- the complete 160-byte mapper returns only existing strip indices for every
  input that reaches the image helper through either known direct path;
- the aligned key-like occurrence in a retrieved 4,096-byte object lacks a
  typed resource-reference chain and remains an untyped occurrence;
- raw resource `0x00315736` publishes the twelve selector-table bytes beginning
  at header offset `0x08A0`, without proving a four-row argument domain or any
  field semantics; and
- accepted descriptor-10 text has no encoded direct edge or predecessor
  fallthrough into any instruction of `func_00201778`, while all indirect and
  external mechanisms remain unresolved.

## Review method and admissible falsifiers

I read the current canonical and parent rules, the reviewer workflow, the
frozen report and log, accepted r1 review and propagation, original assembly,
the accepted resource and overlay inputs, the frozen retrieval package, and
the complete worker evidence package. I inspected both worker images at
original resolution.

The independent checker did not execute the worker scripts or use their JSON as
calculation input. It pair-swapped and authenticated the parent V64 ROM,
implemented the accepted boot-LZ token contract independently, decoded both
resources directly from ROM, checked all words in the thirteen cited original
ASM files against that ROM, rebuilt all visible label pixels, verified the
mapper and call targets, inspected the retrieved occurrence, and enumerated
direct transfers across descriptor-10 text. I added COP0 and COP2 conditional
branch encodings to the worker's direct-edge classes as the strongest omitted
local alternative. Neither class occurs in this text.

The acceptance checks stayed within the claimed static grade:

| Claim | Supported producer and ordinary path | Smallest material falsifier |
|---|---|---|
| Fixed image | Direct key load in `func_001F0C24`, authenticated resource envelope, and the two known mapper call paths | A decode-length/hash mismatch, pixel-transform mismatch, or mapper output outside `0..100` would leave the image role or known-path safety unsupported. |
| Service exclusion | Mapped strip enters `func_001F0C24`, then `func_001F913C` and the rectangle command path | Non-label content or an established body/pose-state consumer of the returned buffer would defeat the proposed boundary. |
| Untyped occurrence | Frozen accepted-census object and its saved duplicate | A typed field schema or actual consumer loading this offset as key `0x00391270` would make the no-reference disposition unsafe. |
| Selector edge scope | Immutable descriptor-10 text and accepted selector placement | Any encoded direct transfer to `[0x00201778,0x00201798)` or sequential predecessor fallthrough would invalidate the local negative result. |

No mutation was needed. These are acceptance tests because each uses an
accepted ROM/resource producer, an ordinary static path, and a failure that
would change the assigned inventory conclusion.

## Admissible findings

There are no blocking findings.

### Fixed image and exact transformation

The raw V64 and normalized z64 identities matched. Resource key `0x00391270`
locates the size word at z64 `0x009254F0`. The stored stream is 15,951 bytes and
the independent decoder consumed all of it. The decoded object is 36,376 bytes
with SHA-256
`EFCE5F711D2B772C0B89E9501DE5EB0917FF36A5B09E48AC9425679283D3F870`.
Its header is magic `0x3634`, type 2, format 4, width 90, height 1515.

The original row-size helper yields 24 source bytes for format 4 and width 90,
and 48 destination bytes for format 0 and width 90. The image helper allocates
720 pixel bytes plus the eight-byte header. It multiplies its input index by 15
and processes fifteen rows. Each row reads 23 source bytes and writes 46
destination bytes. The four two-bit fields in each source byte become four
four-bit indices in most-significant-first order. Independent extraction
matched every visible destination index for all 90 pixels, fifteen rows, and
101 strips. Two destination bytes per row remained at the review sentinel,
which confirms the loop does not write them. The eight decoded bytes after the
1515 source rows remain unassigned.

The independently generated contact sheet is legible throughout. It includes
`Thrust`, `Slash`, `Sonic Boom`, `Magic Missile`, `Fireball`, `Healing`,
`Fatal Dance`, and `Supportive Attack` at the reported indices. The other rows
use the same attack, spell, or support-action label form. This supports the
attack-label content interpretation. The grayscale levels show index values;
they do not claim a retail palette or captured frame.

### Mapper, cache, and final draw chain

`func_00201B18` checks unsigned input below 160, reads the accepted 160-byte
table at z64 `[0x002122A4,0x00212344)`, and returns 100 otherwise. The table's
SHA-256 is
`82573F8DCC2E4C48106A9678BF709B4F6089A7BB27BF9C7FC04CA596076A29E1`.
Its values cover all 101 indices and never exceed 100. Thus both known direct
paths select an existing strip for every mapper input, conditional on the
accepted initialized retail table placement.

The first path preserves `s8` as the mapper input at z64 `0x001F2B2C`, calls
the mapper at `0x001F2B6C`, passes its result to `func_001F0C24` at
`0x001F2B74`, and passes the returned image to live `0x801B5CAC` at
`0x001F2B88`. The second path forms `s1` as incoming record `+0x24`, loads that
word at `0x00227FBC`, calls the same mapper/image/draw targets at
`0x00228028`, `0x00228030`, and `0x00228040`, and preserves the supplied screen
coordinates. No stronger meaning for the record field is needed.

The image helper stores the returned image, requested strip index, and
countdown 15 in sixteen 12-byte cache slots. This cache is separate from the
twenty-record body pools accepted in r1. The static slot count does not prove
runtime occupancy or safe behavior after slot exhaustion.

`func_001F913C` reads the image width and height, sets the source origin to
zero, and passes the image and screen coordinates to `func_001F8DDC` at live
`0x801B594C`. That function preserves the image pointer, passes image `+8`,
type, format, dimensions, and stride to live `0x801BA0DC`, then emits the
`E4`, `E1`, and `F1` texture-rectangle command sequence through display-list
root RAM `0x800E9BA0`. This is a complete static image-to-screen-rectangle path.

The readable label content plus both known mapper and draw chains support
classifying `func_001F0C24` as a shared attack-label image/cache service. It is
outside the selected body/pose family. Its shared interface and later matching
obligation remain visible. The claim does not rename the function, identify
every screen, or prove every indirect caller safe.

### Untyped key-like occurrence

The frozen retrieval package identifies one strict-census object and one saved
duplicate with the same 4,096-byte content and SHA-256
`E209E6F762BD942A0FA7B99339426055DB162F6130CDA453DAEAAF18D642E495`.
Independent inspection found `00 39 12 70` once, at aligned offset `0x05E8`,
with the reported neighboring words.

Viewing the complete object as 32-by-32 RGBA32 produces a coherent soft
green/cyan image. This is a plausible incidental channel-byte explanation for
the aligned value. It is not a typed format result. The frozen `SPRITE_CI8`
category is also a retrieval label rather than a consumer contract. No schema
or dataflow selects the occurrence as a resource key and forwards it to a
loader. The occurrence therefore does not count as another reference or
consumer of resource `0x00391270`. Its runtime format remains unassigned.

### Selector table and bounded control flow

Resource key `0x00315736` points to a raw 11,008-byte payload at z64
`[0x008A99BA,0x008AC4BA)`, with SHA-256
`94248DB2C97D0B6E4169200ED13C7F19FAC0E35DD4D85189DD292736D612C7E6`.
Applying the fixed-image boot-LZ decoder fails with a back-reference before any
valid output; the accepted raw-copy path is the applicable producer.

The initializer publishes payload-relative header offset `0x08A0` to selector
root RAM `0x801D0688`. The nearest greater published offset is `0x08AC`.
The intervening bytes are `90,80,70 / 80,90,80 / 70,80,90 / 255,255,255` and
match SHA-256
`69B7F9252B66C1A5BE65A65FB3CCA4684EEE0244F5D944AAA3A333BDC2EADAE2`.
These twelve bytes and the accessor's width-three indexing are verified static
facts. They do not establish a hard section boundary, a reachable four-row
domain, the meaning of any value, or whether the final row is a sentinel.

The independent descriptor-10 scan reproduced 1,242 JAL, 674 J, and 2,003
relative-branch encodings. No transfer targets any of the selector's eight
instructions. The added COP0 and COP2 branch alternatives had zero encodings;
the 64 COP1 branches were already covered. The preceding owner returns at
`0x00201770` and executes its delay instruction at `0x00201774`, so ordinary
fallthrough does not enter the selector.

The same scan found 301 `jr $ra` returns, 24 other JR sites, and 13 JALR sites.
Those 338 indirect transfers remain unresolved. Other overlay placements,
synthesized or relocated pointers, interior returns, runtime stores, and
unqueried execution states also remain outside the negative result. The frozen
broad scans retain their own corpus limits and do not turn the local result
into dead-code proof.

The new table bytes and local control-flow facts narrow the search. They do not
identify an actual consumer, prove reachable arguments, remove the matching
obligation, or support a semantic rename. The accepted family-table membership
and the consumer-provenance gate remain unchanged.

## Reused frozen evidence

The review reused these frozen inputs without changing them:

- accepted r1 research, independent review, and parent propagation;
- normalized Rev 0 ROM identity and descriptor-10 mapping;
- original assembly for the thirteen cited owners;
- frozen retrieval JSON SHA-256
  `2023DBAEEC012D857A27326BAB51380FC560B27D742AEB03B7C7CCC54A2C62BA`;
- its decoded resource and accepted-census occurrence object;
- the accepted project resource-codec contract; and
- all worker evidence frozen by `build/combat-discovery-r2/artifact-manifest.json`.

The active later selector retrieval was not read or used. Any result from that
assignment remains separate from this frozen subject.

Independent evidence:

- [review checker](../../../build/combat-discovery-review-r2/review_check.py)
- [accepted evidence](../../../build/combat-discovery-review-r2/accepted/review-evidence.json)
- [independent label sheet](../../../build/combat-discovery-review-r2/accepted/labels-independent.png)
- [independent occurrence hypothesis](../../../build/combat-discovery-review-r2/accepted/occurrence-independent-rgba32-hypothesis.png)
- [visual observations](../../../build/combat-discovery-review-r2/visual-observations.md)
- [preserved checker failure](../../../build/combat-discovery-review-r2/attempt-1/failure.md)

## Tests and results

| Acceptance check | Result |
|---|---|
| Frozen identity | Passed: report hash matched; report/log matched `1f68aa0`; worker artifacts matched their manifest; activation, retrieval, and r1 review commits are ancestors of the frozen subject. |
| Resource envelope | Passed: exact size-word location, 15,951 stored bytes, complete decoder consumption, 36,376 decoded bytes, expected header and hashes. |
| Pixel transform | Passed: 101 strips; 136,350 visible indices independently matched; each row wrote 46 bytes and left two review sentinels unchanged; eight trailing decoded bytes remained separate. |
| Visual content | Passed: both frozen and independent contact sheets were legible throughout and showed attack, spell, and support-action labels. |
| Mapper and direct paths | Passed: 160 bytes, range `0..100`, all 101 outputs present, both known mapper/image/draw call triples and their argument setup verified. |
| Cache/draw chain | Passed: sixteen-slot cache words, wrapper dimensions/origin, image payload call, display-list root, and `E4`/`E1`/`F1` commands verified. |
| Untyped occurrence | Passed: one aligned occurrence in the 4,096-byte object; strict-census and saved-file records share its hash; no typed resource-use chain was present. |
| Selector raw section | Passed: raw codec rejection, payload/header identities, published offset, nearest greater offset, twelve bytes, and accessor formula verified. |
| Selector direct-edge falsifier | Passed: zero direct edges and no fallthrough; worker transfer counts reproduced; COP0/COP2 alternatives were absent; all 338 indirect sites remain open. |

The first independent checker run stopped before creating output. The object
hash and occurrence offset had passed, but a review assertion compared a
40-byte slice starting at `0x05D8` with a 32-byte expected neighborhood starting
at `0x05E0`. I preserved the checker with SHA-256
`43A677CF77E6F62285D569588EB3492BB16C299C2D73D457903C000AA5B82837`.
Direct byte inspection identified the range mistake. The repaired assertion
uses `[0x05E0,0x0600)` and the checker passed in a clean `accepted/` output
root. The final checker SHA-256 is
`F5AFF16E4FE8A1E78F2BA8AE5DA22A11DD0981F48F88318AD2FA25ED09AE0789`;
accepted JSON SHA-256 is
`7F66F8F2985F8ADE8B3E159456589400AA0121666E152C93243592DB2DAC173F`.

## Evidence limits

- ROM bytes, resource lengths and hashes, table contents, instruction words,
  direct targets, and bounded transfer counts are **Verified static**.
- The attack-label role and service exclusion are **Supported** by readable
  content plus exact producer, mapper, cache, and draw chains. No claim is
  Editor-ready.
- The known mapper paths establish valid strip selection. They do not prove the
  input domain or bounds behavior of every possible indirect caller.
- The green/cyan occurrence image is a format hypothesis. It does not assign
  the object's schema or runtime role.
- The selector table's four width-three views are conditional. Argument domains,
  value semantics, actual caller, and reachable execution remain unproved.
- Saved placements prove placement only. The local direct-edge scan and frozen
  literal scans do not exclude indirect, synthesized, relocated, decompressed,
  or runtime-written transfers.
- No runtime operation, database mutation, external source, C compilation,
  build, source-policy classification, linked diff, or full-ROM verifier was
  used. This review does not confer matching-C acceptance.

## Documentation consequences

The Director may replace the r1 `func_001F0C24` Candidate row with a
**Supported exclusion** from the selected body/pose implementation family. The
inventory should describe it as a shared attack-label image/cache service,
retain its two known integration paths, and preserve its matching obligation in
the route that owns that service. The fixed-image resource/final-draw discovery
gate can be marked resolved at static scope.

The `func_00201778` row stays in the family as a table accessor with an open
consumer-provenance gate. The newly known bytes and local negative-edge result
may be recorded with their limits. The family remains incomplete until that
gate and every existing matching, ownership, placement, relocation,
target-byte, full-ROM, structural, and tooling requirement is satisfied.

## Exact next route

Director `/root` on host `local` should:

1. propagate the supported `func_001F0C24` attack-label image/cache service
   exclusion and mark its former resource/final-draw gate resolved at static
   scope;
2. retain `func_00201778` as a family member and keep its consumer-provenance
   gate open, including all argument-domain and indirect-transfer limits;
3. keep the active later selector retrieval outside this accepted r2 subject;
   if it supplies new evidence, route a bounded interpreted addendum and fresh
   independent review before changing the selector disposition; and
4. preserve all r1 family inclusions, shared interfaces, pool distinctions, and
   normal matching acceptance gates. This research review adds no source-review
   gate to ordinary matching work.

No r2 worker correction or proportional re-review is required. The reviewer
releases the claim, report, and ignored evidence writes after the terminal
collaboration handoff.
