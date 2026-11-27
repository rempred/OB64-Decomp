#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned int u32;
extern u8 D_801CEAAC;
extern u8 D_801CEAAD;
extern u8 D_801CEAAE;
void func_00241610(u8 a) {
    if (a == 0) {
        return;
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (20) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->second = (unsigned int)(0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->second = (((unsigned int)(((unsigned int)(D_801CEAAC) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(D_801CEAAD) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(D_801CEAAE) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(a) & ((0x01 << (8)) - 1)) << (0)))); };
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xFCFFFFFF;
        _g->second = 0xFFFDF6FB;
    }
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xE200001C;
        _g->second = 0x005041C8;
    }
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(319 << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(239 << 2) & ((0x01 << (12)) - 1)) << (0)))); _g->second = (((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (0))))); }; { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->second = (unsigned int)((((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
}
