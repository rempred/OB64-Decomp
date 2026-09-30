# Movement interface prerequisite — reviewed

The existing static movement-interface prerequisite is closed. Review covered
the research at `e7dc7320`, the failure/cost corrections at `5fb75627`, and the
queue-initialization clarification below. Sol may proceed with the already
authorized movement source work under the ordinary matching workflow.

The independent read-only review checked complete original words against the
authenticated normalized ROM, accepted metadata, selected source pairs and
direct caller evidence for `func_0012B1C4`, `func_0012D6FC`, `func_00107D60`,
`func_00107E38`, `func_0011AB74` and `func_0011AECC`. No unresolved static
interface issue blocks conversion. See the [research note](sol-movement-interface-research-20260930.md)
for the numeric field and caller contracts, and the
[parent family map](../../../../docs/Plans/squad-construction-family-map.md)
for the original prerequisite.

Carry these reviewed details into conversion:

- `107D60` diagnoses a signed predecessor at least `0x1000`; if the diagnostic
  returns, the jump at z64 `00107DB4` loops to its own live address `801B3674`.
  That path never reaches allocation. The original negative-index and allocation
  behavior is preserved, without adding new error handling.
- `107E38` initializes byte flags to zero and cost words to `0xFFFFFFFF`, then
  sets the starting-node cost to zero. Its 4,096 strided queue writes initialize
  only halfword `+4` to `0xFFFF` in each twelve-byte entry. Entry zero is then
  initialized separately at `+0/+2/+4` to `0xFFFF` and `+8` to `0xFFFFFFFF`.
  Do not interpret the queue loop as clearing all bytes of every entry.
- Preserve B1C4's unused second argument, D6FC's low-byte selector and original
  publication/failure ordering, E38's return being ignored by the reviewed
  callers, AECC's list/record contract, and AB74's mixed float/pointer ABI.

The complete authorized wave remains:

```text
func_0012B1C4 func_0012D6FC func_00107D60 func_00107E38 func_0011AB74
func_0011AECC func_00106F34 func_001070F4 func_00125298 func_00125460
func_00125F84 func_00126770 func_00126D24 func_0012B440 func_0012BC64
func_0012C788 func_0012D170 func_001305B4 func_00131828 func_00118D0C
```

This review establishes a bounded static contract, not matching-C acceptance or
runtime capacity, reachability or residency. The B1C4/D6FC instruction probes
still need canonical ownership, actual relocation and linked-byte proof; all
wave members retain the single complete-wave final verifier. The earlier
assembler audit predates later provisional sources and does not verify those
changed inputs.

E38 retains its full 1,736-byte owner, including eight original trailing zeros,
and the separate 32-byte `table_00142810`; this review authorizes no table/tail
ownership or compiler-contract change. `131828` retains its 492-byte owner and
all five accepted callable bodies (288/60/60/48/36 bytes). The movement consumer
continues through z64 `0012C788`. Existing protected, held, deferred and hybrid
interfaces remain under their prior dispositions.

No production source/configuration, structural foundation or tooling changed
for this review. No build, canonical diff, full-ROM verifier or runtime operation
was run. Agent Mail 517, 519–522 records the request and corrections.
