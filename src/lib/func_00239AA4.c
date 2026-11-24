#include "game/class_comparison.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
typedef struct BattleUnit {
    struct BattleObj *obj;
    u8 unk04[0x1C];
    u16 hp;
    u16 maxHp;
    u16 str;
    u16 vit;
    u8 unk28[6];
    u16 dex;
    u8 unk30;
    u8 unk31[2];
    u8 unk33;
    u8 unk34[2];
    u16 items[4];
    u8 unk3E;
    u8 unk3F;
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    s32 unk50;
    s32 lane;
    s32 unk58;
    u8 unk5C[0xC];
    s32 target;
    s32 actsUsed;
    s32 actsMax;
    u8 unk74[4];
    u8 actionKind;
    u8 unk79[3];
    s32 attack;
    s32 unk80;
    u8 unk84[0x10];
    s32 unk94;
    u8 unk98[0x60];
} BattleUnit;
int battle_actor_is_side_zero(void *record);
s32 battle_actor_has_flag_9(void *actor);
int battle_actor_is_side_one(void *record);
s32 D_801C8B08(BattleUnit *actor);
s32 func_00239AA4(BattleUnit *actor, u32 flags) {
    s32 r = 0;
    s32 k = D_801C8B08(actor);
    if (flags & 0x8000) {
        return 0;
    }
    if (battle_actor_is_side_zero(actor) && (flags & 0x400)) {
        r = 1;
    }
    if (battle_actor_is_side_one(actor) && !(flags & 0x400)) {
        r = 1;
    }
    if (k == 0) {
        r = 0;
    }
    if (r) {
        if (k == 0xFF) {
            if (!battle_actor_has_flag_9(actor)) {
                r = 0;
            }
        } else if (!D_8016FF5C(actor->unk48, k)) {
            r = 0;
        }
    }
    return r;
}
