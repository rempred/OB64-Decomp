typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
extern void *D_8021B448[];
extern void *D_8021B44C;
void *D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
void func_0019D64C(void);
void func_001A26AC(void) {
    D_8021B448[0] = D_8017BFB0(0, 0, func_0019D64C, 0x120, 0x16, 0x128, 0x1E, 0x74, 0x16, 0x128, 0x52);
    D_8021B44C = D_8017BFB0(0, 0, func_0019D64C, 0x18, 0xD6, 0x20, 0xDE, 0x18, 0xA2, 0xCC, 0xDE);
}
