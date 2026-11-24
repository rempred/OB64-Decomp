#include "game/battle_roster_types.h"

extern unsigned char *D_801CE8BC;

/* Look up one of the 20 scene roster slots with a nonzero primary class word. */
void *func_0020C478(unsigned int actor_index)
{
    unsigned int roster_byte_offset;
    unsigned char *scene_bytes;

    if (actor_index >= 20) {
        goto fail;
    }

    scene_bytes = D_801CE8BC;
    roster_byte_offset = actor_index * 0xF8;
    if (((BattleRosterRecord *)(scene_bytes + roster_byte_offset + 0x1C4))->primary_class_id.word == 0) {
        goto fail;
    }

    return &scene_bytes[roster_byte_offset + 0x1C4];

fail:
    return 0;
}
