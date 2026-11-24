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
extern void *D_8018FDC0;
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
extern u8 D_8018FA70[];
void D_80197B70(void);
void func_0004ce90(s32 x0, s32 y0, s32 x1, s32 y1, s32 s0, s32 t0, s32 unused, u8 *col) {
    Vtx49 *v;
    s32 left;
    s32 right;
    s32 top;
    s32 bottom;
    s32 sl;
    s32 sr;
    s32 tt;
    s32 tb;
    f32 sx = D_80196AF4;
    f32 sy = D_801977D0;
    s32 ox = D_801939C8;
    s32 oy = D_80197AF4;
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_8018FA70;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDA380007;
        g->w1 = (u32)D_8018FDC0 + 0x80000008;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDA380005;
        g->w1 = (u32)D_8018FDC0 + 0x80000048;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDA380003;
        g->w1 = (u32)D_8018FDC0 + 0x80000088;
    }
    v = D_800E9BE0->vtx + D_800E79E0;
    right = 0xA0 - ((s32)(sx * (x1 + 1)) + ox);
    top = 0x78 - ((s32)(sy * y0) + oy);
    sl = s0 * 64;
    tt = t0 * 64;
    sr = (s0 + x1 - x0) * 64;
    left = 0xA0 - ((s32)(sx * x0) + ox);
    tb = (t0 + y1 - y0) * 64;
    bottom = 0x78 - ((s32)(sy * (y1 + 1)) + oy);
    v[0].x = right;
    v[0].y = top;
    v[0].z = 0;
    v[0].flag = 0;
    v[0].s = sl;
    v[0].t = tt;
    v[0].cn[0] = col[4];
    v[0].cn[1] = col[5];
    v[0].cn[2] = col[6];
    v[0].cn[3] = col[7];
    v[1].x = left;
    v[1].y = top;
    v[1].z = 0;
    v[1].flag = 0;
    v[1].s = sr;
    v[1].t = tt;
    v[1].cn[0] = col[0];
    v[1].cn[1] = col[1];
    v[1].cn[2] = col[2];
    v[1].cn[3] = col[3];
    v[2].x = left;
    v[2].y = bottom;
    v[2].z = 0;
    v[2].flag = 0;
    v[2].s = sr;
    v[2].t = tb;
    v[2].cn[0] = col[12];
    v[2].cn[1] = col[13];
    v[2].cn[2] = col[14];
    v[2].cn[3] = col[15];
    v[3].x = right;
    v[3].y = bottom;
    v[3].z = 0;
    v[3].flag = 0;
    v[3].s = sl;
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
        g->w0 = 0x06000204;
        g->w1 = 0x406;
    }
    D_80197B70();
}
