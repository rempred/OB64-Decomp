#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
s32 D_801BE978(s32, s32, s32);
void func_00246270(u8 *img, s32 a, s32 b, s32 w, s32 h, f32 x, f32 y);
void func_00246E34(u8 *img, f32 x, f32 y) {
    if (img[2] == 2) {
        { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE3001001); _g->second = (0x8000); };
        if (img[3] == 0) {
            { CombatDrawCommand *_p = D_800E9BA0++; _p->first = 0xFD100000; _p->second = (u32)((img) + (D_801BE978((img)[3], (*(u16 *)((u8 *)(img) + (4))), (*(u16 *)((u8 *)(img) + (6)))) + 8)); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE8000000); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5000100); _g->second = (0x7000000); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF0000000); _g->second = (0x703C000); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); }; };
        } else if (img[3] == 1) {
            { CombatDrawCommand *_p = D_800E9BA0++; _p->first = 0xFD100000; _p->second = (u32)((img) + (D_801BE978((img)[3], (*(u16 *)((u8 *)(img) + (4))), (*(u16 *)((u8 *)(img) + (6)))) + 8)); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE8000000); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF5000100); _g->second = (0x7000000); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE6000000); _g->second = (0); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xF0000000); _g->second = (0x73FC000); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xE7000000); _g->second = (0); }; };
        }
    }
    func_00246270(img, 0, 0, (*(u16 *)((u8 *)(img) + (4))), (*(u16 *)((u8 *)(img) + (6))), x, y);
}
