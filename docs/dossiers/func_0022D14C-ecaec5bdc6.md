# func_0022D14C: Real byte-before-extra source order is reversed by first scheduling

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `ECAEC5BDC67163195AEA28A38F072C0D0F82934B3B57D1F1003F66154A5C4F4E`
- Observation: `FEA8BDE12D8A1AE93DDCF10D8299A43A6E542B3FECAE7D55AB073B6F31EABD77`
- Source: [exact C](../archive/matching-c-candidates/2026-10-04-func_0022D14C-ecaec5bdc6.c)
- Metadata: [curated observation](func_0022D14C-ecaec5bdc6.observation.json)

Measured first-scheduling reversal of genuine byte-before-extra; preserve allocator counterexample.

## Source context

Sol private solmode; canonical ASM/table/source/config/build untouched. No flags/prototype change, fabricated bytes, artificial consumer/reference/identity or manual storage. Gold1012 suggested byte-before-extra order; the compiler stage counterexample was independently measured before publication.

Use one genuine shared context-byte local for the eighth F-path argument and assign its real byte read before emissionExtra=13 in all four existing paths. Keep separate mode selection and ninth-argument assignments.

## Recorded observation

Source6643794D/candidateECAEC5BD is PURE_C6844/frame616/177 actual relocations/131 ordered calls, raw333/892 including symbolic relocations. Authenticated probe0276EB36 has14 named artifacts/eleven dumps. RTL/COMBINE preserve base→byte77→extra76 order at2954/2956/2959,3158/3160/3163,3357/3359/3362,3662/3664/3667. First scheduling moves each extra13 assignment before its base/load. LREG keeps that order; GREG assigns base/byteV0 and extraV1 at all four sites. Thus merely reversing independent C statements does not obtain retail byteV1/extraV0. Promoting byte u8→s32 source3F90C3CC produces identical whole native text/every177R; narrowing extra to u8 source4E60F0C9 instead produces native/everyR identical to original612BC017, so no unchanged probes are repeated.

## Remaining failure

Neither control is selected. F-path context/extra allocation and branch delay scheduling remain nonexact, along with entry/type5/terminal issues. No linked bytes/ROM/complete17 wave acceptance. Retain current612 and shared-real-extra DF139 effect through this informative regression; it does not disprove every byte-before-extra control shape.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0022D14C --source docs/archive/matching-c-candidates/2026-10-04-func_0022D14C-ecaec5bdc6.c`. Check the metadata's expanded/header identities before interpreting its dumps.
