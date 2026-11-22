#ifndef OB64_GAME_BATTLE_PREDICATES_H
#define OB64_GAME_BATTLE_PREDICATES_H

#include "game/battle_roster_record.h"

/* These access the complete scene roster row returned by func_0020C478.
 * Like the adjacent battle_record_flag.h accessors, the boundary accepts
 * the callers' distinct local row views. The implementations use the
 * established roster fields; this does not equate those local C types.
 * Predicate names retain unresolved gameplay meaning. */
int func_0020C0CC(void *record);
int func_0020C1B4(void *record);
int func_0020C2D8(void *record);
int func_0020C348(void *record);
int func_0020C3B4(void *record);
int func_0020D6F8(void *first, void *second);
int func_002340EC(void *record);

#endif
