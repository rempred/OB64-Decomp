typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000b3210(s32 sq);
void func_000b851c(u8 sq) {
    u8 *q = D_80196AF8 + (sq * 0x36 + 0x117C);
    s32 k;
    q[1] = 0;
    q[2] = 0xFF;
    q[3] = 0xFF;
    q[0xD] = 0xFF;
    q[0x20] = 0;
    q[0x1E] = 0;
    q[0x1D] = 0;
    for (k = 0; k < 9; k++) {
        (q + k)[4] = 0xFF;
    }
    for (k = 0; k < 10; k++) {
        (*(s16 *)((u8 *)(q) + (0x22 + k * 2))) = 0;
    }
    func_000b3210(sq);
}
