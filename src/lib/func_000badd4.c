typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 D_80193AB0[];
void func_000badd4(void) {
    s32 n = 0;
    s32 i;
    for (i = 0; i < 6; i++) {
        s32 sq = D_80193AB0[i];
        u8 *b;
        u8 *g;
        if (sq == 0xFF) {
            continue;
        }
        b = D_80196AF8;
        g = b + sq * 0xE;
        if (g[0x10DC] != 0) {
            (b + n)[0x1AB0] = sq;
            n++;
        }
    }
}
