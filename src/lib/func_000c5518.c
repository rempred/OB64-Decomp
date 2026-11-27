typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u16 D_800E8100;
s32 func_000c5518(u8 *w) {
    s32 r = 0;
    if (w != ((void *)0) && (*(u16 *)((u8 *)(w) + (0xEA))) == 0) {
        r = D_800E8100 >> 15;
    }
    return r;
}
