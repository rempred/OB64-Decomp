typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_8019780C;
void D_8017C4B4(u32);
void D_80179034(signed char *s, s32 x, s32 y);
typedef struct {
    signed char *a;
    signed char *b;
} Help2_712;
extern Help2_712 D_801A1A3C[];
void func_00077d78(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        s32 m;
        D_8017C4B4(e[0xC]);
        switch ((*(s32 *)((u8 *)(D_8019780C) + (0x3C)))) {
            case 5:
                m = 9;
                break;
            case 6:
                m = 12;
                break;
            case 11:
                m = 10;
                break;
            case 12:
                m = 13;
                break;
            case 14:
                m = 11;
                break;
            case 15:
                m = 14;
                break;
            case 0x75:
                m = 16;
                break;
            case 0x76:
                m = 17;
                break;
            default:
                m = (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) - 100;
                break;
        }
        if (D_801A1A3C[m].b == ((void *)0)) {
            D_80179034(D_801A1A3C[m].a, x + 8, y + 8);
        } else {
            D_80179034(D_801A1A3C[m].a, x + 8, y + 1);
            D_80179034(D_801A1A3C[m].b, x + 8, y + 0x10);
        }
    }
}
