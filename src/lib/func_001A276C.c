typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
extern void *D_8021B448[];
extern void *D_8021B44C;
void *D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
void func_0019E2E0(void);
void func_001A276C(u8 k) {
    if (k == 0) {
        D_8021B448[0] = D_8017BFB0(0, 0, func_0019E2E0, 0x18, 0x14, 0x20, 0x1C, 0x18, 0x14, 0x9A, 0x40);
    } else {
        D_8021B44C = D_8017BFB0(0, 0, func_0019E2E0, 0x120, 0x14, 0x128, 0x1C, 0xA6, 0x14, 0x128, 0x40);
    }
}
