typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801CE8BC;
u8 D_8016DE1C(u8 a, u8 b);
u8 func_001FFBFC(void);
u8 func_001FFCC8(void);
u8 func_001FFDA4(void);
u8 *func_0020F2A8(s32 a, s32 x, s32 y, s32 z);
extern inline u8 *func_0020F2A8(s32 a, s32 x, s32 y, s32 z) {
    u32 i;
    u8 *p;
    for (i = 0; i < 80; i++) {
        if ((*(s32 *)((u8 *)(D_801CE8BC + i * 0xC0) + (0x153C))) == 0) {
            break;
        }
    }
    while (i >= 80) {
    }
    p = D_801CE8BC + ((i * 0xC0) + 0x1524);
    bzero(p, 0xC0);
    (*(s32 *)((u8 *)(p) + (0x18))) = a;
    (*(s16 *)((u8 *)(p) + (0x1C))) = (*(s16 *)((u8 *)(p) + (0x28))) = x;
    (*(s16 *)((u8 *)(p) + (0x20))) = (*(s16 *)((u8 *)(p) + (0x2C))) = z;
    (*(s16 *)((u8 *)(p) + (0x1E))) = (*(s16 *)((u8 *)(p) + (0x2A))) = y;
    (*(s32 *)((u8 *)(p) + (4))) = x * 0x1E;
    (*(s32 *)((u8 *)(p) + (0xC))) = z * 0x1E;
    (*(s32 *)((u8 *)(p) + (8))) = y * 0x1E;
    (*(u8 *)((u8 *)(p) + (0x38))) = func_001FFBFC();
    (*(u8 *)((u8 *)(p) + (0x39))) = func_001FFCC8();
    (*(u8 *)((u8 *)(p) + (0x3A))) = func_001FFDA4();
    (*(u8 *)((u8 *)(p) + (0x3D))) = 0xFF;
    (*(u8 *)((u8 *)(p) + (0x3C))) = 0xFF;
    (*(u8 *)((u8 *)(p) + (0x3B))) = 0xFF;
    (*(u8 *)((u8 *)(p) + (0x37))) = 0;
    return p;
}
void func_001F0E64(void *p, u32 selector);
typedef struct {
    s16 b[4];
} Tint20B;
void func_0020FA04(void *unit, s32 kind) {
    u8 *u = unit;
    u8 *p;
    if ((*(u8 * *)((u8 *)(u) + (0x18))) != ((void *)0)) {
        (*(s32 *)((u8 *)((*(u8 * *)((u8 *)(u) + (0x18)))) + (0x18))) = 0;
    }
    if ((*(u8 * *)((u8 *)(u) + (0x1C))) != ((void *)0)) {
        (*(s32 *)((u8 *)((*(u8 * *)((u8 *)(u) + (0x1C)))) + (0x18))) = 0;
    }
    if (D_8016DE1C(u[0x4B], u[0x4F]) == 2) {
        kind += 12;
    }
    p = func_0020F2A8(5, 0, 0, 0);
    p[0x14] = 0;
    (*(s16 *)((u8 *)(p) + (0x34))) = 0xFF;
    (*(u8 * *)((u8 *)(p) + (0x40))) = u;
    p[0x8C] = 0;
    (*(u8 * *)((u8 *)(p) + (0x90))) = p;
    (*(s32 *)((u8 *)(p) + (0x44))) = (*(s32 *)((u8 *)(p) + (0x18)));
    *(Tint20B *)(p + 0x36) = *(Tint20B *)((*(u8 * *)((u8 *)(u) + (0))) + 0x36);
    (*(u8 * *)((u8 *)(u) + (0x18))) = p;
    func_001F0E64(p + 0x44, kind);
    p = func_0020F2A8(5, 0, 0, 0);
    p[0x14] = 0;
    (*(s16 *)((u8 *)(p) + (0x34))) = 0xFF;
    (*(u8 * *)((u8 *)(p) + (0x40))) = u;
    p[0x8C] = 0;
    (*(u8 * *)((u8 *)(p) + (0x90))) = p;
    (*(s32 *)((u8 *)(p) + (0x44))) = (*(s32 *)((u8 *)(p) + (0x18)));
    *(Tint20B *)(p + 0x36) = *(Tint20B *)((*(u8 * *)((u8 *)(u) + (0))) + 0x36);
    (*(u8 * *)((u8 *)(u) + (0x1C))) = p;
    func_001F0E64(p + 0x44, kind + 1);
}
