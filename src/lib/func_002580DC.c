#include "game/effect_adapters_e08.h"
#include "common/types.h"
#include "game/effect_presentation_p05.h"
#include "game/effect_presentation_p04.h"

/* Only the two signed words read by this comparator are established. */
typedef struct P05ComparisonRecord {
    u8 unknown_00[0x54];
    s32 value_54;
    s32 value_58;
} P05ComparisonRecord;

extern void *battle_roster_lookup_actor(u32);


s32 func_002580DC(const void *leftView, const void *rightView)
{
    u8 index = *(const u8 *)leftView;
    P05ComparisonRecord *first = battle_roster_lookup_actor(index);
    P05ComparisonRecord *second = battle_roster_lookup_actor(*(const u8 *)rightView);
    s32 direction = -(func_0024BCE8(index) != 0) | 1;

    if (first->value_54 > second->value_54) {
        return direction;
    }
    if (first->value_54 < second->value_54 ||
        first->value_58 < second->value_58) {
        return -direction;
    }
    /* The original returns this direction even when both words tie. */
    return direction;
}

