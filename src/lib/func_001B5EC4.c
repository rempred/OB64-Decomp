typedef signed int s32;
extern s32 D_8021C990;
extern s32 D_8021C994;
extern s32 D_8021C998;
extern s32 D_8021C99C;
extern s32 D_8021C9A0;
extern void *D_8021C9A4;
extern void *D_8021C9A8;
extern s32 D_8021C9AC;
void D_80079618(unsigned int, ...);
void *func_000016C4(void *p);
void func_001B5EC4(void) {
    s32 *on = &D_8021C990;
    if (*on != 0) {
        D_80079618(0x218E9B4, 0x18, -0x14, 0);
        D_80079618(0x218E9B4, 0x18, -0x14, 1);
        D_80079618(0x218E9B4, 0x18, -0x14, 2);
        D_80079618(0x218E9B4, 0x18, -0x14, 3);
        D_80079618(0x218E9B4, 0x18, -0x14, 4);
        D_80079618(0x218E9B4, 0x18, -0x14, 5);
        func_000016C4(D_8021C9A4);
        *on = 0;
        D_8021C994 = 0;
        D_8021C998 = 0;
        D_8021C99C = 0;
        D_8021C9A0 = 0;
        D_8021C9A4 = ((void *)0);
        D_8021C9AC = 0;
    }
    if (D_8021C9A8 != ((void *)0)) {
        func_000016C4(D_8021C9A8);
        D_8021C9A8 = ((void *)0);
    }
}
