typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 g_func_001957D0_source_records[];
extern u8 D_80193BC0_copy[][0x38];
unsigned char D_8016DBD8(int, int);
int D_8016B088(unsigned char, unsigned char, unsigned char, unsigned char, unsigned char);
u8 func_002487E0(u16 k) {
    u8 *sq = g_func_001957D0_source_records + k * 25;
    u8 v[5];
    s32 i;
    u8 c;
    u8 *d;
    for (i = 4; i >= 0; i--) {
        v[i] = 0;
    }
    for (i = 0; i < 5; i++) {
        c = (sq + i)[2];
        if (c != 0) {
            if (c >= 100) {
                d = D_80193BC0_copy[0];
            } else {
                d = D_80193BC0_copy[c];
            }
            v[i] = D_8016DBD8(d[0x11], d[0x12]);
        }
    }
    return D_8016B088(v[0], v[1], v[2], v[3], v[4]);
}
