# 0E64: full-width predicate and halfword storage

This source record preserves the pure-C boundary and the specific minimal-hybrid result for `func_001F0E64`. The Director's target-specific authorization is recorded at `0a0d17a7` in the [supplement assignment](../prompts/combat-discovery-supplement-r2.md). The other twelve targets retain their PURE_C assignments, and all thirteen still require the single completed-wave verifier.

## Pure-C effort and the remaining word

Eleven distinct authored C inputs were measured: the first canonical focused source and ten private controls. They preserve the full-width zero test, the low-byte sentinel test, three ordered random calls, unsigned arithmetic and original store/call order. The initial focused result has the correct248-byte extent but34 differing bytes/21 words. Separating the combined random value and using a signed field for the observed minus-one halfword removes part of that residual. Source lifetime and halfword-value controls reach two differing bytes in one word.

The best pure-C source, `halfword-signed-input`, differs only at offset0x28: retail tests the full value held in s0, while this candidate tests the original full-width argument in a1. The authenticated probe begins with full-width SI73 and separate stored-halfword HI77. They remain simultaneously live and conflict; allocation prefers a1 for SI73 and s0 for HI77. The halfword move happens to retain the original full bits in its physical register. That observation does not make the narrowed C value equivalent for a zero test: an input such as0x10000 must remain nonzero.

The bounded `late-halfword` control defers conversion until after full-width selection and keeps the later halfword arithmetic/stores. It is full-domain correct, but loses the original initial copy and produces119 differing bytes/38 words. It is a counterexample to this concrete source transfer, not proof that pure C is inherently impossible. No further productive pure-C coalescing step was supported by the available evidence at the Director's decision.

## Minimal hybrid and its removal control

The exact hybrid keeps the working selector full-width and binds it to register16. All tests, arithmetic, calls and stores remain C; there is no assembly template or explicit instruction. `bound-removal` removes this one binding and differs by24 bytes/16 words while retaining the original extent/frame. The final source adds only explanatory comments to the first exact bound input. This establishes necessity in the measured source context, not a global minimum proof.

The original pure reference and the failed conversion remain recoverable for future PURE_C work. HYBRID_C exact is not matching C. Research import/preservation does not establish canonical ownership or complete-wave acceptance.

The final canonical focused check passes on `hybrid-final`: HYBRID_C, the sole C-object contribution from `objects/c/func_001F0E64.o`, no fallback or fill, accepted placement, all five relocation words and the recorded contract, and zero differing linked bytes/words. Linked and expected SHA-256 are both `CA3B27E47695D9C6A49825E29861359A1B814C8897B46C5DCA83455CEA88A399`. This result remains provisional until the complete thirteen-target supplement passes its final verifier.

| Input | Authored SHA-256 | Compiler-input SHA-256 | Extent / frame | Different bytes / words |
| --- | --- | --- | --- | --- |
| halfword-signed-input | `8F8DFB18711540E97B0425E9CE4D886E09F6D1740C9F10421016237B2CE3642E` | `6EDADA702CA7B728CB945ACB63D04D62C804CFD8D83C05172393ADB7AC28CBD1` | 248 / 32 | 2 / 1 |
| late-halfword | `39473792300D58E2CEC7E7D87BF357195474513D75B3E02A907D9AE6BD07E919` | `73A960870FC976FBBD69DE83D95647C36609F7E45D9A1337D91E2B5EF50296C1` | 248 / 32 | 119 / 38 |
| bound-removal | `F5F76A6B9C2E9BFF57CA2ADECFDCA5DDADACB12495FA4A400FFF68E57B25D209` | `B99E43479B7737E3FB761ECB8F63E37CCB747370E687850EE9A683F0E38C01C0` | 248 / 32 | 24 / 16 |
| hybrid-final | `0C3B8385D4ECBEC09A1345B998A15BF61D170ED94DB05F1C6E1425ED975654A8` | `DDB1AC3AF949780428F5606104B86C097C7F521F3B7C7FBCC5CEFA38DB4E773B` | 248 / 32 | 0 / 0 |

Every table row has five candidate relocations. Table measurements use the private one-owner link; the current wave remains incomplete. The near-exact pure source and the earlier `staged` context have pinned/probe instruction agreement with only file-directive and requested diagnostic-option comments normalized. These probe facts apply to their exact source contexts.

## Evidence and reuse

Use `node tools/match.js intake func_001F0E64 --limit 50 --json` to retrieve the exact archived source comparisons. The preceding first focused report is `build/combat-discovery-supplement-r2/001F0E64-first-focused.json`, SHA-256 `729086E75CAF48B99B66F7871C30C51B0389835B86C968FFFD20731E0001DA1E`; its initial empty relocation list differs from the five candidate relocations and must not be presented as an accepted contract.

Private source/results are under `build/combat-discovery-supplement-r2/001F0E64/<input>/`. Their result SHA-256 values are `6E6E867DE852481725DD78CF16F3A1A8E63365ABD9076A683D7B0FBC7E1BFBB6` for the pure best, `B732331EAC4A959766934E351753BCAF6B56D7E7D28E523FD6A29F4B936A4952` for late conversion, and `F69C6EEBD523D763F8B21D127CC158D0336438FB987EC94299D7A84EEC3D9D29` for binding removal. The `001F0E64-probe-agreement.json` identity is `B332A2B9E5FF8273ABF6E440B8C87ADF0A59870F1DD71639AEE2267A7BF39DC8`; it binds the exact probe directories and assembly identities. Bulk compiler and ROM evidence remains ignored.

Final focused report: `001F0E64/hybrid-final/focused.json`, SHA-256 `9647DDBC6BCDB6776CFDC7E58A78E9F2A442F0204360AAF246AA69D22F1BB7CC`. Its private result SHA-256 is `24B1363824D4F614EBEDDBC3C2125C99359DD6987F467A445BD50286BC498681`.
