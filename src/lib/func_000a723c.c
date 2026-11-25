typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_80196AF8;
void guMtxL2F(f32 mf[4][4], void *m);
void func_000a723c(void *m, s32 *x, s32 *y) {
    f32 mf[4][4];
    f32 dx;
    f32 dy;
    f32 rx;
    guMtxL2F(mf, m);
    dx = (*(f32 *)((u8 *)(D_80196AF8) + (0x5F8))) - mf[3][0];
    if (dx < 0.0f) {
        rx = dx - 0.5f;
    } else {
        rx = dx + 0.5f;
    }
    dy = (*(f32 *)((u8 *)(D_80196AF8) + (0x5FC))) - mf[3][1];
    if (dy < 0.0f) {
        dy -= 0.5f;
    } else {
        dy += 0.5f;
    }
    *x = rx + 160.0f - 36.0f;
    *y = dy + 120.0f + 8.0f;
}
