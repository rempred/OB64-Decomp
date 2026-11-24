#include "game/battle_roster_types.h"

#include "game/battle_record_flag.h"

int battle_actor_is_side_one(void *record)
{
    if (record == 0) {
        return 0;
    }

    return (((BattleRosterRecord *)record)->battle_flags >> 8) & 1;
}
