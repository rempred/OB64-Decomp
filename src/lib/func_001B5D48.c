typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_8021C990;
extern s32 D_8021C994;
extern s32 D_8021C998;
extern s32 D_8021C99C;
extern s32 D_8021C9A0;
extern void *D_8021C9A4;
extern void *D_8021C9A8;
extern s32 D_8021C9AC;
void *func_000016C4(void *p);
extern u16 D_8021C740;
void bcopy(const void *src, void *dst, s32 n);
void *func_00001330(s32 size);
void func_001B5D48(void) {
    s32 *p = &D_8021C990;
    if (*p != 0) {
        return;
    }
    *p = (s32)func_0000978C(0x218E9B4, 0x18, -3, 0);
    D_8021C994 = (s32)func_0000978C(0x218E9B4, 0x18, -3, 1);
    D_8021C998 = (s32)func_0000978C(0x218E9B4, 0x18, -3, 2);
    D_8021C99C = (s32)func_0000978C(0x218E9B4, 0x18, -3, 3);
    D_8021C9A0 = (s32)func_0000978C(0x218E9B4, 0x18, -3, 4);
    D_8021C9A4 = D_8009DD38(0x1DC2EE8);
    {
        u16 *sel = &D_8021C740;
        if (*sel & 0x8000) {
            u8 *pal = D_8009DD38(0x1DEE82C);
            u8 *b = func_00001330(0x300);
            bcopy(pal, b, 0x200);
            bcopy(pal + ((*sel & 0x7FFF) * 256 + 0x100), b + 0x200, 0x100);
            func_000016C4(pal);
            D_8021C9A8 = b;
        }
    }
    D_8021C9AC = (s32)func_0000978C(0x218E9B4, 0x18, -3, 5);
}
