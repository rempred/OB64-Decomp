#include "game/battle_roster_record.h"

int rand(void);
/* Roll a chance based on the difference between the two actors' luck. */
int battle_actor_roll_luck_advantage(BattleRosterRecord *source, BattleRosterRecord *target) {
    int chance = (source->luck - target->luck) / 2 + 5;
    if (chance > 0) {
        return rand() % 100 < chance;
    }
    return 0;
}
