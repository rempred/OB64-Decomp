#include "game/battle_roster_record.h"

int battle_actor_is_side_zero(void *record);
int battle_roster_find_actor_index(void *actor);
/* Return the selected candidate's roster index, or -1 if there are no candidates. */
int func_00233ED4(BattleRosterRecord *actor) {
    BattleRosterRecord *candidates[6];
    int candidate_count = func_002337E4(candidates, (-(battle_actor_is_side_zero(actor) == 0) & 6) | 2, actor->formation_column);
    if (candidate_count != 0) {
        return battle_roster_find_actor_index(func_00233D0C(actor, candidates, candidate_count));
    }
    return -1;
}
