typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_801951CC[];
extern u8 D_801969BA[];
extern u8 *D_801F0CB0[];
s32 func_0012E968(void *u);
s32 func_00132F40(u8 *u) {
    s32 r = 0;
    u8 *l;
    if (!((*(u32 *)((u8 *)(u) + (0))) & 0x40)) {
        if (!((*(u32 *)((u8 *)(u) + (0))) & 0x40000)) {
            if ((*(s32 *)((u8 *)(u) + (0x74))) != -1) {
                if ((*(u16 *)((u8 *)(D_801951CC + (*(s32 *)((u8 *)(u) + (0x74))) * 0x24) + (0))) & 2) {
                    r = 1;
                }
            }
        }
    } else {
        l = D_801F0CB0[D_801969BA[func_0012E968(u) * 11]];
        if (!((*(u32 *)((u8 *)(l) + (0))) & 0x40000)) {
            if ((*(s32 *)((u8 *)(l) + (0x74))) != -1 && ((*(u16 *)((u8 *)(D_801951CC + (*(s32 *)((u8 *)(l) + (0x74))) * 0x24) + (0))) & 2)) {
                r = 1;
            }
        }
    }
    return r;
}
