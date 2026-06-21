# Rev 0 Original MIPS

Tracked source chunks promoted from the generated no-gap reference belong here.

The generated reference remains under `build/original-mips/rev0/` and is ignored.
Promote chunks deliberately with:

```powershell
node tools/promote_original_mips.js --count 1
```

`tools/assemble_original_mips.js` prefers matching files in this directory and
falls back to generated chunks for ranges that have not been promoted yet. Use
`--strict-tracked` only after every configured chunk has a tracked source file.
Promotion refuses to overwrite an existing tracked chunk unless `--force` is
supplied, so hand-split source is not accidentally replaced by generated output.
