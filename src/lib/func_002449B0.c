typedef signed short s16;
typedef signed int s32;
typedef float f32;
void * func_00001330(unsigned int);
void bzero(void *p, s32 n);
typedef struct {
    s32 n;
    s32 total;
    f32 *d;
    f32 *x;
    f32 *y;
    f32 *cx;
    f32 *cy;
} Path244;
typedef struct {
    s16 x;
    s16 y;
    s16 len;
} PathPt244;
void func_002447A0(s32 n, f32 *d, f32 *v, f32 *c);
void func_002447A0(s32 n, f32 *x, f32 *y, f32 *z);
void func_002449B0(Path244 *p, PathPt244 *pts) {
    s32 i;
    bzero(p, 0x1C);
    for (p->n = 0; pts[p->n].len >= 0; p->n++) {
    }
    p->d = func_00001330(p->n * 5 * 4);
    p->x = p->d + p->n;
    p->y = p->d + p->n * 2;
    p->cx = p->d + p->n * 3;
    p->cy = p->d + p->n * 4;
    bzero(p->d, p->n * 5 * 4);
    p->d[0] = pts[0].len;
    for (i = 1; i < p->n; i++) {
        p->d[i] = p->d[i - 1] + pts[i].len;
    }
    p->total = p->d[p->n - 1];
    for (i = 0; i < p->n; i++) {
        p->x[i] = pts[i].x;
        p->y[i] = pts[i].y;
    }
    func_002447A0(p->n, p->d, p->x, p->cx);
    func_002447A0(p->n, p->d, p->y, p->cy);
}
