typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
void *D_8017BFB0(s32 a, s32 b, void *c, s32 d, s32 e, s32 f, s32 g, s32 h, s32 i, s32 j, s32 k);
extern s16 D_8021B5EC;
extern u8 D_8021B5C8[];
extern void *D_8021B590;
extern void *D_8021B590;
extern u8 D_8021B5C8[];
extern s16 D_8021B5EA[];
void func_0018E61C();
void func_0018DB64(void) {
    s32 n = 0;
    while (D_8021B5C8[n] != 0xFF) {
        n++;
    }
    D_8021B5EC = n;
    if (D_8021B5EC >= 4) {
        D_8021B5EA[0] = 4;
    } else {
        D_8021B5EA[0] = n + 1;
    }
    D_8021B590 = D_8017BFB0(0x400, 0, func_0018E61C, 0x30, 0xE8, 0x9C, 0xF0, 0x30,
                                          (s16)((4 - D_8021B5EA[0]) * 15 / 2 + 99), 0x9C,
                                          (s16)((4 - D_8021B5EA[0]) * 15 / 2 + (s16)(D_8021B5EA[0] * 15 + 141)));
}
