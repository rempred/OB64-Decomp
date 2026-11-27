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
void D_80179034(void *, int, int);
extern signed char D_80196A58[];
extern u8 D_06005B78[];
s32 D_8017B58C(signed char *s);
void func_00087200(void *a, s32 y, s32 k);
void func_000873a0(s32 x, s32 y, s32 x1, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0009e35c(s32 unused, u8 *w, u8 k) {
    s16 alpha = (*(s16 *)((u8 *)(w + k * 2) + (0xE0)));
    s32 x = (*(s32 *)((u8 *)(w) + (0x14)));
    s32 y = (*(s32 *)((u8 *)(w) + (0x10)));
    s32 n;
    if (alpha == 0) {
        return;
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFA000000); _g->second = (alpha | 0xFFFFFF00); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3000C00); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0); };
    if (alpha == 0xFF) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0xF0A7008); };
    } else {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0x504240); };
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFC119623); _g->second = (0xFF2FFFFF); };
    n = D_8017B58C(D_80196A58);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xED000000); _g->second = (0x4FC3BC); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_06005B78); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x520, ((Res87 *)D_80196AF8)->img + 0x3E28, 0x20, 0x2D,
                             10);
    {
        s32 w = n + 0x20;
        func_00087200((void *)(x - w), y, 0x66);
    }
    {
        s32 w = n + 0x10;
        func_000873a0(x - w, y + 3, x - 0x10, 0x68);
        func_00087200((void *)(x - 0x10), y, 0x67);
        D_80179034(D_80196A58, x - w, y + 6);
    }
}
