#include "game/battle_roster_types.h"

#include "game/battle_roster_side_one.h"

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
