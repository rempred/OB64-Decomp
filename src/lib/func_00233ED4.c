#include "game/battle_roster_record.h"

int D_801C8B84(void *record);
int D_801CA29C(void *actor);
/* Return the selected candidate's roster index, or -1 if there are no candidates. */
int func_00233ED4(BattleRosterRecord *actor) {
    BattleRosterRecord *candidates[6];
    int candidate_count = func_002337E4(candidates, (-(D_801C8B84(actor) == 0) & 6) | 2, actor->formation_column);
    if (candidate_count != 0) {
        return D_801CA29C(func_00233D0C(actor, candidates, candidate_count));
    }
    return -1;
}
