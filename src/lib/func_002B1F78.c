typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
typedef double f64;
extern u8 *D_8022A974;
f32 func_002B1F78(f32 x, f32 z) {
    f32 r = 0.0f;
    u8 *m = (*(u8 * *)((u8 *)(D_8022A974) + (0x10)));
    if (m != ((void *)0)) {
        s32 k = func_002B1C64((s16)x, (s16)z);
        if (k != (*(u16 *)((u8 *)(m) + (0)))) {
            f32 *p = (f32 *)((*(u8 * *)((u8 *)(m) + (0xC))) + k * 16);
            f64 nn = p[0] * p[0] + p[1] * p[1] + p[2] * p[2];
            f64 d = p[0] * x + p[2] * z + p[3];
            if (d != 0.0) {
                f32 px = -d * p[0] / nn;
                f32 py = -d * p[1] / nn;
                f32 pz = -d * p[2] / nn;
                if (py != 0.0f) {
                    r = (px * px + pz * pz) / py + py;
                }
            }
        }
    }
    return r;
}
