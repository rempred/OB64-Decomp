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
void *battle_roster_lookup_actor(unsigned int index);
extern inline int battle_actor_is_side_zero(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }

    return ((((BattleUnit *)record)->flags >> 8) ^ 1) & 1;
}
s32 func_0020C050(u8 a, u8 b) {
    return battle_actor_is_side_zero(battle_roster_lookup_actor(a)) ^ battle_actor_is_side_zero(battle_roster_lookup_actor(b));
}
void *battle_roster_lookup_actor(unsigned int index);
