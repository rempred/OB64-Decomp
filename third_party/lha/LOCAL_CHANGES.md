# LHa game adaptation ledger

Baseline: the unmodified 1.14c distribution in `upstream/`. No upstream source
file has been edited. The following are ROM-supported differences to retain in
the adaptation; source drafts have not yet passed matching acceptance.

| Upstream area | Observed game change | ROM evidence / scope |
|---|---|---|
| `crcio.c::fillbuf`, `larc.c` input | Input byte reads use a memory stream with buffer at +8 and cursor at +16. | Bit readers beginning C65C and LArc readers F5A0..F808. |
| `fillbuf`, `calccrc` | Bit refill is inlined at its uses; the CRC update loop is inlined in output/copy helpers. | C65C, C778 and Huffman readers; C990 binary copy. |
| `fwrite_crc` | Text, verification-only and EUC paths are absent; retain the actual output and error path. | C778..C838, with C838 initialization and C938 delimiter conversion in the same physical owner. |
| `slide.c::decode_define` | Seven methods: lh1..lh5, lzs, lz5. The lh6 row is absent, so the LArc method test is 6. | Callback rows at ROM38B78..38BC8; consumer C310..C604. |
| Dictionary and state storage | Game dictionary size is 16-bit; CRC and Huffman work arrays are reached through separate pointers. | Load/store widths and pointer dereferences, recorded per producer. Do not combine independent globals into an invented structure. |
| `decode` allocation | No upstream null-allocation branch; game allocator/free calls and void return. | C310..C604. |
| `init_getbits`, `convdelim` | No EUC cache reset or multibyte-character option. | C838..C990. |
| `huf.c` | Fixed position alphabet parameters 14 and 4. | CB4C..D994. |
| `shuf.c` | Inlined table setup; retain observed game counts and separate block-state accesses pending exact proof. | EA98..F5A0. |
| Translation-unit packaging | One C producer must cover each complete preserved physical owner, including secondary functions; some logical functions span owners. | Driver C310, helper owner C778, dynamic DCA8, and combined E3F0..EA98. This is a build representation requirement, not evidence of historical source-file boundaries. |

Each adapted producer will add its path, upstream functions, exact local edits,
test hypothesis, and final linked-diff/verification outcome here. Unresolved or
parked work remains unfinished. No retained assembly is accepted as a completed
exception merely because the library has been identified.
