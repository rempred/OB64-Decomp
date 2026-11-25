typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 *D_801CC410(s32 id);
s32 func_000b93d4(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
void D_801CC4A0(u8 *w);
void func_0009181c();
void func_000983ac();
void func_000d79a0(void) {
    s16 k;
    s32 o;
    func_000b93d4(0x800, 10, func_0009181c, 0x1A, 0x14, 0x8A, 0x1C, 0x1A, 0x14, 0x8A, 0x80);
    k = func_000b93d4(0x400, 10, func_000983ac, 0x94, 0x14, 0x12C, 0x1C, 0x94, 0x14, 0x12C, 0x80);
    D_801CC4A0(D_801CC410(0));
    o = k * 0x108 + 0x650;
    (D_80196AF8 + o)[0xE7] = 2;
}
