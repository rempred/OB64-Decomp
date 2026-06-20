# tools

Repo-local decomp tools belong here.

Initial expected tools:

- ROM byte-order normalization.
- Rev 0 extraction from `config/segments/rev0.yaml`.
- Original MIPS disassembly emission into `asm/original/`.
- Build and compare helpers.
- Function dossier import from the parent workspace.

Tools should be deterministic and should not require ROM binaries to be tracked.

