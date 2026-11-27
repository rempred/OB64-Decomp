#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
extern u8 D_801CEAAB;
typedef struct {
    void *p0;
    void *p1;
    u8 (*mtx)[0x40];
    void *p3;
    u8 (*vtx)[0x10];
} FbSet241;
extern u16 gCardMatrixCount;
extern u16 D_800E79E0;
extern u8 (*D_801969B0)[0x40];
extern u8 (*D_80197178)[0x10];
extern u8 D_801F0440[];
void func_0023DAA4(void);
void D_801B55C4(void);
void D_801B0300(void);
void func_0023F778(void);
void func_00240EC8(void);
void func_00241610(u8 a);
void func_00242988(FbSet241 *fb) {
    D_801969B0 = &fb->mtx[gCardMatrixCount];
    D_80197178 = &fb->vtx[D_800E79E0];
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (20) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->second = (unsigned int)(0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xDC080008;
        _g->second = (u32)D_801F0440;
    }
    func_0023DAA4();
    D_801B55C4();
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (20) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->second = (unsigned int)(0); };
    { CombatDrawCommand *_g = D_800E9BA0++; _g->first = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->second = 0; };
    D_801B0300();
    func_0023F778();
    func_00240EC8();
    func_00241610(D_801CEAAB);
    gCardMatrixCount += D_801969B0 - &fb->mtx[gCardMatrixCount];
    D_800E79E0 += D_80197178 - &fb->vtx[D_800E79E0];
}
