#include "game/combat_draw_commands.h"
typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 pad[0x30];
    void *pal;
} Res836;
extern Res836 *D_80197AF8;
extern s8 D_801A7A60[][2];
void func_00085450(s32 x, s32 y, s32 c);
void func_00085684(s32 x, s32 y, u8 *s) {
    u8 c;
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xFD100000;
        _g->second = (u32)D_80197AF8->pal;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE8000000;
        _g->second = 0;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xF5000100;
        _g->second = 0x7000000;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE6000000;
        _g->second = 0;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xF0000000;
        _g->second = 0x703C000;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE7000000;
        _g->second = 0;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE200001C;
        _g->second = 0xF0A7008;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE3001001;
        _g->second = 0x8000;
    }
    while ((c = *s) != 0) {
        u32 k = c - 'A';
        s++;
        if (k >= 59) {
            x += 8;
            continue;
        }
        x -= D_801A7A60[k][0];
        func_00085450(x, y, c);
        x = x + (16 - D_801A7A60[k][1]);
    }
}
