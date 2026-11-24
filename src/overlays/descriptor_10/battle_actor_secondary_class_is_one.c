#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef signed int s32;

inline s32 battle_actor_secondary_class_is_one(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }
    return ((const BattleRosterRecord *)record)->secondary_class_id.word == 1;
}
