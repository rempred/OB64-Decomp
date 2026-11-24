#include "game/battle_roster_record.h"

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
s32 func_00235754(BattleUnit *actor, BattleUnit *target);
s32 func_00235BB0(BattleUnit *actor, BattleUnit *target);
s32 func_00235DC8(BattleUnit *actor, BattleUnit *target);
s32 func_0023697C(BattleUnit *actor, BattleUnit *target, f32 power, s32 c, s32 d, s32 e);
s32 func_00237750(BattleRosterRecord *actor, BattleRosterRecord *target, s32 c, s32 d, s32 e) {
    f32 power;
    if ((u8)(actor->action_kind - 4) < 2) {
        power = func_00235BB0((BattleUnit *)actor, (BattleUnit *)target);
    } else if (actor->action_kind == 3) {
        power = func_00235DC8((BattleUnit *)actor, (BattleUnit *)target);
    } else {
        power = func_00235754((BattleUnit *)actor, (BattleUnit *)target);
    }
    return func_0023697C((BattleUnit *)actor, (BattleUnit *)target, power, c, d, e);
}
