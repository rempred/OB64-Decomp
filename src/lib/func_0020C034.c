#include "game/battle_roster_types.h"

int func_0020C034(void *object)
{
    if (object == 0) {
        return 0;
    }

    return (((BattleRosterRecord *)object)->battle_flags >> 10) & 1;
}
