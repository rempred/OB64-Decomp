typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_80196AF8;
u8 *D_801CC410(s32 id);
s32 func_000b93d4(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
s32 D_801CC3B8(s32 id);
void D_801C0798(s16 a, s32 b);
void D_801A43F4();
extern inline void func_000b4b08(s32 a) {
    u8 *w = D_801CC410(5);
    u8 *x = w;
    if (w == ((void *)0)) {
        (*(s32 *)((u8 *)(D_80196AF8) + (0x10D0))) = func_000b93d4(5, 10, D_801A43F4, 0x9C, 0xD6, 0xA4, 0xDE, 0x18, 0xB6, 0x128, 0xDE);
    } else {
        func_000016C4((*(void * *)((u8 *)(x) + (0xF4))));
    }
    D_801C0798(D_801CC3B8(5), a);
}
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockB48;
extern StockB48 D_80193AC0[];
void D_801A7940();
void D_801A87F8();
extern StockB48 D_80196B00[];
void func_000b6ba8(void) {
    u16 k = (*(u16 *)((u8 *)(D_80196AF8 + (*(s16 *)((u8 *)(D_80196AF8) + (0x1BDA))) * 2) + (0x1BEE)));
    s32 msg;
    u8 *w;
    D_80196AF8[0xA1] = 1;
    if ((D_80196AF8 + D_80196AF8[0x9D])[0x1E00] >= 7) {
        msg = D_80193AC0[k].id | 0x1B0000;
    } else {
        msg = D_80196B00[k].id | 0x130000;
    }
    w = D_80196AF8 + ((s16)func_000b93d4(0x400, 10, D_801A87F8, 0x18, 0x16, 0x20, 0x1E, 0x18, 0x16,
                                               0xB2, 0xB0) * 0x108 + 0x650);
    w[0xE6] |= 4;
    func_000b93d4(3, 10, D_801A7940, 0x120, 0x18, 0x128, 0x20, 0xBC, 0x18, 0x128, 0xAE);
    func_000b4b08(msg);
}
void func_000b6ba8(void);
