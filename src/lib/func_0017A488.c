typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
s32 D_8016FEF4(s16 k);
s32 func_0017A488(u8 m) {
    u8 n = 0;
    s32 i;
    for (i = 0; i < 6; i++) {
        if (D_8016FEF4(i + 5) != 0) {
            if (n == m) {
                break;
            }
            n++;
        }
    }
    return i;
}
