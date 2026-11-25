typedef signed short s16;
typedef signed int s32;
typedef struct {
    s32 t;
    s32 n;
    s16 x0;
    s16 y0;
    s16 x1;
    s16 y1;
    s16 unk10;
    s16 arg;
} Lerp2B5;
void func_002B5D8C(s32 a, s32 b, s32 c, s32 d, s32 e);
void func_002B5D8C(s32 a0, s32 a1, s32 cx, s32 cy, s32 col);
void func_002B6030(Lerp2B5 *l) {
    s32 r = l->n - l->t;
    func_002B5D8C(l->x0 * r / l->n, l->y0 * r / l->n, l->x1 * l->t / l->n, l->y1 * l->t / l->n, l->arg);
}
