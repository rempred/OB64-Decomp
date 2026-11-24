typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef signed long long s64;
typedef float f32;
typedef union {
    s32 m[4][4];
    s64 force_structure_alignment;
} Mtx;
void func_000225d0(void *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
extern s32 D_801939C8;
extern s32 D_80197AF4;
extern f32 D_80196AF4;
extern f32 D_801977D0;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx49;
extern Gfx49 *gTitleCardDisplayListCursor;
typedef struct {
    s16 x;
    s16 y;
    s16 z;
    u16 flag;
    s16 s;
    s16 t;
    u8 cn[4];
} Vtx49;
typedef struct {
    u8 pad0[0x8];
    Mtx *mtx;
    u8 padC[0x4];
    Vtx49 *vtx;
} FbSet49;
extern FbSet49 *D_800E9BE0;
extern u16 D_800E79E0;
extern u16 gCardMatrixCount;
void guMtxIdent(void *m);
void func_0004d1c0(s32 x0, s32 y0, s32 x1, s32 y1, s32 s0, s32 t0, s32 unused, u8 *col) {
    Vtx49 *v;
    s32 left;
    s32 right;
    s32 top;
    s32 bottom;
    s32 sl;
    s32 sr;
    s32 tt;
    s32 tb;
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
    left = (s32)(D_80196AF4 * x0) + D_801939C8;
    top = D_801977D0 * y0 + D_80197AF4;
    right = (s32)(D_80196AF4 * (x1 + 1)) + D_801939C8 - 1;
    bottom = D_801977D0 * (y1 + 1) + D_80197AF4 - 1.0f;
    func_000225d0(&D_800E9BE0->mtx[gCardMatrixCount], 0.0f, 320.0f, 240.0f, 0.0f, -100.0f, 100.0f, 1.0f);
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDA380007;
        g->w1 = (u32)&D_800E9BE0->mtx[gCardMatrixCount++] - 0x80000000;
    }
    guMtxIdent(&D_800E9BE0->mtx[gCardMatrixCount]);
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDA380003;
        g->w1 = (u32)&D_800E9BE0->mtx[gCardMatrixCount++] - 0x80000000;
    }
    v = D_800E9BE0->vtx + D_800E79E0;
    sl = s0 * 64;
    tt = t0 * 64;
    sr = (s0 + x1 - x0) * 64;
    tb = (t0 + y1 - y0) * 64;
    v[0].x = left;
    v[0].y = top;
    v[0].z = 0;
    v[0].flag = 0;
    v[0].s = sl;
    v[0].t = tt;
    v[0].cn[0] = col[0];
    v[0].cn[1] = col[1];
    v[0].cn[2] = col[2];
    v[0].cn[3] = col[3];
    v[1].x = right;
    v[1].y = top;
    v[1].z = 0;
    v[1].flag = 0;
    v[1].s = sr;
    v[1].t = tt;
    v[1].cn[0] = col[4];
    v[1].cn[1] = col[5];
    v[1].cn[2] = col[6];
    v[1].cn[3] = col[7];
    v[2].x = left;
    v[2].y = bottom;
    v[2].z = 0;
    v[2].flag = 0;
    v[2].s = sl;
    v[2].t = tb;
    v[2].cn[0] = col[12];
    v[2].cn[1] = col[13];
    v[2].cn[2] = col[14];
    v[2].cn[3] = col[15];
    v[3].x = right;
    v[3].y = bottom;
    v[3].z = 0;
    v[3].flag = 0;
    v[3].s = sr;
    v[3].t = tb;
    v[3].cn[0] = col[8];
    v[3].cn[1] = col[9];
    v[3].cn[2] = col[10];
    v[3].cn[3] = col[11];
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0x01004008;
        g->w1 = (u32)(D_800E9BE0->vtx + D_800E79E0);
        D_800E79E0 += 4;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0x06000602;
        g->w1 = 0x406;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
}
