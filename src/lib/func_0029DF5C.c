typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void D_801C9028(s32 x, s32 y, s32 z, s32 *sx, s32 *sy);
void D_801C5938(s32 a, s32 b);
unsigned char D_8016DE70(int, int);
s32 D_801C8B84(void *u);
extern u8 g_func_0015DF10_default[];
extern u8 g_func_0015DF10_match[];
extern u16 D_801CEF10[];
extern u16 D_801CEF12[];
extern u16 D_801CF3F0[];
extern u16 D_801CF3F2[];
extern u16 D_801CF3F4[];
extern u8 D_801976DC;
extern u8 D_801976E8;
extern u8 D_80193BD4[];
extern u8 D_80195574[];
void func_0029DF5C(u8 *a, s32 cls, s32 kind, u8 hi, u8 lo, u8 bank) {
    s32 sx;
    s32 id;
    u8 *b;
    s32 g;
    if ((*(u8 * *)((u8 *)(a) + (0x4C))) != ((void *)0)) {
        D_801C9028((*(s16 *)((u8 *)((*(u8 * *)((u8 *)(a) + (0x4C)))) + (0x1C))), (*(s16 *)((u8 *)((*(u8 * *)((u8 *)(a) + (0x4C)))) + (0x1E))),
                      (*(s16 *)((u8 *)((*(u8 * *)((u8 *)(a) + (0x4C)))) + (0x20))), &sx, ((void *)0));
        if ((u32)((*(u16 *)((u8 *)(a) + (4))) - 0x1D) < 2) {
            hi = 0;
            if (kind == 0x33) {
                lo = 6;
            } else if (kind == 0x2F) {
                lo = 0xB;
            } else if ((u32)(kind - 0x4E) < 3) {
                lo = 0xA;
            } else if ((u32)(kind - 0x38) < 13) {
                lo = 8;
            } else {
                switch ((unsigned char)D_8016DE70((unsigned char)(cls),(unsigned char)(kind))) {
                    case 0:
                    case 1:
                    case 4:
                        if (D_801C8B84((*(u8 * *)((u8 *)((*(u8 * *)((u8 *)(a) + (0x4C)))) + (0x40))))) {
                            g = (u32)D_801976DC < 30;
                        } else {
                            g = (u32)D_801976E8 < 30;
                        }
                        if (g) {
                            g = D_80193BD4[(*(u8 * *)((u8 *)((*(u8 * *)((u8 *)(a) + (0x4C)))) + (0x40)))[0xF6] * 0x38] != 0;
                        } else {
                            g = D_80195574[(*(u8 * *)((u8 *)((*(u8 * *)((u8 *)(a) + (0x4C)))) + (0x40)))[0xF6] * 0x34] != 0;
                        }
                        lo = g ? 5 : 4;
                        break;
                    case 2:
                        lo = 9;
                        break;
                    default:
                        lo = 7;
                        break;
                }
            }
        }
        id = (hi << 8) + lo;
        if ((u32)(id - 0x24E) < 0xAB) {
            b = g_func_0015DF10_default;
            if (bank == 0x12) {
                b = g_func_0015DF10_match;
            }
            if (sx >= 0xD5) {
                D_801C5938((s32)b, D_801CF3F0[id]);
            } else if (sx < 0x6A) {
                D_801C5938((s32)b, D_801CF3F4[id]);
            } else {
                D_801C5938((s32)b, D_801CF3F2[id]);
            }
        } else {
            b = g_func_0015DF10_default;
            if (bank == 0x12) {
                b = g_func_0015DF10_match;
            }
            if (sx >= 0xA0) {
                D_801C5938((s32)b, D_801CEF12[id * 2]);
            } else {
                D_801C5938((s32)b, D_801CEF10[id * 2]);
            }
        }
    } else {
        id = (hi << 8) + lo;
        b = g_func_0015DF10_default;
        if (bank == 0x12) {
            b = g_func_0015DF10_match;
        }
        D_801C5938((s32)b, D_801CEF10[id * 2]);
    }
}
