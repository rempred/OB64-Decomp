# GNU Binutils 2.6 toolchain

The production Rev 0 build uses an authenticated Windows KMC GCC 2.7.2 compiler and a complete
native Windows/MSYS2 GNU Binutils 2.6 target chain.

```text
tracked assembly/data -> GNU 2.6 assembler
KMC GCC 2.7.2 C -> untouched compiler assembly -> target-section adjustment -> GNU 2.6 assembler
all objects -> GNU 2.6 linker -> GNU 2.6 objcopy -> canonical Rev 0 ROM
```

No compiler-assembly rewriting stage exists. GNU Binutils from another version may be used for
research, but it is not part of the active production configuration.

## Tracked contracts

- `config/toolchain.json` selects the production bundle, flags, and ignored local install root.
- `config/gnu-binutils-2.6-build.json` pins source, build host packages, patches, versions, every
  production executable, and the MSYS2 runtime.
- `config/phase7/conventional-build.json` pins the same production hashes for the baseline build.
- `config/matching-c-targets.json` pins the toolchain and build-provenance manifests for active C
  owners.

The source identity is Decompals `mips-binutils-2.6` commit
`54514ded39ceb32165a125ddba04ca5b551773a2`. The v0.3 Linux release is supporting comparison
evidence and is pinned by archive SHA-256
`5A612CD28344E5B410C3344EC5DCFB92D9D03947756F190CD12404055B4A624D`; a moving release URL is
not an identity.

The ignored production install root is:

```text
.toolchains/gnu-binutils-2.6-mips-kmc-elf-msys2/
```

It contains `as`, `ld`, `objcopy`, `objdump`, `nm`, `size`, `strings`, `strip`, and the pinned
`msys-2.0.dll`. Production resolution fails closed on the size and SHA-256 of every file.

## Reproducible build

Before building from a local source checkout, read every governing `AGENTS.md` from the checkout
root through the affected subtree, plus the source repository's `README` and build workflow.
Verify the checkout is exactly the pinned commit, then use an empty external work root and output
root:

```powershell
node tools/build_gnu_binutils_2_6.js `
  --source <pinned-mips-binutils-2.6-checkout> `
  --msys-root <pinned-msys64-root> `
  --work <empty-external-work-root> `
  --output <empty-external-bundle-root>
```

The script authenticates the source commit, build recipe, MSYS2 package inventory, all tracked
patches, output versions, and final executable/runtime hashes. It sets the reproducibility epoch
and rejects a nonempty work or bundle root.

After a successful build, populate the ignored local root from the authenticated bundle. Do not
commit tool binaries or generated compiler output.

## Patches and structural scope

The source build carries one host-compatibility patch and three narrow, opt-in target patches:

- modern MSYS2 host compilation compatibility;
- one allocated output section per `PT_LOAD`, dynamically sized program-header storage, and exact
  output-section LMA mapping;
- binary extraction in LMA order, required by fixed ROM loads and overlapping runtime overlays;
- symbol-matched MIPS `HI16`/`LO16` pairing across an intervening relocation emitted by KMC GCC.

Their paths, scopes, and hashes are in `config/gnu-binutils-2.6-build.json`. These patches preserve
the already accepted placement model; they do not authorize new boundaries, overlays, segments,
owners, or executable ranges.

GNU ld 2.6 predates the modern `PHDRS` path used by the former linker. The production linker script
therefore uses GNU 2.6 syntax, and the patched BFD backend emits and verifies one load segment per
nonempty allocated section. The project-owned ELF parser supplies structural inspection evidence;
no external modern ELF reader is an active dependency.

## Host runtime

The Phase 7 contract pins the Windows release and architecture, Node executable, PowerShell
version/executable, and the loaded `System.Management.Automation.dll`. The GNU 2.6 bundle pins its
own `msys-2.0.dll`. A normal build fails before assembly or linking if any of these runner
identities drifts.

Windows servicing may replace the ambient PowerShell executable or automation assembly. Keep the
authenticated pinned runtime outside the repository and select its root with
`powershellRuntimeRoot` in ignored `config/local-tools.json` (or
`OB64_POWERSHELL_RUNTIME_ROOT`). Normal build and verification commands pass that root through the
workflow and launch its version check with an isolated matching `WINDIR` and `DEVPATH`; agents do
not need to alter their shell environment. Exact hashes and the pinned version remain mandatory.

## Input flags

Tracked assembly/data uses:

```text
-G 0 -mips3 -mabi=32 -V -EB
```

KMC compiler output uses:

```text
-G 0 -mips3 -mabi=32 -force-n64align -EB
```

The linker uses `-EB -m elf32bmip`; objcopy uses `-O binary` after project-owned ancillary-section
removal. Exact flags remain tracked in the manifests.

## Matching-C compiler and source-to-object evidence

The compiler remains the authenticated Windows KMC GCC 2.7.2 `cc1.exe`, SHA-256
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. Its external path is
resolved through ignored local-tool configuration. `config/phase8/matching-c.json` pins its
manifest, executable identity, and compile flags.

Source-policy preprocessing has a separate two-executable identity chain. The tracked contract
pins the `mips64-elf-cpp.exe` driver and its GCC 12.2 `cc1.exe` preprocessing engine by role, path,
byte size, and SHA-256. The resolver confirms that the driver selects that exact engine before
preprocessing. Missing, changed, or unbound executables fail closed, and both identities appear in
source-policy evidence. This GCC 12.2 engine classifies source only; it is not the matching KMC
compiler.

For every active C or hybrid target, the build retains:

1. untouched `<symbol>.compiler.s` output from KMC;
2. `<symbol>.s`, derived only by replacing the sole `.text` directive with the accepted target
   section directive;
3. the raw GNU 2.6 source object before ancillary-section removal;
4. the linked object after removal of `.reginfo`, `.pdr`, `.comment`, and `.note`; and
5. `<symbol>.source-object-proof.json`, independently reproducible from tracked inputs.

The proof records source class, compiler and assembler identities/flags, artifact hashes, target
bytes, accepted load-relevant relocations, ancillary differences, final linked bytes, and sole
ownership. GNU 2.6 does not emit the former procedure-descriptor relocation. That retired
metadata remains visible as historical ancillary evidence but is not part of the active
load-relevant relocation contract.

## Verification

Run the focused toolchain suite from the repository root:

```powershell
node tests/binutils_smoke.js
node tests/active_targets.js
node tests/local_tools.js
node tests/source_policy.js
```

The smoke suite authenticates the complete bundle and checks big-endian words/instructions,
MIPS3/O32 flags and alignment, delay slots, historical KMC `move` expansion, explicit retail OR,
COP1 forms and the uppercase-prefix falsifier, adjacent `la`/direct-call relocations, numeric-call
behavior, macros/conditionals, custom sections, exact binary extraction, one-section `PT_LOAD`
and LMA behavior, an exact tracked assembly chunk, inactive p3066, and the absence of retired
production dependencies.

Normal build and verification remain:

```powershell
node tools/build.js
node tools/verify.js
node tools/audit.js
```

The normalized full-ROM acceptance hash is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Splat runtime

The accepted configuration uses Splat 0.34.0 at commit
`999c792fdda1002f29926717d2b7197bb90480a9`. Its external runtime and source checkout must satisfy
`config/splat/splat64-0.34.0.lock.json` and
`config/splat/splat64-0.34.0.provenance.json`. Machine-specific paths in those records are not
portable installation instructions.
