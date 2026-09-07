# Combat selector input copy r1

## Outcome and scope

Status: completed.

Prepared the one authorized, no-overwrite working copy of the qualified animations-on Project64 state. The copy is byte-identical to the source. This data-only result grants no runtime or capture approval.

## Baseline and provenance

- Activation-ready release named by Director: `9844279`.
- Canonical repository branch/HEAD observed immediately before launch: `main` / `d2f2952ff8adfacda5675ca59028d294dcdf4ff8`.
- Launch ID: `COMBAT-SELECTOR-INPUT-COPY-20260907-01`.
- Frozen prerequisite records read at `9323e90`: `combat-capture-input-parsing-r1.md` and `combat-selector-run-preparation-r1.md`.
- Source: `C:\Users\Joe\Projects\OgreBattlel64\runtime-states\vanilla\rev0\battle\battle_loading_or_intro\Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip`.
- Destination: `C:\Users\Joe\Projects\OgreBattlel64\Test Savestates\combat-selector-explore-20260907-01\Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip`.
- The claim, report, ignored receipt root, destination directory, and destination file were absent in the fresh-surface check immediately before claim creation.
- Unrelated boot-production and shared-dispatch research changes were present and preserved.

## Claims and evidence grades

Claim: The destination was created without overwriting an existing file and is byte-identical to the assigned source.

- Evidence grade: `Verified` for file identity and copy mechanics only.
- Review status: `pending`.
- Scope and context: one source archive and one destination archive named above.
- Supporting artifacts: create-only destination open using `System.IO.FileMode.CreateNew`; SHA-256 and size receipt; full byte comparison.
- Independent corroboration: source hash measured before and after copying; destination hash measured afterward; all match. The byte comparator examined all `1407896` bytes.
- Competing interpretation: none within the file-copy scope.
- Falsifier: a differing byte, size, or SHA-256, an existing destination accepted as input, or a changed source hash after copying.
- Known limits: this verifies archive bytes only. It does not extract or parse the archive, establish a saved program counter, prove runtime state, or contact an emulator.
- Product consequence: the exact destination path is ready as a run-specific input for a separately authorized runtime assignment.

## Identity result

| Record | Size (bytes) | SHA-256 |
|---|---:|---|
| Source before copy | 1407896 | `464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583` |
| Source after copy | 1407896 | `464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583` |
| Destination | 1407896 | `464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583` |

Full stream comparison result: equal; `1407896` bytes compared.

## Changed surfaces

- `docs/Plans/task-logs/combat-selector-input-copy-r1.claim.json`
- `docs/Plans/task-logs/combat-selector-input-copy-r1.md`
- `build/combat-selector-input-copy-r1/identity-receipt.json` (ignored)
- `C:\Users\Joe\Projects\OgreBattlel64\Test Savestates\combat-selector-explore-20260907-01\Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip` (ignored)

## Failed paths and limits

No operation failed. No extraction, parsing, emulator/runtime contact or control, capture, database mutation, production-source change, staging, commit, push, branch, or worktree operation occurred.

The result carries only file identity and placement. Runtime loadability and post-load identity remain untested here and require separate authority.

## Evidence index

- Claim: `docs/Plans/task-logs/combat-selector-input-copy-r1.claim.json`; SHA-256 `CEC75F48C0A2FB895B1DDDAEBF52B976F20C76B650562B668A91A8E21B6CB7C3`.
- Identity receipt: `build/combat-selector-input-copy-r1/identity-receipt.json`; SHA-256 `38A9A8EBAAA5361A735AFE702CDA140FF63B884DD0A019A482BBC58092B9DFF0`.
- Source and destination paths and identities are listed above.

## Verification summary

- Assigned source hash matched before copying.
- Destination file creation used create-only semantics and would fail on collision.
- Source and destination sizes match.
- Source-before, source-after, and destination SHA-256 values match.
- A separate stream comparator matched all `1407896` bytes.
- Parent Git ignore rule `.gitignore:85:Test Savestates/*` covers the destination, and its ordinary exact-path Git status is empty.
- Canonical Git ignore rule `.gitignore:6:build/*` covers the receipt, and its ordinary exact-path Git status is empty.
- Only the owned claim and report appear as new ordinary canonical worktree entries.

## Protocol deviations

None.

## Proposed canonical-document changes

None.

## Next action

Director may bind the exact destination path and SHA-256 to a separately authorized selector runtime packet. All assignment writes are released at terminal handoff.