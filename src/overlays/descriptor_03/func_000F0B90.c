typedef signed int s32;
void func_000F0B90(s32 *tab, s32 n, s32 delta) {
    s32 i;
    s32 j;
    for (i = 0; i < n; i++) {
        tab[i] += delta;
        for (j = 0; j < 10; j++) {
            if (((s32 *)tab[i])[j] != 0) {
                ((s32 *)tab[i])[j] += delta;
                *(s32 *)((s32 *)tab[i])[j] += delta;
            }
        }
    }
}
