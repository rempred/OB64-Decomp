typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_8023DE30;
extern s32 D_8023DE40;
extern s32 D_8023DE44;
void func_0028DC98(s16 a, s16 b);
extern inline void func_0028FE78(u8 dir) {
    switch (dir) {
        case 4:
            if (D_8023DE40 >= 0x35) {
                D_8023DE30[0x244]--;
                D_8023DE40 -= 60;
            }
            break;
        case 5:
            if (D_8023DE40 < 0x35) {
                D_8023DE30[0x244]++;
                D_8023DE40 += 60;
            }
            break;
        case 6:
            if (D_8023DE44 >= 0x37) {
                D_8023DE30[0x245]--;
                D_8023DE44 -= 72;
            }
            break;
        case 7:
            if (D_8023DE44 < 0x37) {
                D_8023DE30[0x245]++;
                D_8023DE44 += 72;
            }
            break;
    }
}
void func_0028FFB8(void) {
    u8 f = D_8023DE30[0x23A];
    s32 sy = D_8023DE30[0x245];
    u32 sx = D_8023DE30[0x244];
    s16 y = (*(s32 *)((u8 *)(D_8023DE30) + (0x234))) - 0x36;
    s16 x = (*(s32 *)((u8 *)(D_8023DE30) + (0x230))) - 0x34;
    s16 top = (sy + 1) * 72;
    s16 right = (sx + 8) * 60;
    s16 bot = (sy + 4) * 72;
    s16 left = (sx + 1) * 60;
    if (x < (s16)left && !(f & 2)) {
        if (D_8023DE30[0x240] < sx) {
            f |= 1;
        }
    } else if ((s16)right < x && !(f & 1)) {
        if (D_8023DE30[0x244] <= D_8023DE30[0x242]) {
            f |= 2;
        }
    }
    if ((s16)top > y && !(f & 8)) {
        if (D_8023DE30[0x245] > D_8023DE30[0x241]) {
            f |= 4;
        }
    } else if ((s16)bot < y && !(f & 4)) {
        if (D_8023DE30[0x245] <= D_8023DE30[0x243]) {
            f |= 8;
        }
    }
    if (f & 1) {
        if (D_8023DE40 >= 0x71) {
            func_0028FE78(4);
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1BC))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1B8))) < 0) {
                f &= 0xE;
            }
        } else if (D_8023DE40 < 0x35) {
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1BC))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1B8))) < 0) {
                f &= 0xE;
            }
        }
        if (f & 1) {
            D_8023DE40 += (*(s32 *)((u8 *)(D_8023DE30) + (0x1BC))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1B8)));
        }
    }
    if (f & 2) {
        if (D_8023DE40 < -7) {
            func_0028FE78(5);
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1BC))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1B8))) > 0) {
                f &= 0xD;
            }
        } else if (D_8023DE40 >= 0x35) {
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1BC))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1B8))) > 0) {
                f &= 0xD;
            }
        }
        if (f & 2) {
            D_8023DE40 += (*(s32 *)((u8 *)(D_8023DE30) + (0x1BC))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1B8)));
        }
    }
    if (f & 4) {
        if (D_8023DE44 >= 0x7F) {
            func_0028FE78(6);
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1E4))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1E0))) < 0) {
                f &= 0xB;
            }
        } else if (D_8023DE44 < 0x37) {
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1E4))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1E0))) < 0) {
                f &= 0xB;
            }
        }
        if (f & 4) {
            D_8023DE44 += (*(s32 *)((u8 *)(D_8023DE30) + (0x1E4))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1E0)));
        }
    }
    if (f & 8) {
        if (D_8023DE44 < -0x11) {
            func_0028FE78(7);
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1E4))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1E0))) > 0) {
                f &= 7;
            }
        } else if (D_8023DE44 >= 0x37) {
            if ((*(s32 *)((u8 *)(D_8023DE30) + (0x1E4))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1E0))) > 0) {
                f &= 7;
            }
        }
        if (f & 8) {
            D_8023DE44 += (*(s32 *)((u8 *)(D_8023DE30) + (0x1E4))) - (*(s32 *)((u8 *)(D_8023DE30) + (0x1E0)));
        }
    }
    D_8023DE30[0x23A] = f;
    if (f) {
        func_0028DC98(D_8023DE30[0x244], D_8023DE30[0x245]);
    }
}
void func_0028FFB8(void);
