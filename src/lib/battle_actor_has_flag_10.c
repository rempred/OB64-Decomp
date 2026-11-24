#include "game/battle_roster_types.h"

int battle_actor_has_flag_10(void *object)
{
    if (object == 0) {
        return 0;
    }

    return (((BattleRosterRecord *)object)->battle_flags >> 10) & 1;
}
