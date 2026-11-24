typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
#include "game/battle_roster_types.h"
typedef BattleRosterRecord BattleUnit;
s32 func_002347B8(BattleUnit *actor);
f32 func_0023559C(BattleUnit *actor) {
    f32 base = func_002347B8(actor);
    s32 b = 0;
    if (actor != ((void *)0)) {
        if (actor->fatigue >= 70) {
            if (actor->fatigue < 80) {
                b = 5;
            } else if (actor->fatigue < 90) {
                b = 18;
            } else {
                b = 40;
            }
        }
    }
    return base - b;
}
