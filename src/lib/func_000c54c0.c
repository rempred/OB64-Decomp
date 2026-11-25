typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u16 D_801EF7B0[];
extern u8 g_func_0015DF10_default[];
extern u8 g_func_0015DF10_match[];
void D_800EA604(void *p, s32 k);
void func_000c54c0(s32 k) {
    u32 i;
    void *p;
    for (i = 0; i < 4; i++) {
        if (k == D_801EF7B0[i]) {
            p = g_func_0015DF10_default;
            goto play;
        }
    }
    p = g_func_0015DF10_match;
play:
    D_800EA604(p, k);
}
