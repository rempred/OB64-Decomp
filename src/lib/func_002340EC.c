#include "game/battle_predicates.h"
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
s32 rand(void);
s32 D_801C8BC0(u8 a, u8 b);
s32 D_801C8C3C(BattleUnit *candidate);
s32 D_801C8D24(BattleUnit *candidate);
s32 D_801C8E30(BattleUnit *candidate);
void *D_801C8FE8(unsigned int index);
s32 D_801CA038(BattleUnit *candidate, s32 amount);
s32 D_801CA29C(void *candidate);
s32 func_002340EC(void *record) {
    BattleUnit *actor = record;
    s32 actor_index = D_801CA29C(actor);
    s32 best_score = -1;
    s32 best_index = -1;
    s32 candidate_index;
    BattleUnit *candidate;
    s32 score;
    for (candidate_index = 0; candidate_index < 20; candidate_index++) {
        candidate = D_801C8FE8(candidate_index);
        if (candidate == ((void *)0)) {
            continue;
        }
        if (D_801C8E30(candidate)) {
            continue;
        }
        if (D_801C8C3C(candidate)) {
            continue;
        }
        if (D_801C8BC0(actor_index, candidate_index)) {
            continue;
        }
        if (D_801C8D24(candidate)) {
            continue;
        }
        score = D_801CA038(candidate, 999);
        score = score * 100 / (candidate->hp + score);
        if (best_score == score) {
            best_score -= rand() & 1;
        }
        if (best_score < score) {
            best_score = score;
            best_index = candidate_index;
        }
    }
    return best_index;
}
