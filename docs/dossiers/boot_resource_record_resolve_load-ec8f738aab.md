# boot_resource_record_resolve_load: guarded-call-join-first-cse-counterexample

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `EC8F738AAB056E9084E1D5B35780E4B383A45F9C87BE52283806C771BD516F94`
- Observation: `25AC028220806A2A934AB8D9FD097AFE88D6BAE78491AE2326A474F4E4C8B547`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_resource_record_resolve_load-ec8f738aab.c)
- Metadata: [curated observation](boot_resource_record_resolve_load-ec8f738aab.observation.json)

Archive SIX source-bound BC8C-guarded evidence; canonical matching acceptance is separate.

## Source context

Complete exact Boolean-first-guard BC8C source is recoverable. GoldOx1394 proposed a simpler guarded dispatch followed by the repeated null test at the join; its compiler-stage expectation was untested in this source context.

Replace the Boolean-result first guard with if(buffer!=0){status=dispatch(...);} and then if(buffer==0)return before the real byte clear. All actual calls, accesses, widths and paths remain.

## Recorded observation

PURE_C EC8F738A emits516/frame312 with the same35 masked differences as the direct guard control. Authenticated D457E126F54 probe retains first guard262 -> join282 and second guard285 in RTL/JUMP. First CSE redirects262 to epilogue358 and deletes285, so the proposed join does not preserve the repeated branch in this complete source context. The measured exact Boolean E5FF78A696 context instead retains both guard270 and301 in first CSE. No universal rejection of guarded-call forms follows.

## Remaining failure

Nonselected readable control lacks eight retail bytes. Private linking remains unavailable; full-SIX acceptance belongs to canonical exact source after integration. No tooling defect or contract change is indicated.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe boot_resource_record_resolve_load --source docs/archive/matching-c-candidates/2026-10-06-boot_resource_record_resolve_load-ec8f738aab.c`. Check the metadata's expanded/header identities before interpreting its dumps.
