typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef signed long long s64;
typedef union {
    s32 m[4][4];
    s64 force_structure_alignment;
} Mtx;
extern void *D_8018FDC0;
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
typedef struct {
    u8 pad0[0xC8];
    void *img;
    void *tlut;
} Ctx49;
extern u8 D_8018F3E0[];
void func_0004a038(void *v, s16 x0, s16 y0, s16 x1, s16 y1);
void func_0004a150(u16 id, s16 x0, s16 y0, s16 x1, s16 y1);
void func_00049cbc(s32 id, s16 x0, s16 y0, s16 x1, s16 y1) {
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_8018F3E0;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFD500000;
        g->w1 = (u32)((Ctx49 *)D_8018FDC0)->img;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF5500000;
        g->w1 = 0x07018060;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE6000000;
        g->w1 = 0;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF3000000;
        g->w1 = 0x073FF200;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF5400800;
        g->w1 = 0x00018060;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF2000000;
        g->w1 = 0x000FC0FC;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFD100000;
        g->w1 = (u32)((Ctx49 *)D_8018FDC0)->tlut;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE8000000;
        g->w1 = 0;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF5000100;
        g->w1 = 0x07000000;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE6000000;
        g->w1 = 0;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xF0000000;
        g->w1 = 0x0703C000;
    }
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
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
    func_0004a038(D_800E9BE0->vtx + D_800E79E0, x0, y0, x1, y1);
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
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
    func_0004a150(id, x0, y0, x1, y1);
    {
        Gfx49 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
}
void func_0004a038(void *v, s16 x0, s16 y0, s16 x1, s16 y1);
