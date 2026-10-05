#include "game/resource_arena.h"

s32 resource_find_arena_index(void *pointer)
{
    s32 count = D_800AEDE0;
    s32 index = 0;
    if (index < count) {
        do {
            if ((u32)pointer >= (u32)D_800AEDB0[index].base &&
                (u32)pointer < (u32)D_800AEDB0[index].end) {
                break;
            }
            ++index;
        } while (index < count);
    }
    return index;
}
