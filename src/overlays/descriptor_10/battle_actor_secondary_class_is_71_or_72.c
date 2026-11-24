#include "game/battle_roster_record.h"

int battle_actor_secondary_class_is_71_or_72(BattleRosterRecord *record)
{
    if (record == 0) {
        return 0;
    }
    return (unsigned int)record->secondary_class_id.word - 0x47U < 2U;
}
