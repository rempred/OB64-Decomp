typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern void *D_80219678[2];
typedef struct {
    u8 unk00[0x18];
    s16 fade[2];
    u8 unk1C[0x10];
    s32 x;
    s32 y;
    u8 unk34[0x48];
    s32 rect[4];
} Win18C;
void func_001A62F4(Win18C *w, s32 page);
void *D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
void func_001A61FC(void) {
    void **p = &D_80219678[0];
    if (*p == ((void *)0)) {
        *p = D_8017BFB0(0, 0, func_001A62F4, 0x18, 0x18, 0x1C, 0x1C, 0x18, 0x18, 0x91, 0x4A);
    }
}
