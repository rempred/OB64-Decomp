typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
typedef struct {
    u8 t;
    u8 pad[3];
    f32 x;
    f32 y;
} Key145;
s32 func_00146F08(u8 *o, Key145 *k, u8 n, u8 end) {
    u8 t = ++o[6];
    s32 lo = 0;
    s32 hi = n - 1;
    s32 done = t >= end;
    while (lo < hi) {
        s32 mid = (lo + hi) / 2;
        s32 m1 = mid + 1;
        if (t < k[m1].t) {
            hi = mid;
        } else {
            lo = m1;
        }
    }
    hi = lo + 1;
    if (lo == n - 1) {
        (*(f32 *)((u8 *)(o) + (0x20))) = k[lo].x;
        (*(f32 *)((u8 *)(o) + (0x24))) = k[lo].y;
    } else {
        (*(f32 *)((u8 *)(o) + (0x20))) = k[lo].x + (k[hi].x - k[lo].x) * (f32)(o[6] - k[lo].t) / (f32)(k[hi].t - k[lo].t);
        (*(f32 *)((u8 *)(o) + (0x24))) = k[lo].y + (k[hi].y - k[lo].y) * (f32)(o[6] - k[lo].t) / (f32)(k[hi].t - k[lo].t);
    }
    return done;
}
