typedef unsigned char u8;
typedef signed int s32;
u8 D_801793E4(u8 c, s32 b);
s32 func_000fbbe4(u8 *s) {
    s32 i;
    s32 w;
    u8 c;
    u8 v;
    w = 0;
    for (i = 0; s[i] != 0; i++) {
        c = s[i];
        v = D_801793E4(c, 0);
        if (v == 11) {
            i++;
            w += 11;
        } else {
            if (c == '@') {
                break;
            }
            w += v;
        }
    }
    return w;
}
