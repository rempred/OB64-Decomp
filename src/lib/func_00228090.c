#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u16 link;
    u16 next;
    u16 prev;
    u16 unk06;
    s32 kind;
    s32 group;
    s32 unk10;
    s32 y;
    s32 floor;
    s32 speed;
    s16 state;
    u8 unk22[0x62];
} Fx224;
extern u16 D_801D0724;
extern Fx224 *D_801D081C;
extern s32 D_801D06F8;
extern s32 *D_801D0708;
extern s16 D_801D07F4[4];
extern Gfx D_801E65A0[];
extern void (*D_801E6550[])(u8 *o, s32 x, s32 y);
u8 *D_801C8FE8(u32);
s32 D_801CA29C(s32 group);
void func_00228090(void) {
    s32 i;
    Fx224 *o;
    D_801D06F8 = 0;
    {
        CombatDrawCommand *_g = D_800E9BA0++;
        _g->first = 0xDE000000;
        _g->second = (u32)D_801E65A0;
    }
    for (i = 0; i < 20; i++) {
        u8 *u = D_801C8FE8(i);
        s32 *p;
        if (u == ((void *)0)) {
            continue;
        }
        p = (s32 *)(i * 8 + (s32)D_801D0708);
        p[0] = (*(s32 *)((u8 *)(u) + (0x98))) + D_801D07F4[0] / 4;
        p[1] = (*(s32 *)((u8 *)(u) + (0x9C))) + D_801D07F4[1] / 4 - 30;
        p[0] += (160 - (*(s32 *)((u8 *)(u) + (0x98)))) * -D_801D07F4[2] / 1280;
        p[1] += (120 - (*(s32 *)((u8 *)(u) + (0x9C)))) * -D_801D07F4[3] / 960;
        if (p[1] < 20) {
            p[1] = 20;
        }
    }
    for (o = (Fx224 *)(u32)D_801D0724; (u32)o != 0xFFFF; o = (Fx224 *)(u32)o->next) {
        s32 s;
        o = &D_801D081C[(u32)o];
        s = D_801CA29C(o->group);
        if (s == -1) {
            continue;
        }
        if ((*(s32 *)((u8 *)(o->group) + (0x48))) == 0) {
            continue;
        }
        D_801E6550[o->kind]((u8 *)o, D_801D0708[s * 2], D_801D0708[s * 2 + 1] + o->y);
    }
}
