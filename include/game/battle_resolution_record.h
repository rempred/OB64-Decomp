#ifndef OB64_GAME_BATTLE_RESOLUTION_RECORD_H
#define OB64_GAME_BATTLE_RESOLUTION_RECORD_H

#include "game/battle_roster_record.h"

/* The resolution loops reorder this entire nine-word record. */
typedef struct BattleResolutionRecord {
    BattleRosterRecord *objects[3];
    int field0C;
    int field10;
    unsigned int unknown14[4];
} BattleResolutionRecord;

typedef char BattleResolutionRecordSizeCheck[sizeof(BattleResolutionRecord) == 0x24 ? 1 : -1];

void func_00231CC0(BattleResolutionRecord *records);
void func_00232280(BattleResolutionRecord *records);
int func_00230A9C(BattleResolutionRecord *record, int *outTime);
int func_0022F580(BattleResolutionRecord *record, int *outTime);

#endif
