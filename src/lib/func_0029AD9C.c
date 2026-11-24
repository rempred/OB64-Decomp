typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
s32 D_801BEA0C(s32 fmt, s32 w);
u16 D_801BEB28(u16 c);
u32 func_801BEA70(u32 c);
extern inline void SepiaImg29(void *pix, s32 fmt, s32 h, s32 w) {
    s32 n;
    s32 i;
    n = D_801BEA0C(fmt, w);
    n *= h;
    if (fmt == 2) {
        u16 *p = pix;
        for (i = 0; i < n; i++, p++) {
            *p = D_801BEB28(*p);
        }
    } else if (fmt == 3) {
        u32 *p = pix;
        for (i = 0; i < n; i++, p++) {
            *p = func_801BEA70(*p);
        }
    }
}
void func_0029AD9C(u8 *bank) {
    u8 *e = bank + 8;
    s32 k;
    for (k = 0; k < bank[3]; k++) {
        u8 *hdr = e;
        SepiaImg29(hdr + 0x10, 2, (*(u16 *)((u8 *)(hdr) + (6))), (*(u16 *)((u8 *)(hdr) + (4))));
        e = (*(u8 * *)((u8 *)(hdr) + (0xC)));
    }
}
