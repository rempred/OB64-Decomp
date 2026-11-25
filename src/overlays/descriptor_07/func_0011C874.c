typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_801969BA[];
s32 func_0012E968(void *);
s32 func_0011C874(u32 *u) {
    u8 v;
    if (!(*u & 0x40)) {
        v = ((u8 *)u)[4];
    } else {
        v = D_801969BA[func_0012E968(u) * 11];
    }
    return v == 0;
}
