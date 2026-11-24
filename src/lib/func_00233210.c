typedef signed char s8;
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
#include "game/battle_roster_types.h"
typedef BattleRosterRecord BattleUnit;
typedef struct {
    u8 unk000[0x1C4];
    BattleUnit units[20];
} BattleState;
extern u8 D_801976DC[];
s32 D_801C8B68(BattleUnit *u);
extern BattleState *D_801CE8BC;
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8C74(BattleUnit *u);
extern s8 D_801F69D0[11][2];
extern s8 D_801F69E8[11][2];
extern s8 D_801F6A00[];
s32 func_00233210(BattleUnit *a, BattleUnit *b) {
    s32 da;
    s32 dl;
    u32 i;
    u32 j;
    s32 v;
    if ((a == ((void *)0)) | (b == ((void *)0))) {
        return 0;
    }
    if (D_801C8AEC() != 0 || D_801C8AFC() != 0 || (u32)(a->primary_class_id.word - 0x51) < 3 || D_801C8B68(a) != 0 ||
        D_801C8C74(a) != 0 || D_801C8C74(b) != 0) {
        return 0;
    }
    if ((u8)*D_801976DC >= 30) {
        return 0;
    }
    da = a->alignment - b->alignment;
    for (i = 0; i < 11; i++) {
        if (da >= D_801F69D0[i][0]) {
            da = D_801F69D0[i][1];
            break;
        }
    }
    dl = a->level - b->level;
    for (j = 0; j < 11; j++) {
        if (dl <= D_801F69E8[j][0]) {
            dl = D_801F69E8[j][1];
            break;
        }
    }
    da += dl + D_801F6A00[(*(s32 *)((u8 *)(D_801CE8BC) + (0x1C0)))];
    if (da > 5) {
        da = 5;
    }
    if (da < -5) {
        da = -5;
    }
    v = a->alignment + da;
    if (v < 0) {
        v = 0;
    }
    if (v > 100) {
        v = 100;
    }
    return v - a->alignment;
}
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8C74(BattleUnit *u);
