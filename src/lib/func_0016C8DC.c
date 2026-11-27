typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
void func_0016C8DC(void);
extern u8 *D_8021EEF4;
extern s32 D_80214F4C;
void func_0016C8DC(void) {
    D_80214F4C++;
    D_80214F4C %= 8;
    if ((s8)(D_8021EEF4[0x78] & 0x7F) >= 0x1F) {
        D_8021EEF4[0x78] &= 0x80;
        D_8021EEF4[0x78] ^= 0x80;
    }
    D_8021EEF4[0x78]++;
    if (D_8021EEF4[0x78] & 0x80) {
        D_8021EEF4[0x79]++;
    } else {
        D_8021EEF4[0x79]--;
    }
}
