typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801D06D8;
s32 func_0021079C(u8 *e, s32 n, u8 *out) {
    u8 *node = D_801D06D8;
    u8 r;
    u8 r2 = 0;
    u32 i = 0;
    u8 k = node[0];
    r = 0xFF;
    if (k != 0xFF) {
        do {
            if (k == e[i]) {
                if (node[1] != 0xFF) {
                    r = node[1];
                }
                if (node[2] != 0xFF) {
                    r2 = node[2];
                }
                i++;
                node = D_801D06D8 + *(u16 *)(node + 4);
                if (i >= n) {
                    break;
                }
            } else {
                node += 6;
            }
            k = node[0];
        } while (k != 0xFF);
    }
    if (out != ((void *)0)) {
        *out = r2;
    }
    return r;
}
