#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x36];
    u16 items[4];
    u8 unk3E[2];
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    u8 unk50[4];
    s32 unk54;
    s32 unk58;
    u8 unk5C[0x14];
    s32 actsMax;
} BattleUnit;
extern struct { u8 b[12]; } D_801976DC[];
u8 func_0020BFA4(BattleUnit *u) {
    u8 *p;
    if (u == ((void *)0)) {
        return 0;
    }
    p = battle_actor_is_side_zero(u) ? D_801976DC[0].b : D_801976DC[1].b;
    return p[1] & 2;
}
extern inline int battle_actor_is_side_zero(void *record) {
    BattleUnit *u = record;

    if (u == ((void *)0)) {
        return 0;
    }
    return ((u->flags >> 8) ^ 1) & 1;
}
