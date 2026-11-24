#include "game/effect_math_e04.h"

extern void *battle_roster_lookup_actor(unsigned int actor_index);

/* Read the scene actor's world Y coordinate. */
int battle_roster_get_actor_world_y(unsigned int actor_index)
{
    unsigned char *actor_bytes = battle_roster_lookup_actor(actor_index);

    return *(int *)(actor_bytes + 0x60);
}
