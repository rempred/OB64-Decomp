#include "game/effect_adapters_e08.h"

/* Only these two word offsets are established by this consumer. */
typedef struct C3ecRecordView {
    u8 unknown_00[0x54];
    u32 value_54;
    u32 value_58;
} C3ecRecordView;

extern void *battle_roster_lookup_actor(u32 index);

s16 func_0024C3EC(u8 value)
{
    C3ecRecordView *record = battle_roster_lookup_actor(value);

    return (s16)(record->value_58 * 3U + record->value_54 + 20U);
}
