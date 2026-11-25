typedef unsigned char u8;
typedef signed short s16;
typedef unsigned int u32;
void D_801AD974(u8 *p, s16);
void func_0021EAA0(u8 **o) {
    u32 i;
    for (i = 0; i < 3; i++) {
        D_801AD974(o[i] + 0x44, 0);
    }
}
