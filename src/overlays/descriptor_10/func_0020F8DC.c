#include "game/battle_predicates.h"
#include "game/battle_record_flag.h"

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
extern inline s32 battle_actor_has_flag_12(void *record) {
    BattleRosterRecord *u = record;
    if (u == ((void *)0)) {
        return 0;
    }
    return (u->battle_flags >> 12) & 1;
}
extern inline int battle_actor_is_absent_or_has_flag_0(void *record) {
    if (record == 0) {
        return 1;
    }
    return ((const BattleRosterRecord *)record)->battle_flags & 1;
}
extern inline int battle_actor_has_flag_1(void *record) {
    if (record == 0) {
        return 0;
    }
    return (((const BattleRosterRecord *)record)->battle_flags >> 1) & 1;
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
s32 func_0020F80C(void);
s32 func_0020F8DC(void) {
    s32 actor_index;
    BattleUnit *u;
    if (func_0020F80C()) {
        return 1;
    }
    for (actor_index = 0; actor_index < 20; actor_index++) {
        u = battle_roster_lookup_actor_inline(actor_index);
        if (battle_actor_is_absent_or_has_flag_0(u)) {
            continue;
        }
        if (battle_actor_has_flag_1(u)) {
            continue;
        }
        if (battle_actor_has_flag_12(u)) {
            continue;
        }
        if (((BattleRosterRecord *)u)->actions_used < u->actsMax) {
            return 0;
        }
    }
    return 1;
}
