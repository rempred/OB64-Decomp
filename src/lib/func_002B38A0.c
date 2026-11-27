typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A970;
s32 func_002B38A0(void) {
    s32 v = (*(s32 *)((u8 *)(D_8022A970) + (0x82C)));
    if (v == 0) {
        return 0;
    }
    return v == -1 ? -1 : 1;
}
