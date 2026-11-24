#include "game/battle_roster_types.h"

#include "game/battle_record_flag.h"

int battle_actor_is_side_zero(void *object)
{
    if (object == 0) {
        return 0;
    }

    return ((((BattleRosterRecord *)object)->battle_flags >> 8) ^ 1) & 1;
}
