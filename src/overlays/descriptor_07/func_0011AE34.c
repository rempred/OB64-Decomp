typedef signed int s32;
typedef float f32;
typedef struct {
    f32 *x;
    f32 *z;
    s32 w8;
    s32 wC;
    s32 w10;
    s32 w14;
} Seg11A;
void func_0011A9B8(f32 step, f32 *x, f32 *z, s32 w8, f32 *px, f32 *pz, s32 wC, s32 w10, s32 w14);
f32 func_0002CB80(f32 x, f32 z);
void func_0011A9B8(f32 step, f32 *x, f32 *z, s32 w8, f32 *px, f32 *pz, s32 wC, s32 w10, s32 w14);
f32 func_0011AE34(Seg11A *s) {
    f32 k = 0.01f;
    f32 x;
    f32 z;
    func_0011A9B8(k, &x, &z, s->w8, s->x, s->z, s->wC, s->w10, s->w14);
    return k / func_0002CB80(x - *s->x, z - *s->z);
}
