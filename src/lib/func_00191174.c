typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
extern s8 D_8021B188[];
extern u8 D_8021B299[];
extern s32 D_801F0B9C;
s32 func_00191174(s32 i, s32 lvl) {
    s8 *l = &D_8021B188[i * 9];
    s32 k;
    if (l[0] != -1) {
        k = 0;
        do {
            if (l[k] != D_801F0B9C && D_8021B299[l[k]] >= lvl) {
                return 1;
            }
            k++;
        } while (l[k] != -1);
    }
    return 0;
}
