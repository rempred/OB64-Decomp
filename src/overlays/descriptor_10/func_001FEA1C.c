typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u8 *spr;
    u8 unk04[0x2C];
    u8 *spr2;
    u8 unk34[0x2C];
    u8 *units;
    u32 nUnits;
    u8 *objs;
    void *buf6C;
    u32 nObjs;
    s32 unk74;
    void *buf78;
    void *buf7C;
    void *buf80;
    u8 unk84[0x1C];
} State1F8;
extern State1F8 D_801D0770;
extern u8 D_801D0828[];
typedef struct {
    u16 v[8];
} Vtx1F8;
extern Vtx1F8 *D_80197178;
extern void *gTitleCardDisplayListCursor;
typedef struct {
    u8 *img;
} ImgRef1F8;
typedef struct {
    u16 magic;
} ImgHdr1F8;
void func_001F91E8(ImgRef1F8 *pp);
void func_001F962C(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_001F9E00(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_001FA240(void *a, void *b, u8 *img);
void func_001FA240(void *a, void *b, u8 *img);
extern inline void func_001FAD18(ImgRef1F8 *pp) {
    u8 *img = pp->img;
    s32 pad[2];
    if (((ImgHdr1F8 *)img)->magic == 0x4235) {
        u8 *dst = (u8 *)&D_80197178;
        void *gp = &gTitleCardDisplayListCursor;
        if (img[2] == 1) {
            func_001FA240(dst, gp, img);
        } else if (img[2] == 3) {
            func_001F9E00(dst, gp, img, 0, 0, 0);
        } else {
            func_001F962C(dst, gp, img, 0, 0, 0);
        }
    } else {
        func_001F91E8(pp);
    }
}
typedef struct {
    u32 w0;
    u32 w1;
} Gfx1F8;
extern u8 D_80220E71;
extern u8 D_80220E73;
extern u8 D_80220E75;
extern u8 D_801CEBA0[];
extern u8 D_801CEB30[];
void func_001FDEC8(u8 *u, u8 *tint);
void func_001FEA1C(ImgRef1F8 *pp) {
    Gfx1F8 *g;
    u8 r;
    u8 gr;
    u8 b;
    u8 a;
    u32 i;
    f32 z;
    f32 d0;
    f32 d1;
    if (pp->img != ((void *)0)) {
        r = D_80220E71;
        gr = D_80220E73;
        b = D_80220E75;
        g = gTitleCardDisplayListCursor;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_801CEBA0;
        gTitleCardDisplayListCursor = g + 1;
        a = 0xFF;
        if (D_801D0828[4] & 1) {
            r = r * D_801D0828[0] / 255;
            gr = gr * D_801D0828[1] / 255;
            b = b * D_801D0828[2] / 255;
            a = a * D_801D0828[3] / 255;
        }
        g[1].w0 = 0xFA000000;
        g[1].w1 = (r << 24) | ((gr & 0xFF) << 16) | ((b & 0xFF) << 8) | (a & 0xFF);
        gTitleCardDisplayListCursor = g + 2;
        func_001FAD18(pp);
    }
    {
        Gfx1F8 *g2 = gTitleCardDisplayListCursor;
        g2->w0 = 0xDE000000;
        g2->w1 = (u32)D_801CEB30;
        g2++;
        gTitleCardDisplayListCursor = g2;
    }
    for (i = 0; i < D_801D0770.nUnits; i++) {
        z = *(s16 *)(D_801D0770.units + i * 0x64 + 4);
        d0 = *(f32 *)&D_801D0770.unk04[8] - z;
        if (!(d0 > 0.0f)) {
            d0 = -d0;
        }
        d1 = *(f32 *)&D_801D0770.unk34[8] - z;
        if (!(d1 > 0.0f)) {
            d1 = -d1;
        }
        if (d1 < d0) {
            continue;
        }
        func_001FDEC8(D_801D0770.units + i * 0x64,
                                 (D_801D0828[4] & 2) ? D_801D0828 : ((void *)0));
    }
}
