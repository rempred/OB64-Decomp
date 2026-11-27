#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern u8 *D_80196AF8;
void func_00087dec(void *pal, void *img, u16 w, u16 h);
unsigned char D_8016DE1C(int, int);
int D_8016DF18(int, int);
extern u8 D_8018ECE4[][6];
extern Gfx D_06002470[];
extern Gfx D_060025E8[];
extern Gfx D_06002610[];
typedef struct {
    u8 pad0[0x14];
    u8 *icons;
    u8 pad18[0x20 - 0x18];
    u8 *big;
    u8 *small;
    u8 *smallAlt;
} ResBA9;
void func_00087dec(void *pal, void *img, u16 w, u16 h);
void func_000a7360(u8 c) {
    u8 pic = D_8016DF18(c, c);
    s32 mode;
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0); };
    mode = (D_8016DE1C(c, c) == 2) ? 3 : 1;
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFD100000); _g->second = ((u32)(((ResBA9 *)D_80196AF8)->icons + (mode << 12))); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5100000); _g->second = (0x7014060); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF3000000); _g->second = (0x77FF080); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5102000); _g->second = (0x14060); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF2000000); _g->second = (0xFC07C); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_06002470); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0x8000); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001201); _g->second = (0); };
    if (mode == 3) {
        func_00087dec(((ResBA9 *)D_80196AF8)->big + 0x200, ((ResBA9 *)D_80196AF8)->big + 0x400 + pic * 0x380, 0x20, 0x1C);
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_060025E8); };
    } else {
        u8 *t;
        if (D_8018ECE4[c][0] & 0x80) {
            t = ((ResBA9 *)D_80196AF8)->smallAlt;
        } else {
            t = ((ResBA9 *)D_80196AF8)->small;
        }
        func_00087dec(t + 0x200, t + 0x400 + pic * 0x180, 0x10, 0x18);
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xDE000000); _g->second = ((u32)D_06002610); };
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); };
}
