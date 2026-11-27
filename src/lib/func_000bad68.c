typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u8 g_func_001957D0_active_source_ids[];
u16 func_000bad68(void) {
    s32 n = 0;
    s32 i;
    for (i = 0; i < 0x1E; i++) {
        s32 l = g_func_001957D0_active_source_ids[i];
        u8 *b;
        u8 *g;
        if (l == 0xFF) {
            continue;
        }
        b = D_80196AF8;
        g = b + l * 0x36;
        if (g[0x117F] != 0xFF) {
            (b + n)[0x1A92] = l;
            n++;
        }
    }
    return n;
}
