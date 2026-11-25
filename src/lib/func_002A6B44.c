typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u16 D_800C4B28;
extern u8 D_800EB1F0[];
void D_800EA604(void *p, s32 k);
void D_8017C384(u8 *o);
s32 func_002A6B44(u8 *o) {
    u8 *w = (*(u8 * *)((u8 *)(o) + (0xD0)));
    s32 r = -1;
    switch (w[0x5F0]) {
        case 0:
            if ((*(s16 *)((u8 *)(o) + (0x18))) == 0xFF && (D_800C4B28 & 0xFF3F)) {
                D_800EA604(D_800EB1F0, 3);
                r = 0;
                w[0x5F0] = 3;
            }
            break;
        case 3:
            D_8017C384(o);
            w[0x5F0]++;
            break;
    }
    return r;
}
