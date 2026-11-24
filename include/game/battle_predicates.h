#ifndef OB64_GAME_BATTLE_PREDICATES_H
#define OB64_GAME_BATTLE_PREDICATES_H

#include "game/battle_roster_record.h"

/* These access the complete scene roster row returned by battle_roster_lookup_actor.
 * Like the adjacent battle_record_flag.h accessors, the boundary accepts
 * the callers' distinct local row views. The implementations use the
 * established roster fields; this does not equate those local C types.
 * Predicate names retain unresolved gameplay meaning. */
int battle_actor_has_flag_12(void *record);
int battle_actor_secondary_class_is_45_to_48(void *record);
int battle_actor_has_flag_5(void *record);
int battle_actor_has_flag_4(void *record);
int func_0020C3B4(void *record);
int func_0020D6F8(void *first, void *second);
int func_002340EC(void *record);

#endif
