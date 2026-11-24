#include "game/battle_roster_record.h"

int D_801C8B84(void *record);
int D_801CA29C(void *actor);
/* Pick a candidate from the actor's column and return its roster index. */
int func_00233F94(BattleRosterRecord *actor) {
    BattleRosterRecord *candidates[6];
    int candidate_count = func_002337E4(candidates, (D_801C8B84(actor) == 0) << 3, actor->formation_column);
    if (candidate_count == 0) {
        return -1;
    }
    return D_801CA29C(func_00233D0C(actor, candidates, candidate_count));
}
