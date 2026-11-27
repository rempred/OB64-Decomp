#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_80196AF8;
void D_80179034(void *, int, int);
extern u8 D_801EE868[];
void func_00087dec(void *pal, void *img, u16 w, u16 h);
void func_0008db5c(s32 x0, s32 y0, s32 x1, s32 y1);
void func_00087200(void *a, s32 y, s32 k);
void func_00087dec(void *pal, void *img, u16 w, u16 h);
typedef struct {
    u8 pad0[0x68];
    void *mdl[2];
    void *pal[2];
    u8 pad78[0x24EC - 0x78];
    u16 cur;
} Port87;
void func_000912f4(s32 unused, u8 *w, u8 k) {
    s16 alpha = (*(s16 *)((u8 *)(w + k * 2) + (0xE0)));
    s32 x;
    s32 y;
    u8 *t;
    s32 i;
    if (alpha == 0) {
        return;
    }
    x = (*(s32 *)((u8 *)(w) + (0xC)));
    y = (*(s32 *)((u8 *)(w) + (0x10)));
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFA000000); _g->second = (alpha | 0xFFFFFF00); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3000C00); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0); };
    if (alpha == 0xFF) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0xF0A7008); };
    } else {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE200001C); _g->second = (0x504240); };
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFC119623); _g->second = (0xFF2FFFFF); };
    {
        Port87 *pt = (Port87 *)(((Port87 *)D_80196AF8)->cur * 4 + (s32)D_80196AF8);
        if (pt->mdl[0] != ((void *)0)) {
            { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_801EE868); };
            func_00087dec(pt->pal[0], pt->mdl[0], 0x28, 0x30);
            func_00087200((void *)(x + 4), y + 4, 0x1C);
            func_0008db5c(x + 4, y + 4, x + 0x2C, y + 0x34);
        }
    }
    t = (*(u8 * *)((u8 *)(w) + (0xF4)));
    for (i = 0; i < t[0x5C3]; i++) {
        if (t[0x5C1] + i < t[0x5C4]) {
            D_80179034((*(signed char * *)((u8 *)((*(u8 * *)((u8 *)(w) + (0xF4))) + (t[0x5C1] + i) * 4) + (0x500))), x + 0x34,
                          y + 6 + i * t[0x5C5]);
        }
    }
}
