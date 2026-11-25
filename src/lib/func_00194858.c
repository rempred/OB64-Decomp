typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
typedef struct {
    u8 b[33];
} Curve191;
extern Curve191 D_8021B244;
extern f32 D_8021B2F0;
extern f32 D_8021B2F8;
s32 func_00194858(s32 i, u8 rev) {
    Curve191 c = D_8021B244;
    u8 p = c.b[i];
    f32 lo = D_8021B2F0;
    f32 hi = D_8021B2F8;
    f32 v;
    if (rev == 0) {
        v = lo + (hi - lo) * p / 100.0f;
    } else {
        v = hi - (hi - lo) * p / 100.0f;
    }
    return v;
}
