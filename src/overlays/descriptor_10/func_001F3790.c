typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u8 unk0000[0x1C0];
    s32 strategy;
    u8 unk01C4[0x5020];
    s32 listB[0x36];
    s32 nB;
    s32 listA[0x100];
    s32 nA;
} Ctx1F;
extern Ctx1F *D_801CE8BC;
extern f32 D_801D0700;
extern f32 D_801D0704;
extern f32 D_801D0710;
extern f32 D_801D0720;
extern f32 D_801D072C;
extern f32 D_801D0730;
extern f32 D_801D083C;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef struct {
    s32 m[16];
} Mtx1F;
void guScale(Mtx1F *m, f32 x, f32 y, f32 z);
void func_000210c0(Mtx1F *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
void func_000228d0(Mtx1F *m, u16 *perspNorm, f32 fovy, f32 aspect, f32 near, f32 far, f32 scale);
extern Mtx1F *D_801969B0;
extern f32 D_801D0700;
extern f32 D_801D0704;
extern f32 D_801D0710;
extern f32 D_801D0720;
extern f32 D_801D072C;
extern f32 D_801D0730;
extern f32 D_801D083C;
typedef void (*Draw1F)(u8 *o);
void func_000225d0(Mtx1F *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
void func_00023018(Mtx1F *m, f32 r, f32 p, f32 h);
void guTranslate(Mtx1F *m, f32 x, f32 y, f32 z);
extern f32 D_801D0774;
extern f32 D_801D0778;
extern f32 D_801D077C;
extern f32 D_801D0780;
extern f32 D_801D0784;
extern f32 D_801D0788;
extern f32 D_801D078C;
extern f32 D_801D0790;
extern f32 D_801D0794;
void func_001F3790(void) {
    u32 i;
    for (i = 0; i < 0x100; i++) {
        u8 *o = (u8 *)D_801CE8BC->listA[i];
        if (o != ((void *)0)) {
            if ((*(Draw1F *)((u8 *)(o) + (0))) != ((void *)0)) {
                if (o[0x14] == 3) {
                    u16 norm;
                    Gfx *g;
                    Draw1F fn;
                    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
                    func_000225d0(D_801969B0, -160.0f, 160.0f, -120.0f, 120.0f, 1.0f, 2000.0f, 1.0f);
                    guTranslate(D_801969B0 + 1, D_801D0774, D_801D0778, D_801D077C);
                    guScale(D_801969B0 + 2, D_801D078C, D_801D0790, D_801D0794);
                    func_00023018(D_801969B0 + 3, D_801D0780, D_801D0784, D_801D0788);
                    gTitleCardDisplayListCursor[0].w0 = 0xDA380007;
                    gTitleCardDisplayListCursor[0].w1 = (u32)&D_801969B0[0];
                    gTitleCardDisplayListCursor[1].w0 = 0xDA380002;
                    gTitleCardDisplayListCursor[1].w1 = (u32)&D_801969B0[1];
                    gTitleCardDisplayListCursor[2].w0 = 0xDA380001;
                    gTitleCardDisplayListCursor[2].w1 = (u32)&D_801969B0[2];
                    gTitleCardDisplayListCursor[3].w0 = 0xDA380001;
                    gTitleCardDisplayListCursor[3].w1 = (u32)&D_801969B0[3];
                    fn = (*(Draw1F *)((u8 *)(o) + (0)));
                    gTitleCardDisplayListCursor++;
                    D_801969B0++;
                    gTitleCardDisplayListCursor++;
                    D_801969B0++;
                    gTitleCardDisplayListCursor++;
                    D_801969B0++;
                    gTitleCardDisplayListCursor++;
                    D_801969B0++;
                    fn(o);
                    g = gTitleCardDisplayListCursor++;
                    g->w0 = 0xD8380002;
                    g->w1 = 0x40;
                    func_000228d0(D_801969B0, &norm, D_801D0710, 4.0f / 3.0f, 1.0f, 4000.0f, 1.0f);
                    func_000210c0(D_801969B0 + 1, D_801D0720, D_801D072C, D_801D0704,
                             D_801D0730, D_801D083C, D_801D0700, 0.0f, 1.0f, 0.0f);
                    g = gTitleCardDisplayListCursor++;
                    g->w0 = 0xDB0E0000;
                    g->w1 = norm;
                    g = gTitleCardDisplayListCursor++;
                    g->w0 = 0xDA380007;
                    g->w1 = (u32)D_801969B0++;
                    g = gTitleCardDisplayListCursor++;
                    g->w0 = 0xDA380005;
                    g->w1 = (u32)D_801969B0++;
                } else {
                    (*(Draw1F *)((u8 *)(o) + (0)))(o);
                }
            }
        }
    }
}
