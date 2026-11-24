#include "game/battle_roster_types.h"

#include "game/battle_record_flag.h"

int func_0020C014(void *object)
{
    if (object == 0) {
        return 0;
    }

    return ((((BattleRosterRecord *)object)->battle_flags >> 8) ^ 1) & 1;
}
