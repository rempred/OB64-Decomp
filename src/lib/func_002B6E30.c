typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_8022A974;
s16 D_80231BBC(s32 a, s32 b, s32 c, s32 d);
u8 D_8022EFB0(void *);
void *func_0002CD70(void *p, s32 c, s32 n);
void bzero(void *p, s32 n);
void func_002B6E30(u8 i, s32 a, s32 b, s32 c) {
    u8 *u = ((u8 **)(D_8022A974 + 0x1AC0))[i];
    (*(s32 *)((u8 *)(u) + (0x2C))) = i;
    if (a != -1) {
        (*(s32 *)((u8 *)(u) + (0x30))) = a;
    }
    if (b != -1) {
        (*(s16 *)((u8 *)(u) + (0x44))) = b;
    }
    (*(s16 *)((u8 *)(u) + (0x42))) = D_80231BBC((*(s32 *)((u8 *)(u) + (0x30))), (*(s16 *)((u8 *)(u) + (0x44))), 0, 0);
    u[0x4C] = c;
    (*(s32 *)((u8 *)(u) + (0x38))) = 0;
    (*(s32 *)((u8 *)(u) + (0x3C))) = 0;
    (*(s32 *)((u8 *)(u) + (0x34))) = -1;
    func_0002CD70(u, 0xFF, 0x10);
    bzero(u + 0x10, 0x10);
    D_8022EFB0(u);
}
