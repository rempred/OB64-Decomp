typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_80196AF8;
s32 func_000a71c8(f32 x) {
    f32 d = (*(f32 *)((u8 *)(D_80196AF8) + (0x5F8))) - x - 10.0f;
    return ((180.0f < d) | (d < -160.0f)) ^ 1;
}
