typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000da730(void) {
    u8 *s = D_80196AF8;
    s32 none;
    s32 i;
    s[0x1169] = 0;
    s[0x1168] = 0;
    s[0x1167] = 0;
    none = 0xFF;
    s[0x116D] = 0xFF;
    s[0x116B] = 0;
    s[0x116C] = 0;
    s[0x1160] = 0;
    {
        u8 *p = s + 0x1164;
        for (i = 4; i >= 0; i--) {
            p[2] = none;
            p--;
        }
    }
}
