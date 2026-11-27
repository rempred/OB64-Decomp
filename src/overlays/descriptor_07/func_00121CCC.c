typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void D_801B2B78(void *unit);
void func_00121CCC(u8 *u) {
    D_801B2B78(u);
    (*(u32 *)((u8 *)(u) + (0))) &= ~2;
    u[0x91] = 0;
    (*(s32 *)((u8 *)(u) + (0x88))) = 0;
    (*(s32 *)((u8 *)(u) + (0x84))) = -1;
    u[0x92] = 1;
    (*(f32 *)((u8 *)(u) + (0x9C))) = -1.0f;
    (*(u32 *)((u8 *)(u) + (0))) &= ~0x800000;
}
