typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 D_80197710[];
extern u8 D_80193BD1[][0x38];
u16 func_000bab6c(void) {
    s32 n;
    s32 i;
    D_80196AF8[0x1A2E] = 0;
    n = 1;
    for (i = 1; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x5D8))); i++) {
        s32 id = D_80197710[i];
        if (id != 0 && D_80193BD1[id][0] != 0) {
            (D_80196AF8 + n)[0x1A2E] = id;
            n++;
        }
    }
    return n;
}
