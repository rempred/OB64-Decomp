# Total Resolver R3 Phase 0 Inventory

Status: **Phase 0 complete; retained as the migration-boundary record**
Freeze date: 2026-08-17
Target: Ogre Battle 64 US Rev 0

The pre-R3 resolver boundary is frozen in `config/total-resolver/sources.json`. This preserves the
accepted R2 resolver and its five source identities while clean R3 acquisition is built beside it.
The old overlay and runtime atlases are historical references only; they cannot seed clean R3
dynamic evidence.

## Verification result

The existing R2 verifier suite passed without modifying the product:

```text
python -B -m unittest discover -s tests -p "test_*.py" -v
Ran 14 tests in 75.222s
OK
```

The suite covered ordinary resolver compatibility, all five adapters, read-only source opening,
evidence-lane separation, registry declarations, identity mutations, schema extensions, and
historical snapshot selection.

The new repo-local `doctor` then rehashed every frozen R2 artifact, the parent client and bridge,
and the external `ob64-core` branch/commit. Every check passed.

## Frozen identities

| Component | Frozen identity | R3 treatment |
|---|---|---|
| Unified Resolver R2 logical product | `72B4FB8A0D77267A5447B877A3756DE7A6C50947FF0A9C54BA7E63FF5B23232B` | Historical reference |
| Static DB R3 | `42B89420BE0939C654A890CCB13BEC08B2399E13F6E16CDB916F1D469794EDE7` | Static-feed candidate |
| Static resource chain | `316E6F19DE55A6F90E0B31027F8F1828DC24B650A6999E1066BD9D957E77B3DF` | Static-feed candidate |
| Static structure/field atlas | `EC4F34D5DC1BBEDEE27A504B051BB5205F5F91C26A634FAC2CCBCE74F7C44C52` | Static-feed candidate |
| Overlay Atlas R3 | `06B36CDC8917C5C81C99909729AFD138D17DF479CE8963EEABB69C795C6DFC3C` | Historical reference only |
| Runtime Provenance R3 | `D20A6290B36E9D36EAC912C3FD7FB45C641C59BD1AE882BEFD2C7850E6B83FDC` | Historical reference only |
| Parent `Pj64Agent` | `AD4BEEE14568556F497087A995627ADA0D5A8A7ABC57E52EAC0612C354F8C776` | Parity reference |
| Project64 bridge `0.6.8` | `FBF04CD9FB1E5852004C857EEB06C6A9F77FDC6BC34554F67C2046A1892202F2` | Protocol reference |
| Project64 `ob64-core` | `9F73D97A03AECEBFF62622AC2BE34E8B13B49404` | External runtime dependency |
| Decomp static source | `43A0AD3719F83EA4E6E31EF85F64D5BBD150DD6D` | R3 static foundation |

The external Project64 working tree contains pre-existing runtime/configuration outputs. R3 does
not adopt those mutable copies as source. The tracked parent bridge and client files above are the
Phase 1 parity references.

## Subsequent status

The maintained client and bridge first advanced to protocol `0.7.2`, then `0.8.0` for ordered
execution/input capture and exact-content deduplication. The current implementation is protocol
`0.17.0`; the frozen `0.6.8` hash above remains a historical migration input. See
`docs/total-resolver/implementation-status.md` for current behavior.
