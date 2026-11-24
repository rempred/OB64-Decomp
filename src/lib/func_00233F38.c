#include "game/battle_roster_record.h"

int battle_actor_is_side_zero(void *record);
int battle_roster_find_actor_index(void *actor);
/* Pick a candidate from the actor's column and return its roster index. */
int func_00233F38(BattleRosterRecord *actor) {
    BattleRosterRecord *candidates[6];
    int candidate_count = func_002337E4(candidates, (battle_actor_is_side_zero(actor) == 0) << 3, actor->formation_column);
    if (candidate_count != 0) {
        return battle_roster_find_actor_index(func_00233D0C(actor, candidates, candidate_count));
    }
    return -1;
}
