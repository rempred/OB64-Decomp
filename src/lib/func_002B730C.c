typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
extern inline s16 Nearest2B6(f32 x, f32 y, f32 *ax, f32 *ay, s16 n) {
    f32 dx = x - ax[0];
    f32 dy = y - ay[0];
    f32 best = dx * dx + dy * dy;
    s16 k = 0;
    s16 j;
    for (j = 1; j < n; j++) {
        f32 d;
        dx = x - ax[j];
        dy = y - ay[j];
        d = dx * dx + dy * dy;
        if (d < best) {
            best = d;
            k = j;
        }
    }
    return k;
}
typedef struct {
    u8 pad[0x10];
    s32 idx[1];
} Match2B6;
void func_002B730C(Match2B6 *o, f32 *ax, f32 *ay, s32 n, s32 m, f32 *bx, f32 *by) {
    s32 i;
    o->idx[0] = 0;
    o->idx[m - 1] = n - 1;
    for (i = 1; i < m - 1; i++) {
        o->idx[i] = Nearest2B6(bx[i], by[i], ax, ay, n);
    }
}
