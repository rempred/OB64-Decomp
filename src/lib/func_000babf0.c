typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 D_80197710[];
u8 func_000babf0(u8 id) {
    s32 i;
    for (i = 0; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x5D8))); i++) {
        if (D_80197710[i] == id) {
            return i;
        }
    }
    return 0xFF;
}
