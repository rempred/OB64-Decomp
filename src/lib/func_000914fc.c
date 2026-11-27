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
void func_000881dc(s32 d);
void func_000885a8(s32 x, s32 y, s32 v, s32 w);
extern u8 D_801EE868[];
extern u8 D_060047A0[];
s32 func_000bbadc(u8 *a, u8 *b);
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
void func_000881dc(s32 k);
void func_000885a8(s32 x, s32 y, s32 v, s32 w);
void func_000914fc(s32 unused, WinG87 *w, u8 k) {
    s16 alpha = w->alpha[k];
    s32 x;
    s32 y;
    u8 c[2];
    if (alpha == 0) {
        return;
    }
    x = w->x;
    y = w->y;
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
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_801EE868); };
    func_000bbadc(&c[0], &c[1]);
    {
        s32 a = c[0];
        s32 b = c[1];
        func_000881dc(-a);
        func_000885a8(x + 0x24, y + 9, a, 1);
        func_000881dc(-b);
        func_000885a8(x + 0x48, y + 9, b, 1);
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0x8000); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x560, ((Res87 *)D_80196AF8)->img + 0x44F8, 0x30, 0x10, 2);
    func_00087200((void *)(x + 8), y + 4, 0x74);
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x580, ((Res87 *)D_80196AF8)->img + 0x4678, 0x20, 0x10, 2);
    func_00087200((void *)(x + 0x30), y + 4, 0x75);
}
