typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
u8 *D_801CC410(s32 id);
s32 func_000b93d4(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
void D_801B1FE0();
void func_000b8d70(void) {
    if (D_801CC410(0x11) == ((void *)0)) {
        func_000b93d4(0x11, 8, D_801B1FE0, 0x144, 0xC8, 0x148, 0xE0, 0xD0, 0xC8, 0x128, 0xE0);
    }
}
