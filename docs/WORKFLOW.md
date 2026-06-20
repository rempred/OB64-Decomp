# Decomp Workflow

The working loop is:

1. Choose a Rev 0 subsystem or function.
2. Generate or update a static dossier from parent MIPS artifacts.
3. Use overlay-aware addresses before interpreting any runtime RAM target.
4. Trace only narrowed questions with Project64 execute/read/write watches.
5. Ingest trace results into names, structs, jump tables, and m2c context.
6. Replace nonmatching assembly with C only when compare evidence supports it.
7. Promote semantic claims only after runtime trace or controlled mutation proof.

The parent workspace document `docs/mips-decomp-workflow-plan.md` is the
canonical process reference until this repo has its own full toolchain.

