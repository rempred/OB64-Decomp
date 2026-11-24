#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef signed int s32;

inline s32 func_0020C104(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }
    return ((const BattleRosterRecord *)record)->secondary_class_id.word == 1;
}
