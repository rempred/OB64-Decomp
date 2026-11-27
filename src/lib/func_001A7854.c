#include "game/panel_rect_call.h"
struct Panel;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_8021966C;
extern s32 D_8021964C;
extern u8 D_8021965D;
extern u8 D_801969BA[];
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern u8 D_80219648;
extern u8 D_80219668;
extern s32 D_801F3618;
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
void func_001A5BCC(void);
void func_001A7854(void) {
    s32 cur;
    s32 old;
    if (D_8021966C == -100) {
        D_801F0FE1 = D_801DADF0(D_801F0CB0[(D_801F0DE0 = 4, D_801F3658)]);
        D_801F0FDF = 3;
        D_801F0FE0 = 1;
        return;
    }
    if ((*D_800C4BDC & D_801F0CA0[3]) && D_8017F36C(0x300) == ((void *)0) && D_80219648 == 0xFF) {
        D_8017EF24(0x31012, 0x200, 0x98, 0x70, 0xA8, 0x80, 0x18, 0x64, 0x128, 0x8C);
        D_8020CDA0(0x10);
        return;
    }
    if (D_8017F36C(0x300) != ((void *)0)) {
        return;
    }
    cur = D_8021965D;
    old = cur;
    if (D_80219648 == 0xFF) {
        if (D_80219668 == 0) {
            if (*D_800C4C4C & 0x800) {
                s32 t = cur - 2;
                cur = t & (~t >> 31);
            } else if (*D_800C4C4C & 0x400) {
                if (cur == 0) {
                    cur = 1;
                } else {
                    s32 t = cur;
                    if (cur + 2 < 5) {
                        t = cur + 2;
                    }
                    cur = t;
                }
            } else if (*D_800C4C4C & 0x200) {
                if (cur == 0) {
                    cur = 1;
                } else {
                    s32 odd = cur & 1;
                    cur -= odd == 0;
                }
            } else if (*D_800C4C4C & 0x100) {
                if (cur == 0) {
                    cur = 2;
                } else {
                    cur += cur & 1;
                }
            }
        }
        D_8021965D = cur;
        if (*D_800C4BDC & D_801F0CA0[0]) {
            D_8021966C = 1;
        } else if (*D_800C4BDC & D_801F0CA0[1]) {
            D_8021966C = -1;
        }
        if (cur != old) {
            D_8020CDA0(2);
        }
        {
            u8 *row = D_801969BA + D_8021964C * 11;
            D_801F3618 = row[cur];
        }
    }
    func_001A5BCC();
}
