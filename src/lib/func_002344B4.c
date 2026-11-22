#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
s32 D_801C8AC0(s32 a);
f32 vec3_distance(f32 *a, f32 *b);
s32 func_002344B4(BattleRosterRecord *u, s32 d) {
    f32 a[3];
    f32 b[3];
    a[0] = D_801C8AC0(4);
    a[1] = 0.0f;
    a[2] = 0.0f;
    b[0] = D_801C8AC0(u->row58);
    b[1] = 0.0f;
    b[2] = 0.0f;
    return vec3_distance(a, b) / d;
}
