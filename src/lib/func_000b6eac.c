typedef unsigned char u8;
typedef signed int s32;
typedef unsigned short u16;
extern u8 *D_80196AF8;
u16 func_000bacec(void);
void func_000b6eac(u8 *sq) {
    u8 *m;
    u8 *p;
    s32 i;
    s32 j;
    s32 n;
    u8 c;
    n = 1;
    m = D_80196AF8 + ((sq[2] * 0x36) + 0x117C);
    for (i = 0; i < 9; i++) {
        c = (m + i)[4];
        n += (c != 0xFF) & (c >= 100);
        if (c != 0xFF) {
            p = D_80196AF8 + ((c * 2) + 0x1872);
            *p &= 0xDF;
        }
    }
    sq[9] = n;
    for (j = 4; n < sq[8] && j != 0; j--) {
        c = (sq + j)[2];
        if (c != 0xFF) {
            m = D_80196AF8 + ((c * 0x36) + 0x117C);
            if (m[1] & 8) {
                (*(s32 *)((u8 *)(D_80196AF8) + (0x2C0)))++;
            }
            m[1] = 0;
            m[2] = 0xFF;
            (sq + j)[2] = 0xFF;
            sq[8]--;
        }
    }
    func_000bacec();
}
