typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void D_801B2B78(u8 *u);
void func_00121D38(u8 *u) {
    D_801B2B78(u);
    (*(u32 *)((u8 *)(u) + (0))) &= ~2;
    u[0x91] = 0;
    (*(s32 *)((u8 *)(u) + (0x88))) = 0;
    (*(f32 *)((u8 *)(u) + (0x88))) = 0.0f;
    (*(s32 *)((u8 *)(u) + (0x84))) = -1;
    u[0x92] = 2;
    (*(f32 *)((u8 *)(u) + (0x9C))) = -1.0f;
    (*(u32 *)((u8 *)(u) + (0))) &= ~0x800000;
}
