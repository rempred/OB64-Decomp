typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern s16 D_801EE38C[][2];
void func_000aa2ec(u8 k, s32 x, s32 y);
void func_000aaf74(s32 k, s32 x, s32 y) {
    s16 *p;
    s32 j = 0;
    s32 i = 0;
    s32 o = k * 54;
    s32 none = 0xFF;
    for (p = D_801EE38C[0]; i < 9; i++, p += 2) {
        if ((D_80196AF8 + o + i)[0x1180] != none) {
            func_000aa2ec(j, x + p[0] + 12, y + p[1] - 32);
            j += 2;
        }
    }
}
