# Testing Workflow B

The live Selection assignment uses the actual upstream permuter on an unfinished function. The historical exercises below cover concurrent workbench checks and transfer of a compiler observation. The prospective timing comparison is optional and has been deferred for Selection. [Production workflow](workflow-b.md#run-with-one-source-worker)

## Selection run on an unfinished function

On November 25 the worker ran upstream revision `059609d4` on `func_00150550` with the selected bundle B compiler. Both cases reproduced the starting object, decoded all 707 words, and included the 92-byte executable return tail. Each ran `permuter.py <case> -j 1 --stack-diffs --no-ignore-branch-targets --show-errors --abort-exceptions --show-timings`. The saved invocations identify the interpreter, case and working directory on Joe’s checkout.

| Search | Trials | Result |
| --- | ---: | --- |
| Loop setup and item pointer | 24 | The best heuristic score fell from 955 to 461. Its candidate had 68 differing words across the full function, compared with 36 for the starting source. [Invocation](../../build/matching/wb-army-a/perm-150550-preheader-r4/invocation.json) · [Generated C change](../../build/matching/wb-army-a/perm-150550-preheader-r4/output-461-1/diff.txt) |
| Display-list packet construction | 8 | The best score tied the starting 955. All iterations compiled. [Invocation](../../build/matching/wb-army-b/perm-150550-packet-r4/invocation.json) · [Search output](../../build/matching/wb-army-b/perm-150550-packet-r4/upstream.stdout.txt) |

The worker took a generated source from each search back through bundle B. Both compiled as `PURE_C`. The 36-difference parent remains the best source from this round. [Guarded 461 candidate](../../build/matching/wb-army-a/150550-p01-preheader-461.json) · [Guarded 955 candidate](../../build/matching/wb-army-b/150550-p02-packet-955.json)

## 1. Replay two candidates concurrently

On Joe's provisioned checkout, the Display worker retained two versions of the decimal parser. Revision 216 puts two instructions in the wrong places. Revision 227 uses a common assignment for the decimal-start flag; the historical comparison aligned all 611 instructions. These answers are public within the team, so exclude this exercise from time-to-discovery measurements. [Original experiment](../../build/matching/army-display/55B28-reconstruction.md)

Use two fresh, exclusively assigned sibling roots. The example generates short unique names for a rehearsal. It reads the recorded bundle B release and runs its launcher with its own selected manifest. A different machine needs the locally provisioned compiler, supported PowerShell host, ROM, selected bundle, inputs and the two candidate files. A Director preparing a live trial supplies the current release, target, sources and slot allocation. Check the active input/drain status before launching. A missing fixture, a failed guard or a busy slot is an explicit incomplete rehearsal.

```powershell
$ErrorActionPreference = 'Stop'
$checkout = (Get-Location).Path
$release = Get-Content -Raw -LiteralPath 'build/integration/army-records/selection-b-release.json' | ConvertFrom-Json
$launcher = (Resolve-Path -LiteralPath $release.launcher).Path
$manifest = (Resolve-Path -LiteralPath $release.selectedManifest).Path
if ((Get-FileHash -LiteralPath $manifest).Hash -ne $release.manifestSha256) {
    throw 'Selected manifest differs from its release'
}
function New-ReplaySlot ($source, $label) {
    $slot = 'build/matching/wb-' + [guid]::NewGuid().ToString('N').Substring(0,10)
    $null = New-Item -ItemType Directory -Path $slot -ErrorAction Stop
    $copy = Join-Path $slot 'candidate.c'
    Copy-Item -LiteralPath $source -Destination $copy
    [pscustomobject]@{ Label = $label; Slot = $slot; Source = $copy }
}
function Invoke-ReplayPair ($symbol, $jobs) {
    if ($jobs.Count -ne 2 -or $jobs[0].Slot -eq $jobs[1].Slot) { throw 'Two distinct slots required' }
    $pwshPath = (Get-Command pwsh -CommandType Application | Select-Object -First 1).Source
    $runs = @($jobs | ForEach-Object -ThrottleLimit 2 -Parallel {
        $ErrorActionPreference = 'Stop'
        Set-Location -LiteralPath $using:checkout
        $start = [datetimeoffset]::UtcNow
        $log = & $using:pwshPath -NoProfile -File $using:launcher watch $using:symbol --source $_.Source --scratch-root $_.Slot --inputs $using:manifest --native-concurrency parallel --json 2>&1
        $code = $LASTEXITCODE
        $end = [datetimeoffset]::UtcNow
        $path = Join-Path $_.Slot 'replay.log'
        $log | Set-Content -LiteralPath $path -Encoding utf8
        [pscustomobject]@{ Label = $_.Label; Slot = $_.Slot; Start = $start; End = $end; Exit = $code; Log = $path }
    })
    $runs | Format-Table Label, Slot, Start, End, Exit | Out-Host
    if ($runs.Count -ne 2 -or @($runs | Where-Object Exit -ne 0).Count) {
        throw 'Incomplete pair. Inspect each replay.log before comparing'
    }
    $lastStart = ($runs.Start | Sort-Object | Select-Object -Last 1)
    $firstEnd = ($runs.End | Sort-Object | Select-Object -First 1)
    if ($lastStart -ge $firstEnd) { throw 'No overlap between command intervals' }
    foreach ($run in $runs) {
        $r = Get-Content -Raw -LiteralPath $run.Log | ConvertFrom-Json
        if ($r.status -ne 'compiled' -or $r.sourceClass -ne 'PURE_C' -or
            $r.cached -ne $false -or $r.inputSetId -ne $release.inputSetId -or
            $r.nativeConcurrency -ne 'parallel' -or $null -eq $r.rawObjectRelocationMaskedExact) {
            throw "Unexpected workbench report in $($run.Log)"
        }
        [pscustomobject]@{ Label = $run.Label; Report = $r; Log = $run.Log }
    }
}
$jobs = foreach ($revision in 216,227) {
    New-ReplaySlot "build/matching/army-display/55B28-r$revision.c" "r$revision"
}
$display = Invoke-ReplayPair 'func_00055b28' $jobs
foreach ($row in $display) {
    if ($row.Report.rawObjectRelocationMaskedExact -ne ($row.Label -eq 'r227')) {
        throw "Unexpected result for $($row.Label). See $($row.Log)"
    }
}
```

**Pass:** two fresh native checks overlap at the command level, each writes a separate report, and only revision 227 passes the relocation-masked object comparison. This exercises the workbench up through candidate selection. The compiler phases may occupy only a small part of those intervals. The old independent operand and owner check and the subsequent accepted Display integration give the retail interpretation. [Owner comparison](../../build/matching/army-display/func_00055b28-owner-proof.txt) · [Accepted wave](../../build/integration/army-records/display-acceptance.json)

**Failure cases:** retain both logs when one candidate fails. A compiler error, changed input, or unsupported target earns no comparison result. If both compile and a local window improves while a protected call, table or earlier exact window regresses, keep the old best and retain the variant as a diagnostic. A cache hit is useful in ordinary work but invalidates a cold timing comparison.

## 2. Test reuse between two workers

**Reproducible transfer control.** Recruitment's `func_00219A14` also sets one flag under two conditions. Predict whether it benefits from Display's common assignment. Use the same PowerShell session as exercise 1. The code makes an equivalent split-assignment control in its own directory. It leaves the retained source intact. On the tested release the two Recruitment candidates produced identical native objects. Record this as **unchanged**.

```powershell
$recipient = 'build/matching/army-recruitment/func_00219A14.c'
$common = New-ReplaySlot $recipient 'common'
$split = New-ReplaySlot $recipient 'split'
$copyPath = (Resolve-Path -LiteralPath $split.Source).Path
$content = [IO.File]::ReadAllText($copyPath)
$old = 'if (selector < 5 || (u16)(selector - 0x32) < 5U) {'
$new = "if (selector < 5) {`n                        start_pose = 1;`n                    } else if ((u16)(selector - 0x32) < 5U) {"
if ($content.Split([string[]]@($old),[StringSplitOptions]::None).Count -ne 2) {
    throw 'Expected one recipient condition'
}
[IO.File]::WriteAllText($copyPath, $content.Replace($old,$new))
$recruitment = Invoke-ReplayPair 'func_00219A14' @($common,$split)
$objects = foreach ($row in $recruitment) {
    if (!$row.Report.rawObjectRelocationMaskedExact) { throw "Inspect $($row.Log)" }
    (Get-FileHash -LiteralPath (Join-Path $row.Report.artifactDir 'candidate.o')).Hash
}
if ($objects[0] -ne $objects[1]) { throw 'Recipient objects differ; inspect the first difference' }
```

**Live transfer.** Use two different functions from the ordinary assignments. The Director requests one concrete transfer test from the recipient; the third worker continues its target. Have the recipient write its own baseline and predicted effect **before** seeing the donor's final source. Start with the short description below.

> Two versions emitted the right arithmetic and loop body. Moving flag initialization corrected register assignment but displaced a literal from a branch delay slot. Combining two equivalent predicates at one assignment recovered both register choice and slot contents. Check whether your function has the same flag lifetime and common assignment. [Source pair and compiler observations](../../build/matching/army-display/55B28-decimal-flag-observation.json)

The recipient compares its current best with one candidate that applies the idea in its own source. It records local words gained and lost, first remaining difference, whole-function regressions, source/report locations, elapsed time and the donor reference. If the recipient has no suitable flag or delay-slot symptom, record why and look up the entry when a relevant target resumes. A second function with only a missing relocation makes a useful negative control: resolve the operand or contract first. A successful delivery and a successful transfer are separate outcomes. A transfer counts only when the **different** recipient function reproduces a predicted improvement against its own baseline; another run of the donor measures replay only.

## 3. Compare A and B prospectively

**Three-worker startup check.** At enrollment the Director names all six exclusive slots and the host budget. Each worker takes a different assigned target and two candidates prepared from the same parent. Use the `Invoke-ReplayPair` pattern with that worker's selected launcher, manifest and two assigned slots. For warm ordinary comparisons, record the actual cache flag in place of the cold-replay assertion. Retain per-round sources and use distinct report names when reusing a slot. Start one pair per worker together if the budget is six. Verify six distinct roots, overlap within each worker’s pair and overlap between workers’ command intervals. If the host can spare four slots, exercise 2/1/1 and record that configuration separately. A private root reporting busy, a guard rejection or a case with zero valid variants is recorded explicitly; it earns no timing win.

Use the next comparable, assigned near-matches. Choose the unit before seeing results: one worker, one function, one starting candidate and one investigation window. As a pilot default give each worker two cases, one with each workflow. Alternate order across workers (A→B, B→A, A→B), then reverse on a second round if available. Use new cases each time; solving the same function twice leaks the answer. Balance size, starting mismatches, family and evidence mode where possible. Mark cases that had prior exposure to a donor. Use identical pinned inputs within each comparison and the same three workers, active-work window and host-wide native-job ceiling. Record actual occupancy because B can consume spare slots. A uses ordinary matching. B adds repeated upstream permuter searches on the current near-match and carries supported findings to other targets. Count the permuter’s native compiles in the job budget.

| Capture one row per case | What to enter |
| --- | --- |
| Start | Worker, A/B, symbol, family, word count, starting candidate, first actionable mismatch, protected windows, input set, start time |
| Work | Time to first predicted improvement and to private exactness, elapsed worker time, fresh builds and cache hits, batch width, available CPU time if measured, wait/drain intervals |
| Reuse | Donor and recipient symbols, observation reference, result (improved, regressed, unchanged, inapplicable or untested), time to try it |
| Finish | Whole-function gains/losses, guards or regressions, exact private candidates, later canonical outcome, or best remaining difference when time expires |

Use a common 30-minute observation window as a starting point. A timeout ends measurement; the worker retains its assignment. Include failed and unfinished cases in the denominator. Report per-worker paired results, the median time to a first improvement among cases that improved, and the number that never improved, alongside fresh builds and CPU cost. Keep integration wait separate. If available, reuse [wave accounting](../../tools/wave-accounting.js) for elapsed profiles.

**Decision:** retain parallel batches for the tested mismatch family if B reaches a predicted improvement sooner in at least two of three paired comparisons without losing protected behavior or increasing invalid private handoffs. Evaluate sharing separately: one positive result on a different function demonstrates transfer; zero eligible recipients leaves transfer untested. An infrastructure failure or materially dissimilar cases warrants a rerun or an inconclusive result. Six cases support a next-pilot decision, not a project-wide speed estimate.

## Rehearsal result, November 25, 2026

Both PowerShell exercises above ran on Decomp `5498e13d` with the recorded bundle B input set. Each exercise started two fresh native comparisons concurrently. Each report identified the expected selected inputs, parallel mode, a fresh compile and `PURE_C`.

| Exercise | Result and local reports |
| --- | --- |
| Display, approximately 12 seconds for the pair | The relocation-masked object comparison distinguished [r216](../../build/matching/wb-ec498fb676/replay.log) from the exact [r227](../../build/matching/wb-044764d96f/replay.log). The independent historical owner check covers all 611 instructions. |
| Display idea applied to Recruitment, approximately 11 seconds for the pair | [Common assignment](../../build/matching/wb-02bdac144c/replay.log) and [split assignment](../../build/matching/wb-b2b28b0df5/replay.log) produced byte-identical object files. The recipient control already matched. This is one tested transfer opportunity with zero gain. |

These were historical-source exercises run by one operator in isolated scratch directories. Three-worker occupancy, live discovery and delivery of a new lesson, and comparative time to solve new functions remain prospective tests. No throughput estimate follows from the replay timings.
