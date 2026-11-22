#ifndef OB64_GAME_UNIT_RECORD_LOOKUP_H
#define OB64_GAME_UNIT_RECORD_LOOKUP_H

/* Each predicate reads the runtime unit's source-index byte at +4. */
int func_0012DA10(void *unit);
int func_0012DA9C(void *unit);

/* Read the flags word at +0 and source index at +4 to locate a row. */
int func_0012E968(void *unit);
int func_0012DB2C(void *unit);
int func_0012E8EC(void *unit);

#endif
