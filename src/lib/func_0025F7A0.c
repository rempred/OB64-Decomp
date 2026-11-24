#include "game/effect_math_e04.h"

extern void *func_0020C478(unsigned int actor_index);

/* Read the scene actor's world Y coordinate. */
int func_0025F7A0(unsigned int actor_index)
{
    unsigned char *actor_bytes = func_0020C478(actor_index);

    return *(int *)(actor_bytes + 0x60);
}
