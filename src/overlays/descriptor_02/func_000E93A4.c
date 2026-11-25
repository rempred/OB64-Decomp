typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_8019E194;
void func_000E93A4(s32 k) {
    if ((u16)k != 1) {
        if ((*(u16 *)((u8 *)(D_8019E194) + (0x1A))) < ++(*(u16 *)((u8 *)(D_8019E194) + (0x18)))) {
            u8 *s = D_8019E194;
            s[0x178 + (*(u16 *)((u8 *)(s) + (0x34)))++] = 10;
            s = D_8019E194;
            s[0x55]++;
            (*(u16 *)((u8 *)(s) + (0xB8 + s[0x55] * 2))) = (*(u16 *)((u8 *)(D_8019E194) + (0x34)));
            (*(u16 *)((u8 *)(D_8019E194) + (0x18))) = k;
            (*(u16 *)((u8 *)(D_8019E194) + (0x1C)))++;
        }
    }
}
