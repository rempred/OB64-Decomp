typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0DE0;
extern s32 D_801F0CA4;
s32 func_0010D450(void) {
    s32 v;
    if (D_801F0DE0 != 2) {
        return 0;
    }
    v = D_801F0CA4;
    return v & -((u32)(v - 24) < 2);
}
