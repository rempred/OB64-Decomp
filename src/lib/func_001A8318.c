typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
void *D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
extern void *D_80219650;
void func_001A838C(void);
void func_001A8318(void) {
    void **p = &D_80219650;
    if (*p == ((void *)0)) {
        *p = D_8017BFB0(0, 0, func_001A838C, 0x18, 0x18, 0x20, 0x20, 0x18, 0x18, 0x128, 0x3C);
    }
}
