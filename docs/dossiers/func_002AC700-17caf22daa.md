# func_002AC700: story-override-first-key-address-reuse

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `17CAF22DAA0B987D890247158504A00994BA2FD33686D16D1F08554184F8816E`
- Observation: `EFFA62CA1FB63D6B1490CDFACAE2801AF8B21ACB34012960F21643EF3D74DBD4`
- Source: [exact C](../archive/matching-c-candidates/2026-11-18-func_002AC700-17caf22daa.c)
- Metadata: [curated observation](func_002AC700-17caf22daa.observation.json)

Keep the sentinel guard and indexed scan as separately addressed operations.

## Source context

The full 0x90 producer has a sentinel guard followed by a 2-byte record scan. The matching candidate uses a separately addressed first key and typed indexing thereafter.

Spell the first key as table_002868F0[0].artKey instead of a byte read at its documented RAM address; leave the indexed loop unchanged.

## Recorded observation

KMC shares the address across the sentinel guard and scan. The full owner shrinks from 332 to 328 bytes and the divide tail, branch delay and loop initialization diverge.

## Remaining failure

Sharing the guard base shortens the body to 328 bytes and changes the retail branch and loop setup.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_002AC700 --source docs/archive/matching-c-candidates/2026-11-18-func_002AC700-17caf22daa.c`. Check the metadata's expanded/header identities before interpreting its dumps.
