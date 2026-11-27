typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A974;
s32 func_002B5D58(void) {
    s32 *p = (*(s32 * *)((u8 *)(D_8022A974) + (0x1A44)));
    if (p != ((void *)0)) {
        return p[0] <= p[1];
    }
    return 0;
}
