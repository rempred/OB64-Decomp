typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 D_80197710[];
extern u8 D_80193BD1[][0x38];
u16 func_000baad4(void) {
    s32 n;
    s32 i;
    D_80196AF8[0x1A2E] = 0;
    n = 1;
    for (i = 1; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x5D8))); i++) {
        s32 id = D_80197710[i];
        u8 *b;
        u8 *g;
        if (id == 0 || D_80193BD1[id][0] == 0) {
            continue;
        }
        b = D_80196AF8;
        g = b + id * 2;
        if (!(g[0x1872] & 8)) {
            (b + n)[0x1A2E] = id;
            n++;
        }
    }
    return n;
}
