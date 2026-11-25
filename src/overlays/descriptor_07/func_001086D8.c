typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern u32 *D_801F0CB0[];
extern u8 *D_8018F58C;
extern f32 D_801F0DC8;
extern f32 D_801F0DD0;
extern struct {
    u8 pad[0x29];
    u8 b29;
    u8 pad2A[6];
    u8 b30;
    u8 b31;
    u8 b32;
    u8 b33;
    u8 b34;
    u8 b35;
} D_800E7A90;
f32 func_0002CB80(f32 x, f32 y);
void D_801A9DB0(s32 cam, s32, f32 *sx, f32 *sy);
s32 func_001086D8(f32 *px, f32 *py, s32 k, s32 near) {
    u32 *u = D_801F0CB0[k];
    f32 sx;
    f32 sy;
    f32 d;
    s32 r = -1;
    func_0002CB80(*(f32 *)(D_8018F58C + 0x14) - D_801F0DC8, *(f32 *)(D_8018F58C + 0x1C) - D_801F0DD0);
    func_0002CB80(*(f32 *)(D_8018F58C + 0x14) - *(f32 *)((u8 *)u + 8), *(f32 *)(D_8018F58C + 0x1C) - *(f32 *)((u8 *)u + 0x10));
    D_801A9DB0(((s32 *)&D_800E7A90)[D_800E7A90.b30 - 10], (u8 *)u + 8, &sx, &sy);
    d = func_0002CB80(sx - *px, sy - *py);
    if (d <= 25.0f) {
        if (near != 0) {
            r = k;
        } else if (d <= 12.0f) {
            r = k;
        }
    }
    return r;
}
