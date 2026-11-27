typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void D_801B2B78(void *unit);
void func_00121C68(u8 *u, f32 v) {
    D_801B2B78(u);
    (*(u32 *)((u8 *)(u) + (0))) &= ~2;
    u[0x91] = 0;
    (*(s32 *)((u8 *)(u) + (0x88))) = 0;
    u[0x92] = 0;
    (*(f32 *)((u8 *)(u) + (0x1C))) = v;
    (*(s32 *)((u8 *)(u) + (0x84))) = -1;
    (*(u32 *)((u8 *)(u) + (0))) |= 2;
}
