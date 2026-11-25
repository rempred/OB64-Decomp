typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8019780C;
s32 func_00074634(s32 i) {
    u8 *b = D_8019780C;
    u8 *g = b + i * 26;
    return g[0x264] != 0xFF;
}
