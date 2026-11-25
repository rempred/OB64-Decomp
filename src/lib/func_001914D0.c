typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801F3658;
s32 func_001914D0(void);
extern u8 *D_8021B1E0;
extern s32 D_8021B2C0;
extern s32 D_8021B2C4;
extern u8 D_80197207[][25];
extern u16 *D_800C4BDC;
extern u16 *D_800C4C4C;
extern u16 *D_801F0CA0;
s32 D_8017BFB0(u16, u8, void *func, s16, s16, s16, s16, s16, s16, s16, s16);
void *D_8017F36C(u16 id);
void D_8017EF24(s32 a, u16 kind, s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
void D_8017C384(void *w);
void D_8020CDA0(s32 se);
void func_0019173C(void);
s32 func_001914D0(void) {
    s32 ret = 1;
    if (D_8021B1E0 == ((void *)0)) {
        D_8021B2C0 = D_8021B2C4 = D_80197207[D_801F3658][0];
        D_8021B1E0 = (u8 *)D_8017BFB0(0x400, 0, func_0019173C, 0x9C, 0x58, 0xA4, 0x5C, 0x71, 0x58, 0xD7, 0x9E);
    } else if ((*(u16 *)((u8 *)(D_8021B1E0) + (0x26))) == 0) {
        if ((*D_800C4BDC & D_801F0CA0[3]) && D_8017F36C(0x300) == ((void *)0)) {
            D_8017EF24((D_8021B2C4 + 0xF) | 0x32000, 0x200, 0x98, 0x20, 0xA8, 0x30, 0x18, 0x14, 0x128, 0x3C);
            D_8020CDA0(0x10);
            return 1;
        }
        if (D_8017F36C(0x300) == ((void *)0)) {
            if (*D_800C4C4C & 0x800) {
                if (D_8021B2C4 != 0) {
                    D_8021B2C4--;
                    D_8020CDA0(2);
                }
            } else if (*D_800C4C4C & 0x400) {
                if (D_8021B2C4 < 3) {
                    D_8021B2C4++;
                    D_8020CDA0(2);
                }
            } else if (*D_800C4BDC & D_801F0CA0[0]) {
                D_8021B2C0 = D_8021B2C4;
                D_80197207[D_801F3658][0] = D_8021B2C4;
                D_8020CDA0(0);
            } else if (*D_800C4BDC & D_801F0CA0[1]) {
                D_8017C384(D_8021B1E0);
                ret = 0;
                D_8021B1E0 = ((void *)0);
                D_8020CDA0(1);
            }
        }
    }
    return ret;
}
