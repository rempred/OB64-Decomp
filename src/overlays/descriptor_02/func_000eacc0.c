typedef unsigned char u8;
typedef unsigned short u16;
extern u16 D_800E7A30;
extern struct { u8 pad[0x31]; volatile u8 f31; } D_800E7A90;
extern u8 *D_8019E194;
void func_000eacc0(void) {
    u16 *p = &D_800E7A30;
    *p |= 0x1000;
    D_8019E194[0x3C] = 99;
    D_800E7A90.f31 |= 2;
}
