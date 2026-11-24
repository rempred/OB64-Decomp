typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern s16 *D_801D06A0;
s16 func_002019F4(s32 a, s32 b, s16 *out) {
    s16 *e = (s16 *)((u8 *)D_801D06A0 + D_801D06A0[a]);
    s16 kind;
    e += b * 13;
    kind = e[0];
    if (kind != -1) {
        if (out == ((void *)0)) {
            return kind;
        }
        if (kind == -2) {
            out[0] = e[1];
            out[1] = e[2];
            out[2] = e[3];
            out[9] = e[4];
            out[10] = e[5];
            out[11] = e[6];
            out[12] = e[7];
            out[13] = e[8];
            out[14] = e[9];
            out[15] = e[10];
            out[16] = e[11];
            out[17] = e[12];
        } else {
            out[0] = kind;
            out[1] = e[1];
            out[2] = e[2];
            out[4] = e[3];
            if ((u16)e[4] == 0x8000) {
                out[5] = 0;
            } else {
                out[5] = e[4];
            }
            out[6] = e[5];
            out[3] = e[6];
            out[7] = e[7];
            out[8] = e[8];
            out[11] = 1;
        }
    }
    return e[0];
}
