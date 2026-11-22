#include "game/battle_roster_record.h"

int D_801C8B84(void *record);
int D_801CA29C(void *u);
int func_00233F38(BattleRosterRecord *u) {
    BattleRosterRecord *list[6];
    int n = func_002337E4(list, (D_801C8B84(u) == 0) << 3, u->column54);
    if (n != 0) {
        return D_801CA29C(func_00233D0C(u, list, n));
    }
    return -1;
}
