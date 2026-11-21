typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    void *data;
    s16 h4;
} Grid29;
typedef struct {
    u8 unk0[8];
    s16 h8;
    s16 hA;
} Pair29;
typedef struct {
    u8 unk0000[0x168];
    void *p168[0x38];
    Pair29 *p248[0x5BF];
    void *p1944[0x1C];
    u8 unk19B4[0x94];
    Grid29 *grid;
    u8 unk1A4C[0x168];
    void *p1BB4[20];
} Battle29;
extern Battle29 *D_8022A974;
typedef struct {
    s16 total;
    s16 t;
    u8 cur[3];
    u8 from[3];
    u8 to[3];
} Fade29;
extern u8 D_801D0828;
extern u8 D_801D0829;
extern u8 D_801D082A;
void func_0029C404(void) {
    u32 i;
    s32 k;
    Fade29 *f;
    void *p;
    for (i = 0; i < 20; i++) {
        p = D_8022A974->p1BB4[i];
        if (p == ((void *)0)) {
            continue;
        }
        f = p;
        if (f->t == f->total) {
            for (k = 0; k < 3; k++) {
                f->cur[k] = f->to[k];
            }
        } else if (f->t < f->total) {
            f->t++;
            for (k = 0; k < 3; k++) {
                f->cur[k] = f->from[k] - (f->from[k] - f->to[k]) * f->t / f->total;
            }
        }
    }
    p = D_8022A974->p1BB4[0];
    if (p != ((void *)0)) {
        f = p;
        D_801D0828 = f->cur[0];
        D_801D0829 = f->cur[1];
        D_801D082A = f->cur[2];
    }
}
