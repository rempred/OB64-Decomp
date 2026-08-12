# Toolchain

The setup-complete MIPS assembler path is GNU binutils from the N64-focused
`n64-tools/gcc-toolchain-mips64` release.

## Config

Tracked config: `config/toolchain.json`

Current toolchain:

- ID: `n64-tools-gcc-toolchain-mips64-win64`
- Kind: GNU binutils
- Source project: `https://github.com/n64-tools/gcc-toolchain-mips64`
- Archive:
  `https://github.com/n64-tools/gcc-toolchain-mips64/releases/download/latest/gcc-toolchain-mips64-win64.zip`
- Archive SHA256:
  `7EE3598AC151C0A728DCFD916E3DF615793D2ED0A28CDC0CCAFA31EEF76526BB`
- Local install root: `.toolchains/gcc-toolchain-mips64-win64/`
- Assembler: `bin/mips64-elf-as.exe`
- Objcopy: `bin/mips64-elf-objcopy.exe`
- Assembler flags: `-EB -mips3 -32`
- Objcopy flags: `-O binary -j .text`

`.toolchains/` is ignored and must not be committed.

## Production Splat Runtime

The accepted configuration targets Splat `0.34.0` at commit
`999c792fdda1002f29926717d2b7197bb90480a9`.

The runtime, source checkout, downloaded packages, and virtual environment stay
outside tracked files. The canonical lock and provenance records are:

- `config/splat/splat64-0.34.0.lock.json`;
- `config/splat/splat64-0.34.0.provenance.json`.

Use only an authenticated runtime that satisfies both records. Do not treat the
machine-specific paths inside the accepted lock as portable installation paths.

## Matching-C Compiler

The accepted matching-C path uses KMC GCC 2.7.2 on the pinned Windows host.

The compiler is an external prerequisite. This repository does not track its
binary, acquisition record, or build environment.

`config/phase8/matching-c.json` pins the accepted compiler hash and flags.
Supplying a different compiler must fail before a matching result is accepted.

## Compiler-Assembly Dialect Stage

The effective matching toolchain now has three authenticated stages:

```text
KMC GCC 2.7.2 compiler
-> compiler-assembly dialect adapter
-> GNU assembler 2.39 with -EB -mips3 -32
```

`config/compiler-assembly-dialect.json` pins both executable identities, both flag sets, and the
adapter module SHA-256. `config/matching-c-targets.json` pins that manifest by path and SHA-256.

The schema-2 adapter has two target-blind rules for eligible `PURE_C` output. It rewrites complete
numeric-register `move` statements as `addu` statements with `$0` as the third operand. It can also
rewrite the authenticated adjacent external-symbol `la $4` plus direct `jal` subset into explicit
`lui`, `jal`, and delay-slot `addiu` instructions under a temporary `.set noreorder` boundary. Both
symbols must match `[A-Za-z_][A-Za-z0-9_]*`, and the address symbol must be undefined within the
translation unit. The latter rule preserves exact HI16, MIPS26, and LO16 relocation semantics and
restores the prior effective assembler mode. Current-location, section, dot-prefixed, expression,
addend, register-call, and `jalr` forms remain untouched; register-valued `la` address operands and
other malformed or unsupported input fail closed.

Complete unlabeled numeric `mtc1 $N,$fN` and `mfc1 $N,$fN` compiler statements pass through
byte-identically and record zero transformations. Each register must be in the range 0 through 31.
Malformed, named, labeled, extra-operand, and out-of-range forms reject, as do COP0 transfers,
control-register transfers, `mov.s`/`mov.d`/`mov.ps`, and unproven doubleword transfers.

GNU assembler 2.39 remains the production assembler. The authenticated historical KMC assembler
is a behavioral oracle for the second rule, not a build dependency. `-O2` is the pinned production
compiler configuration but is not a demonstrated historical eligibility requirement.

`HYBRID_C` output bypasses parsing as byte-identical data with zero total and per-rule
transformations. `UNKNOWN` source classification fails before compilation or adaptation.

Each compiled target retains these authenticated stages:

1. `<symbol>.compiler.s` is untouched compiler output.
2. `<symbol>.dialect.s` is adapter output or exact hybrid passthrough.
3. `<symbol>.s` contains only the target-section adjustment consumed by GNU assembler.
4. `<symbol>.dialect-proof.json` records identities, decisions, hashes, counts, object, and target.

Strict verification recreates the adapted assembly, section adjustment, and proof independently.
Missing artifacts, stale schemas, identity drift, or proof drift must fail verification.

## Install

From the repo root:

```powershell
New-Item -ItemType Directory -Force .toolchains\downloads
Invoke-WebRequest `
  -Uri "https://github.com/n64-tools/gcc-toolchain-mips64/releases/download/latest/gcc-toolchain-mips64-win64.zip" `
  -OutFile ".toolchains\downloads\gcc-toolchain-mips64-win64.zip"
Get-FileHash -Algorithm SHA256 ".toolchains\downloads\gcc-toolchain-mips64-win64.zip"
Expand-Archive ".toolchains\downloads\gcc-toolchain-mips64-win64.zip" ".toolchains\gcc-toolchain-mips64-win64" -Force
```

The hash must match `config/toolchain.json`.

## Verify

Run:

```powershell
$phase5aRoot = '<accepted-phase5a-product-root>'
node tools/verify_setup.js --phase5a-root $phase5aRoot
```

The Phase 5A product remains external to this clean-room repository. The command
runs the binutils smoke tests and full ROM setup gates. The
binutils smoke tests prove:

- `.word` emits exact big-endian bytes.
- Real MIPS instructions emit expected bytes.
- `.set noreorder` preserves the delay-slot instruction without inserted nops.
- The first tracked source chunk `0x00001000..0x00011000` assembles through
  `mips64-elf-as` and matches the baserom bytes exactly.

Current setup-complete result: PASS with 21 checks on the accepted Windows host.
