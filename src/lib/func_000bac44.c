typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 g_func_001957D0_active_source_ids[];
u8 func_000bac44(u8 id) {
    s32 i;
    for (i = 0; i < (*(s32 *)((u8 *)(D_80196AF8) + (0x2C4))); i++) {
        if (g_func_001957D0_active_source_ids[i] == id) {
            return i;
        }
    }
    return 0xFF;
}
