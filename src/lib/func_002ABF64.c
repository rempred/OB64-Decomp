#include "game/actor_queries.h"

/* Read the battle-side code for the roster entry referenced by this scene body. */
s32 func_002ABF64(s32 body_slot)
{
    QueryActor *scene_body = D_8022A974->actors[body_slot];
    u8 battle_roster_index;

    if (scene_body == 0 || (battle_roster_index = scene_body->battle_roster_index) == 0xFF) {
        return 0;
    }

    if (battle_actor_is_side_one(&D_801CE8BC->roster[battle_roster_index]) == 0) {
        return 1;
    }
    return 2;
}
