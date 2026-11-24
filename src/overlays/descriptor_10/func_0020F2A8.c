void bzero(void *p, int n);
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801CE8BC;
u8 func_001FFBFC(void);
u8 func_001FFCC8(void);
u8 func_001FFDA4(void);
u8 *func_0020F2A8(s32 a, s32 x, s32 y, s32 z);
inline u8 *func_0020F2A8(s32 a, s32 x, s32 y, s32 z) {
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
