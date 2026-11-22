#include "game/battle_roster_record.h"

int rand(void);
int func_00237810(BattleRosterRecord *a, BattleRosterRecord *b) {
    int v = (a->field_30 - b->field_30) / 2 + 5;
    if (v > 0) {
        return rand() % 100 < v;
    }
    return 0;
}
