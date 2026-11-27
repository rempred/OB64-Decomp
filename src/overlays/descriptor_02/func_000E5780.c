#include "game/combat_draw_commands.h"
struct Phase8PackedFields;
struct ListMenu;
unsigned int func_000E5938(struct Phase8PackedFields *fields);
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void func_000E5780(u8 *p);
extern u8 D_8018F480;
void func_000ba790(struct ListMenu *);
void func_000E5780(u8 *img) {
    if (img[2] == 2) {
        if (D_8018F480 < 2) {
            D_8018F480 = 2;
            {
                CombatDrawCommand *_g = D_800E9BA0++;
                _g->first = 0xE3001001;
                _g->second = 0x8000;
            }
        }
        if (img[1] != 0) {
            CombatDrawCommand *g = D_800E9BA0++;
            g->first = 0xFD100000;
            g->second = (u32)(img + (func_000E5938((struct Phase8PackedFields *)img) + 8));
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
                _g->second = (img[1] << 14) | 0x7000000;
            }
            {
                CombatDrawCommand *_g = D_800E9BA0++;
                _g->first = 0xE7000000;
                _g->second = 0;
            }
        }
    } else if ((D_8018F480 == 2) | (D_8018F480 == 0)) {
        D_8018F480 = 1;
        {
            CombatDrawCommand *_g = D_800E9BA0++;
            _g->first = 0xE3001001;
            _g->second = 0;
        }
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE7000000;
        _g->second = 0;
    }
}
void func_000ba790(struct ListMenu *);
