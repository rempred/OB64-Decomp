typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801D06D4;
s32 func_00210730(u8 *e, s32 n) {
    u8 *node = D_801D06D4;
    u8 *base;
    s32 r;
    u32 i = 0;
    u8 k = node[0];
    r = 0;
    if (k != 0xFF) {
        base = node;
        do {
            if (k == e[i]) {
                if (node[1] != 0) {
                    r = node[1];
                }
                i++;
                node = base + *(u16 *)(node + 2);
                if (i >= n) {
                    break;
                }
            } else {
                node += 4;
            }
            k = node[0];
        } while (k != 0xFF);
    }
    return r;
}
