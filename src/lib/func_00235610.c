typedef signed char s8;
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
s32 func_002347B8(BattleUnit *u);
typedef struct {
    u8 mode;
    u8 unk1[3];
    u8 flags;
} BattleMode;
extern BattleMode D_801976D9;
s32 func_002347B8(BattleUnit *u);
unsigned char D_8016DBD8(int, int);
extern s8 D_801F6910[7][27];
unsigned char D_8016DBD8(int, int);
extern s8 D_801F6910[7][27];
f32 func_00235610(BattleUnit *u) {
    u32 k = (unsigned char)D_8016DBD8((unsigned char)(u->primary_class_id.word),(unsigned char)(u->secondary_class_id.word));
    u32 m;
    f32 p;
    s32 b;
    k = (k - 1) % 7;
    m = 15;
    if (!(D_801976D9.mode & 0x80)) {
        m = D_801976D9.mode;
    }
    m %= 27;
    p = D_801F6910[k][m];
    p += func_002347B8(u);
    if (u == ((void *)0) || u->fatigue < 70) {
        b = 0;
    } else if (u->fatigue < 80) {
        b = 5;
    } else if (u->fatigue < 90) {
        b = 18;
    } else {
        b = 40;
    }
    return p - b;
}
f32 func_00235610(BattleUnit *u);
