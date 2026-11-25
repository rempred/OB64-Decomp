typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801F1070;
extern u16 D_801951CC[][18];
s32 func_00139C88(void) {
    s32 i;
    for (i = 0; i < D_801F1070; i++) {
        u16 f = D_801951CC[i][0];
        if (f & 0x10) {
            if (!(f & 2)) {
                break;
            }
            return 1;
        }
    }
    return 0;
}
