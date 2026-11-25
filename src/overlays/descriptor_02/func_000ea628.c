typedef signed char s8;
typedef unsigned char u8;
extern u8 *D_8019E194;
extern u8 D_8019E1A4[];
void func_000ea628(void) {
    u8 *s = D_8019E194;
    if (s[0x41] != 0) {
        s[0x40] = D_8019E1A4[s[0x3F]++];
        s = D_8019E194;
        if ((*(s8 *)((u8 *)(s) + (0x40))) == -0x80) {
            s[0x41] = 0;
            s[0x40] = 0;
        }
    }
}
