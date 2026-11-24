#include "game/effect_math_e04.h"

typedef struct Func001F0E64Record Func001F0E64Record;

extern void *battle_roster_lookup_actor(unsigned int);
extern void func_001F0E64(Func001F0E64Record *, unsigned int);

void func_0026C90C(unsigned int actor_index, unsigned int value)
{
    void **primary_children = battle_roster_lookup_actor(actor_index);
    unsigned int child_index;

    for (child_index = 0; child_index < 3; child_index++) {
        if (primary_children[child_index] != 0) {
            func_001F0E64(
                (Func001F0E64Record *)((unsigned char *)primary_children[child_index] + 0x44),
                value);
        }
    }
}
