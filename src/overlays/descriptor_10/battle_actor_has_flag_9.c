#include "game/battle_roster_types.h"

#include "game/battle_record_flag.h"

inline int battle_actor_has_flag_9(void *record)
{
    if (record == 0) {
        return 0;
    }
    return (((const BattleRosterRecord *)record)->battle_flags >> 9) & 1;
}
