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
extern u8 D_060047A0[];
extern s32 D_80196A6C[];
void func_00088b10(s32 x, s32 y, s32 v, s32 digits);
typedef struct {
    u8 pad0[0xC];
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    u8 pad1C[0xE0 - 0x1C];
    s16 alpha[1];
} WinG87;
void func_00087200(void *a, s32 y, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0009e084(s32 unused, WinG87 *w, u8 k) {
    s16 alpha = w->alpha[k];
    s32 x = w->x;
    s32 y = w->y;
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
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_060047A0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD500000); _g->second = ((u32)(((Res87 *)D_80196AF8)->img + 0x948)); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5500000); _g->second = (0x7000000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF3000000); _g->second = (0x73FF200); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5400800); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF2000000); _g->second = (0xFC0FC); };
    func_00088b10(x + 8, y + 8, D_80196A6C[0], 7);
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x320, ((Res87 *)D_80196AF8)->img + 0x2828, 0x30, 0x10, 2);
    func_00087200((void *)(x + 0x3C), y + 0xA, 0x1A);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xED000000); _g->second = (0x4FC3BC); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    func_00087200((void *)(x + 8), y - 6, 0x1E);
    func_00087200((void *)(x + 0x20), y - 6, 0x1F);
}
