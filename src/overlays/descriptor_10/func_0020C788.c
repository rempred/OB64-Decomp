#include "game/battle_record_flag.h"
#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801CE8BC;
extern inline s32 func_0020BFF8(void *record) {
    BattleRosterRecord *actor = record;

    if (actor == ((void *)0)) {
        return 0;
    }
    return (actor->battle_flags >> 8) & 1;
}
extern inline int func_0020C0E8(void *record) {
    if (record == 0) {
        return 0;
    }
    return (((const BattleRosterRecord *)record)->battle_flags >> 9) & 1;
}
extern inline BattleRosterRecord *BattleGetUnit(u32 actor_index) {
    u8 *scene_bytes = D_801CE8BC;
    s32 roster_byte_offset;
    if (actor_index < 20) {
        roster_byte_offset = actor_index * 0xF8;
        if (((BattleRosterRecord *)(scene_bytes + roster_byte_offset + 0x1C4))->primary_class_id.word != 0) {
            return (BattleRosterRecord *)(scene_bytes + (roster_byte_offset + 0x1C4));
        }
    }
    return ((void *)0);
}
BattleRosterRecord *func_0020C788(void) {
    s32 actor_index;
    BattleRosterRecord *actor;
    for (actor_index = 0; actor_index < 20; actor_index++) {
        actor = BattleGetUnit(actor_index);
        if (func_0020BFF8(actor) && func_0020C0E8(actor)) {
            return actor;
        }
    }
    return ((void *)0);
}
