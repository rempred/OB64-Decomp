# Windows release migration — October 7, 2026

Status: accepted after audit, compiled controls and independent review. Director
mail1654 released mail1649's native-check hold on these unchanged inputs.

The PC restarted at 02:29 Eastern and Windows now reports `10.0.26300`, while
`config/phase7/conventional-build.json` pins `10.0.26200`. Both active workers
failed the existing host-runtime identity check before compilation. Their failed
recovery commands do not establish new candidate results.

The bounded change updates only `host.release` to `10.0.26300`. Compiler flags,
executable hashes, source policy, layout, ownership and authentication guards are
unchanged. The historical Phase 5B host description remains historical evidence.

An in-memory preflight confirmed that the old pin rejects and that the new release
passes the unchanged runtime authenticator, including the pinned PowerShell
executable, automation assembly and executed version. `node tests/local_tools.js`
passed. Evidence and copies of the preceding accepted proof are in
`build/audit/host-runtime-20261007/` (ignored).

QuietPond and LavenderSpire confirmed actual native-check drains in1651/1652.
Astra temporarily owns infrastructure configuration and canonical build outputs;
the workers retain their existing source assignments. Their mail watchers and
SilentCrane's mail watcher were recovered with existing identities/cursors. The
two Director stop monitors are deliberately stopped during this hold; preserve
their state when restoring them.

`node tools/audit.js --profile` ran once,13:40:19..13:57:37 UTC, exit0 in
1,038.567 seconds. Structural protections, exact baseline/current ROM, ownership,
relocations and independent fresh compilation passed. CURRENT is
`31978A79BE55B880042A14F8CBD02B6394D91228519B9FD055331A16A3C5EA84`;
baseline is `D6553DEDD807851A93DC37DB9A8E9CD0186DA99B0ED88A763E39BBBC56B4B32F`.
The41,943,040-byte ROM remains
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Generated reports (ignored):
- `build/audit/report.json`: `5C6979BE1D780A6EF5D31F8F9AF79E1821D3D4200040304238B8F332A787B5DD`.
- `build/setup/verify-setup-report.json`: `6B4097072EF78336D7BE961D0DCADD9E50A92AD07FBCE47D16700BFAA82E59E5`.
- `build/current/verification.json`: `28CF4A93E5AC7D2EE3AEE023ADFDAD85C0B17EE5A6B2819BEACE8EA2E852D06D`.
- `build/current/fresh-compilation.json`: `7CDF8AD7F7BA7620724A595496FF079C83A823DD636757824BD099082E89CF13`.

The unchanged verification hash reflects normalized, deterministic report content.
New CURRENT state, the new fresh report and the timing profile establish this run's
provenance. No source class, owner, relocation or accepted function count changed.
The OR-encoding and Squad structural canaries still pass.

Supported private controls in `build/matching/hostrelease-control/` both compiled
freshly as PURE_C with an authenticated isolated link. E18AA40C was exact; changing
only subtraction0x14 to0x15 produced D6D5A3BA with one differing instruction/byte
and `diagnosticExactBytes:false`. Both retain `acceptanceEligible:false`. The
bounded assertion record is `compiled-controls.json` in the evidence directory.

Independent reviewer `/root/host_runtime_migration_review` examined the actual
delta, report hashes, baseline/current runtime records, rebuilt ROM, fresh
provenance, controls and retained invariants and accepted the migration with no
blocking finding. All audit/control native jobs exited and the private guard is
absent. No repeat audit is needed for an unchanged commit or the existing CRLF
warning. Both Director stop monitors were restored with their existing config,
cursor and deduplication state; status and actual processes were checked. Mail1654
directs both workers to refresh affected context and resume their preserved
assignments. QuietPond retains the sole production role; this audit accepts no
unfinished candidate wave.

The ignored `notify-completion.py` in the evidence directory watches this audit's
process/result once and mails SilentCrane through the existing authenticated mail
helper. Its `completion-notifier-status.json` records delivery; it exits after an
acknowledged send. This event continuation is not a heartbeat or another audit.

Claude/GoldOx is separately unavailable: an actual resumed CLI request returned
401 expired OAuth. Joe must sign in again. The mail server remains healthy and
the existing advisory question is queued; do not repeatedly resend it or treat
`claude auth status` as proof that a token works.
