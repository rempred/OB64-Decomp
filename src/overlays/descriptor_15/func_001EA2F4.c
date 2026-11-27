typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
extern u8 *D_801BA6BC;
extern u8 D_801BA70D;
void func_001EA2F4(u8 *o, f32 *r, f32 *g, f32 *b) {
    s32 y = (*(s16 *)((u8 *)(o) + (0x16)));
    s32 h = (*(s16 *)((u8 *)(o) + (0x1A)));
    f32 t = h + y + 190;
    u8 *c = D_801BA6BC + D_801BA70D * 6;
    f32 k;
    if (t < 0.0f) {
        t = 0.0f;
    } else if (380.0f < t) {
        t = 380.0f;
    }
    k = 380.0f - t;
    *r = k * ((f32)c[3] - (f32)c[0]) / 380.0f + (f32)c[0];
    *g = k * ((f32)c[4] - (f32)c[1]) / 380.0f + (f32)c[1];
    *b = k * ((f32)c[5] - (f32)c[2]) / 380.0f + (f32)c[2];
}
