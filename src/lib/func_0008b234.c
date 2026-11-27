#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_80196AF8;
typedef struct {
    u8 pad0[4];
    u8 *img;
    u8 *pal;
} Res87;
extern u8 D_801EE868[];
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0008b234(s32 x, s32 y, s32 a) {
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_801EE868); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0x2000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFA000000); _g->second = ((a <= 0x50) ? (a | 0xFFFFFF00) : 0xFFFFFF50); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0x504240); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFC119623); _g->second = (0xFF2FFFFF); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x280, ((Res87 *)D_80196AF8)->img + 0x1AE8, 0x60, 0x20, 9);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 0x60) << 2)) > (0) ? ((s16)((x + 0x60) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 0x20) << 2)) > (0) ? ((s16)((y + 0x20) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->second = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xD7000000); _g->second = (0x80008000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFA000000); _g->second = (a | 0xFFFFFF00); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3000C00); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0); };
    if (a == 0xFF) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0xF0A7008); };
    } else {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0x504240); };
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFC119623); _g->second = (0xFF2FFFFF); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
}
