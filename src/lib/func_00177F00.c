#include "game/combat_draw_commands.h"
#include "game/cutscene_panels.h"
extern void *D_80218D84;
extern u16 *D_8021CA70;
extern u8 D_80193BC0_copy[][0x38];
extern char D_8021C9B0[];
extern signed char *D_801ED410;
void D_8017C4B4(int);
void D_80200DD0(s32 x, s32 y, s32 k);
void D_80203558(s32 x0, s32 y0, s32 x1, s32 y1);
void D_80179034(void *, int, int);
int func_000238B0(char *, const char *, ...);
void bzero(void *p, s32 n);
void func_00177F00(Panel *w, s32 k) {
    s32 x;
    s32 y;
    char buf[0x80];
    if (((s16 *)((u8 *)w + 0x18))[k] == 0) {
        return;
    }
    x = w->field2C;
    y = w->field30;
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    D_8017C4B4(((s16 *)((u8 *)w + 0x18))[k]);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0x8000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD100000); _g->second = ((u32)D_8021CA70); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE8000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5000100); _g->second = (0x7000000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF0000000); _g->second = (0x73FC000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xD7000002); _g->second = (0x80008000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD500000); _g->second = ((u32)D_80218D84); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5500000); _g->second = (0x7000000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF3000000); _g->second = (0x73BF19A); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5480A00); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF2000000); _g->second = (0x9C0BC); };
    D_80200DD0(x + 6, y + 6, 0x1C);
    D_80203558(x + 6, y + 6, x + 0x2E, y + 0x36);
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    bzero(buf, 0x15);
    func_000238B0(buf, D_8021C9B0, D_80193BC0_copy[(s8)w->field22]);
    D_80179034(buf, x + 0x34, y + 0xE);
    D_80179034(D_801ED410, x + 0x3E, y + 0x20);
}
