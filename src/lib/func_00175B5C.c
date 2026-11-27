typedef signed int s32;
extern s32 D_8021AFC4;
extern s32 D_8021AFC0;
s32 func_00175B5C(void) {
    if (++D_8021AFC4 >= 30) {
        D_8021AFC0++;
    }
    return D_8021AFC0;
}
