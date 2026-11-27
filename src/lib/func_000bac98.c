typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 D_80193AB0[];
u8 func_000bac98(u8 id) {
    s32 i;
    for (i = 0; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x5DC))); i++) {
        if (D_80193AB0[i] == id) {
            return i;
        }
    }
    return 0xFF;
}
