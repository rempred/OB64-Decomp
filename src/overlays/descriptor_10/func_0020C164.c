#include "game/battle_roster_record.h"

int func_0020C164(BattleRosterRecord *record)
{
    if (record == 0) {
        return 0;
    }
    return (unsigned int)record->variant4C.word - 0x47U < 2U;
}
