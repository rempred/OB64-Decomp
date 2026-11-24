#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x36];
    u16 items[4];
    u8 unk3E[2];
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    u8 unk50[4];
    s32 unk54;
    s32 unk58;
    u8 unk5C[0x14];
    s32 actsMax;
} BattleUnit;
extern u8 *D_801CE8BC;
extern inline s32 battle_actor_is_side_one(void *record) {
    BattleUnit *actor = record;

    if (actor == ((void *)0)) {
        return 0;
    }
    return (actor->flags >> 8) & 1;
}
extern inline BattleUnit *battle_roster_lookup_actor_inline(u32 actor_index) {
    u8 *scene_bytes = D_801CE8BC;
    s32 roster_byte_offset;
    if (actor_index < 20) {
        roster_byte_offset = actor_index * 0xF8;
        if (((BattleRosterRecord *)(scene_bytes + roster_byte_offset + 0x1C4))->primary_class_id.word != 0) {
            return (BattleUnit *)(scene_bytes + (roster_byte_offset + 0x1C4));
        }
    }
    return ((void *)0);
}
/* Find the first actor with battle flag bit 8 set. */
BattleUnit *battle_roster_find_first_side_one(void) {
    s32 actor_index;
    BattleUnit *actor;
    for (actor_index = 0; actor_index < 20; actor_index++) {
        actor = battle_roster_lookup_actor_inline(actor_index);
        if (battle_actor_is_side_one(actor)) {
            return actor;
        }
    }
    return ((void *)0);
}
