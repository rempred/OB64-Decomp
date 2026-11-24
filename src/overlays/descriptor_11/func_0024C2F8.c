#include "game/battle_record_flag.h"

#include "game/effect_adapters_e08.h"

typedef struct P01Vec3 {
    float x;
    float y;
    float z;
} P01Vec3;

extern s32 battle_roster_find_actor_index_at_position(u32 first, s32 second);
extern void *battle_roster_lookup_actor(u32 index);

s16 func_0024C2F8(P01Vec3 *position)
{
    float first = position->z / 38.0f;
    float second = position->x / 38.0f;
    s16 result;

    first += 1.0f;
    second += 4.0f;
    result = battle_roster_find_actor_index_at_position((s32)first, (s32)second);
    if (result != -1) {
        if (battle_actor_is_absent_or_has_flag_0(battle_roster_lookup_actor(result)) != 0) {
            result = -1;
        }
    }
    return result;
}
