#include "game/battle_roster_types.h"

#include "game/battle_position_lookup.h"

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
extern inline BattleUnit *BattleGetUnit(u32 actor_index) {
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
/* Return the first eligible actor at this formation position. */
void *func_0020D770(u32 formation_column, s32 formation_row) {
    s32 actor_index;
    BattleUnit *actor;
    if (formation_column >= 3 || formation_row < 0) {
        return ((void *)0);
    }
    if (formation_row >= 9) {
        return ((void *)0);
    }
    for (actor_index = 0; actor_index < 20; actor_index++) {
        actor = BattleGetUnit(actor_index);
        if (actor != ((void *)0) && !(actor->flags & 1) && actor->unk54 == formation_column && actor->unk58 == formation_row) {
            return actor;
        }
    }
    return ((void *)0);
}
