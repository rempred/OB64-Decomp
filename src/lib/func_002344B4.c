#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
s32 D_801C8AC0(s32 center_position);
f32 vec3_distance(f32 *center_position, f32 *actor_position);
s32 func_002344B4(BattleRosterRecord *actor, s32 divisor) {
    f32 center_position[3];
    f32 actor_position[3];
    center_position[0] = D_801C8AC0(4);
    center_position[1] = 0.0f;
    center_position[2] = 0.0f;
    actor_position[0] = D_801C8AC0(actor->formation_row);
    actor_position[1] = 0.0f;
    actor_position[2] = 0.0f;
    return vec3_distance(center_position, actor_position) / divisor;
}
