#include "game/battle_roster_types.h"

#include "game/class_comparison.h"

typedef unsigned char u8;
typedef signed int s32;

s32 func_0020BF98(void);
s32 battle_actor_is_side_one(void *record);
s32 battle_actor_is_side_zero(void *record);
s32 battle_actor_has_flag_9(void *record);

s32 func_00222604(void *record, s32 incoming_flags)
{
    s32 result;
    s32 flags;
    s32 selector;
    s32 predicate;

    flags = incoming_flags;
    result = 0;
    /* Retail performs this query even when the 0x8000 flag rejects the record. */
    selector = func_0020BF98();
    if (flags & 0x8000) {
        return 0;
    }
    if (battle_actor_is_side_zero(record) != 0 && (flags & 0x400) != 0) {
        result = 1;
    }
    if (battle_actor_is_side_one(record) != 0 && (flags & 0x400) == 0) {
        result = 1;
    }
    result &= 0 - (selector != 0);
    if (result != 0) {
        if (selector == 0xFF) {
            predicate = battle_actor_has_flag_9(record) != 0;
        } else {
            predicate = func_00045e5c(((BattleRosterRecord *)record)->primary_class_id.bytes.low, selector) != 0;
        }
        result &= 0 - predicate;
    }
    return result;
}
