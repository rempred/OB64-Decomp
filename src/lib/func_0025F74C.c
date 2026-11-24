#include "game/effect_math_e04.h"

extern void *battle_roster_lookup_actor(unsigned int index);
#include "game/battle_roster_types.h"
extern int func_0020BDFC(BattleRosterRecord *value);

int func_0025F74C(unsigned int index)
{
    return func_0020BDFC(battle_roster_lookup_actor(index));
}
