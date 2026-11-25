typedef signed short s16;
typedef signed int s32;
typedef float f32;
typedef struct {
    s32 m[4][4];
} MtxEB;
extern MtxEB D_801AD290;
extern MtxEB D_801AD2D0;
extern MtxEB D_801AD310;
extern MtxEB D_801AD350[8];
extern s16 D_801AB940[8][2];
void func_000225d0(MtxEB *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
void guScale(MtxEB *m, f32 x, f32 y, f32 z);
void guRotate(MtxEB *m, f32 a, f32 x, f32 y, f32 z);
void guTranslate(MtxEB *m, f32 x, f32 y, f32 z);
void func_00028740(MtxEB *a, MtxEB *b, MtxEB *r);
void func_000ecdf8(void) {
    MtxEB t;
    MtxEB r;
    s32 i;
    func_000225d0(&D_801AD290, -160.0f, 160.0f, -120.0f, 120.0f, -100.0f, 100.0f, 1.0f);
    guScale(&D_801AD2D0, 0.6f, 0.6f, 0.6f);
    guRotate(&D_801AD310, 90.0f, 0.0f, 1.0f, 0.0f);
    for (i = 0; i < 8; i++) {
        guTranslate(&t, D_801AB940[i][0], D_801AB940[i][1], 0.0f);
        guRotate(&r, i * 45.0f, 0.0f, 0.0f, -1.0f);
        func_00028740(&r, &t, &D_801AD350[i]);
    }
}
