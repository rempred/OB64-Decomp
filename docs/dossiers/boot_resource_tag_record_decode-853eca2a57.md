# boot_resource_tag_record_decode: compact-second-word-post-read-shift-order

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `853ECA2A57AC05619780F67FD6DDBC190FC21690C72465A8D91D649F7FE5B6CC`
- Observation: `311F84109D57A77078079D2730D35637CC1A8EE9CCBAEF70BDAE4C3FB13A1C6E`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_resource_tag_record_decode-853eca2a57.c)
- Metadata: [curated observation](boot_resource_tag_record_decode-853eca2a57.observation.json)

Source-bound compact second-word post-read shift scheduling pair. Four helpers and all other aligned primary regions match outside relocations; short-return block still loses one word. No linked or full-ROM acceptance.

## Source context

Complete five-body decoder with typed record view, frame5200, explicit prefix payload length, left-associated default cursor step and all four helpers already mask-exact. Candidate285CA723 emits sequential second-word byte reads followed by one left-associated OR expression; only compact+164 OR16/+168 SLL24 are swapped against retail in that compact path.

After the same four sequential input_byte calls, stage byte1<<=8, byte2<<=16, byte3<<=24 as ordinary post-read statements, then combine byte0|byte1|byte2|byte3. Do not shift during each byte read; separate high-shift initialization controls disturbed registers and load scheduling.

## Recorded observation

Candidate853ECA2A preserves exact compact-word registers, reads, stores, word extent and return-constant placement; its+164 is SLL v1,24 and+168 OR a1,a1,a2 as retail. Bounded body inspection reports zero differences in all four helper bodies. Both control and changed source are PURE_C and emit1832/52/100/148/80; after accounting for the short-record missing instruction, all other primary instruction regions now align.

## Remaining failure

Short-record guard still becomes far BNE/zero-return delay instead of BEQL/conditional byte store followed by inline J/zero. Whole owner is2212 versus2216, helper placements4 early, no accepted link or full-ROM proof. Source-bound staging observation only; not a universal scheduling recipe or original-source claim. Probe88A95F5B of the later negated guard demonstrates return merging/inversion by late-jump; GoldOx1458 is consulting on that separate blocker.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe boot_resource_tag_record_decode --source docs/archive/matching-c-candidates/2026-10-06-boot_resource_tag_record_decode-853eca2a57.c`. Check the metadata's expanded/header identities before interpreting its dumps.
