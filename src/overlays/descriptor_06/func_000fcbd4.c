typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_801B3E20;
typedef struct {
    s32 t;
    f32 v;
} KeyFA5;
extern KeyFA5 D_801B40F4[];
extern KeyFA5 D_801B4144[];
extern inline f32 KeyLerpFA5(KeyFA5 *k, s32 n, s32 t) {
    s32 i;
    for (i = 0; i < n; i++) {
        if (k[i].t <= t && t < k[i + 1].t) {
            break;
        }
    }
    if (i < n) {
        s32 j = i + 1;
        KeyFA5 *a = (KeyFA5 *)(i * 8 + (s32)k);
        KeyFA5 *b = (KeyFA5 *)(j * 8 + (s32)k);
        return (b->v - a->v) * (f32)(t - a->t) / (f32)(b->t - a->t) + a->v;
    }
    return k[i].v;
}
s32 func_000fcbd4(void) {
    u8 *p = D_801B3E20 + 0x1E4;
    s32 done = 0;
    (*(f32 *)((u8 *)(p) + (0xC))) = KeyLerpFA5(D_801B40F4, 9, (*(s32 *)((u8 *)(D_801B3E20) + (0x1E8))));
    (*(f32 *)((u8 *)(p) + (0x14))) = KeyLerpFA5(D_801B4144, 15, (*(s32 *)((u8 *)(p) + (4))));
    if ((*(s32 *)((u8 *)(p) + (4))) < 30) {
        (*(s32 *)((u8 *)(p) + (4)))++;
    } else {
        done = 1;
    }
    return done;
}
