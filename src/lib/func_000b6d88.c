typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000b6ba8(void);
u16 func_000bc464(u16 k);
void func_000b6ba8(void);
void func_000b6d88(void) {
    s32 i;
    D_80196AF8[0x9D] = 0;
    D_80196AF8[0x1DFF] = 0;
    for (i = 0; i < 8; i++) {
        (D_80196AF8 + i)[0x1E00] = 0;
        (D_80196AF8 + i)[0x1DF6] = 0;
        (D_80196AF8 + i)[0x1DEE] = 0;
        if (func_000bc464(i)) {
            u8 *st = D_80196AF8;
            u8 n = st[0x1DFF];
            st[0x1DFF] = n + 1;
            st[n + 0x1E00] = i + 1;
        }
    }
    D_80196AF8[0x1DFE] = 3;
    D_80196AF8[0x9B] = 0;
    D_80196AF8[0x9A] = 0;
    D_80196AF8[0x1DED] = func_000bc464((D_80196AF8 + D_80196AF8[0x9D])[0x1E00] - 1);
    (*(s16 *)((u8 *)(D_80196AF8) + (0x1BDA))) = 0;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x1BDC))) = 0;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x1BDE))) = 8;
    (*(s16 *)((u8 *)(D_80196AF8) + (0x1BE0))) = D_80196AF8[0x1DED] - 1;
    func_000b6ba8();
}
