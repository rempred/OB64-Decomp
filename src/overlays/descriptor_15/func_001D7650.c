#include "game/descriptor_15_image.h"
#include "game/combat_draw_commands.h"
extern u8 D_801B8388[];
u32 func_001CE114(s32, u32, s32);
typedef struct {
    u8 *img;
    s16 vis;
    u8 pad6[4];
    s16 x;
    s16 y;
} Spr1D47;
void func_001D7650(Spr1D47 *s) {
    if (s->vis == 0) {
        return;
    }
    {
        CombatDrawCommand *g = D_800E9BA0;
        g->first = 0xDE000000;
        g->second = (u32)D_801B8388;
        D_800E9BA0 = g + 1;
    }
    if (s->img[3] == 0) {
        { CombatDrawCommand *_p = D_800E9BA0++; _p->first = 0xFD100000; _p->second = (u32)((s)->img + (func_001CE114(0, ((SizeCE *)(s)->img)->w, ((SizeCE *)(s)->img)->h) + 8)); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE8000000; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xF5000100; _g->second = 0x7000000; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE6000000; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xF0000000; _g->second = 0x703C000; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE7000000; _g->second = 0; } };
    } else {
        { CombatDrawCommand *_p = D_800E9BA0++; _p->first = 0xFD100000; _p->second = (u32)((s)->img + (func_001CE114(1, ((SizeCE *)(s)->img)->w, ((SizeCE *)(s)->img)->h) + 8)); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE8000000; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xF5000100; _g->second = 0x7000000; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE6000000; _g->second = 0; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xF0000000; _g->second = 0x73FC000; } { CombatDrawCommand *_g = D_800E9BA0++; _g->first = 0xE7000000; _g->second = 0; } };
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xFA000000;
        _g->second = ((u8 *)&s->vis)[1] | ~0xFF;
    }
    {
        CombatDrawCommand *g = D_800E9BA0;
        g->first = 0xFB000000;
        g->second = 1;
        D_800E9BA0 = g + 1;
    }
    func_001CF3AC((SizeCE *)s->img, s->x, s->y);
}
