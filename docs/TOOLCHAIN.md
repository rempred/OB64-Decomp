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
node tools/verify_setup.js
```

This command runs the binutils smoke tests and full ROM setup gates. The
binutils smoke tests prove:

- `.word` emits exact big-endian bytes.
- Real MIPS instructions emit expected bytes.
- `.set noreorder` preserves the delay-slot instruction without inserted nops.
- The first tracked source chunk `0x00001000..0x00011000` assembles through
  `mips64-elf-as` and matches the baserom bytes exactly.

Current setup-complete result: PASS.
