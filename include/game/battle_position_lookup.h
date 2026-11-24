#ifndef OB64_BATTLE_POSITION_LOOKUP_H
#define OB64_BATTLE_POSITION_LOOKUP_H

/* Return the matching battle-record address, or null. */
void *battle_roster_find_actor_at_position(unsigned int formation_column, int formation_row);

#endif
