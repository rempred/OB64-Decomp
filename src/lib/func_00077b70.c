#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_8019780C;
void D_8017C4B4(int);
void D_80179034(void *, int, int);
void func_0007819c(s32 x, s32 y, u8 cycle);
typedef struct {
    u8 pad[0x34];
    s32 w34;
} Win712;
void D_80181504(s32 x, s32 y, s32 w);
extern signed char D_801A2934[];
void func_00078038(u8 *s, s32 x, s32 y, s32 slot);
void func_00077b70(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        s32 slot;
        s32 t;
        D_8017C4B4(e[0xC]);
        D_80179034(D_801A2934, x + 8, y + 2);
        slot = 0;
        switch ((*(s32 *)((u8 *)(D_8019780C) + (0x3C)))) {
            case 0:
            case 1:
            case 100:
            case 102:
            case 104:
            case 106:
            case 107:
            case 108:
            case 115:
                break;
            case 2:
            case 9:
                if ((*(s32 *)((u8 *)(D_8019780C) + (0x48))) == 1) {
                    slot = 2;
                }
                break;
            default:
                if ((*(s32 *)((u8 *)(D_8019780C) + (0x48))) == 1) {
                    slot = 1;
                }
                break;
        }
        func_00078038(D_8019780C + 0x27E, x + 4, y + 0x13, slot);
        {
            CombatDrawCommand *_g = D_800E9BA0++;
            _g->first = 0xE7000000;
            _g->second = 0;
        }
        {
            CombatDrawCommand *_g = D_800E9BA0++;
            _g->first = 0xED000000;
            _g->second = 0x4FC3BC;
        }
        {
            CombatDrawCommand *_g = D_800E9BA0++;
            _g->first = 0xE7000000;
            _g->second = 0;
        }
        D_80181504(x - 3, y + 0xC, ((Win712 *)o)->w34 + 2);
        t = (*(s32 *)((u8 *)(D_8019780C) + (0x3C)));
        if (t == 2) {
            goto cursor;
        }
        if (t == 9) {
        cursor:
            if ((*(s32 *)((u8 *)(D_8019780C) + (0x48))) == 1) {
                func_0007819c(x - 12, y + 6, ((*(u32 *)((u8 *)(D_8019780C) + (0))) & 0xFFFF0001) == 0x20001);
            }
        }
    }
}
void func_0007819c(s32 x, s32 y, u8 cycle);
