#include "game/panel_rect_call.h"
struct Panel;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern s32 D_80219658;
extern u8 D_80219649;
extern s32 D_801ED5B0;
extern u8 D_80219590;
extern s32 D_801F0DE0;
extern u8 D_801F0FDF;
extern u8 D_801F0FE0;
extern u8 D_801F0FE1;
extern u16 *D_800C4BDC;
extern u16 *D_800C4C4C;
extern u16 *D_801F0CA0;
s32 D_801DADF0(u32 *u);
struct Panel *D_8017F36C(unsigned short id);
void D_8020CDA0(s32 se);
void func_001A7D74(void);
void func_001A7C2C(void);
void func_001A8CCC(void) {
    s32 cur;
    s32 old;
    if (D_80219658 == -100) {
        if (++D_80219590 >= 11) {
            func_001A7C2C();
            D_801F0FE1 = D_801DADF0(D_801F0CB0[(D_801F0DE0 = 4, D_801F3658)]);
            D_801F0FDF = 2;
            D_801F0FE0 = 3;
        }
        return;
    }
    if ((*D_800C4BDC & D_801F0CA0[3]) && D_8017F36C(0x300) == ((void *)0)) {
        D_8017EF24(0x31051, 0x200, 0x98, 0x70, 0xA8, 0x80, 0x18, 0x64, 0x128, 0x8C);
        D_8020CDA0(0x10);
        return;
    }
    if (D_8017F36C(0x300) != ((void *)0)) {
        return;
    }
    cur = D_801ED5B0;
    old = cur;
    if (D_80219649 == 0) {
        if (*D_800C4C4C & 0x800) {
            if (cur >= 3) {
                cur -= 3;
            }
        } else if (*D_800C4C4C & 0x400) {
            if (cur < 6) {
                cur += 3;
            }
        }
        if (*D_800C4C4C & 0x200) {
            if (cur < 3) {
                cur += cur < 2;
            } else if (cur < 6) {
                cur += cur < 5;
            } else {
                cur += cur < 8;
            }
        } else if (*D_800C4C4C & 0x100) {
            if (cur < 3) {
                cur -= cur > 0;
            } else if (cur < 6) {
                cur -= cur >= 4;
            } else {
                cur -= cur >= 7;
            }
        }
        if (cur != old) {
            D_8020CDA0(2);
        }
    }
    D_801ED5B0 = cur;
    if (*D_800C4BDC & D_801F0CA0[0]) {
        D_80219658 = 1;
    } else if (*D_800C4BDC & D_801F0CA0[1]) {
        D_80219658 = -1;
    }
    func_001A7D74();
}
