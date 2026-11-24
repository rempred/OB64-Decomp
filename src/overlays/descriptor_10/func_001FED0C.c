typedef unsigned char u8;
typedef signed short s16;
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
extern void *gTitleCardDisplayListCursor;
typedef struct {
    u8 *img;
} ImgRef1F8;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx1F8;
extern u8 D_80220E71;
extern u8 D_80220E73;
extern u8 D_80220E75;
extern u8 D_801CEB30[];
void func_001FDEC8(u8 *u, u8 *tint);
extern u8 D_801CEC18[];
void func_001FC538(u8 *img);
typedef union {
    Gfx1F8 words;
    long long force_align[1];
} GfxU1F8;
void func_001FED0C(ImgRef1F8 *pp) {
    Gfx1F8 *g;
    u8 r;
    u8 gr;
    u8 b;
    u8 a;
    u32 i;
    f32 z;
    f32 d0;
    f32 d1;
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
        if (d0 <= d1) {
            continue;
        }
        if (z <= *(f32 *)&D_801D0770.unk34[8]) {
            continue;
        }
        func_001FDEC8(D_801D0770.units + i * 0x64,
                                 (D_801D0828[4] & 4) ? D_801D0828 : ((void *)0));
    }
    if (pp->img != ((void *)0)) {
        r = D_80220E71;
        gr = D_80220E73;
        b = D_80220E75;
        g = gTitleCardDisplayListCursor;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_801CEC18;
        gTitleCardDisplayListCursor = g + 1;
        a = 0xFF;
        if (D_801D0828[4] & 8) {
            r = r * D_801D0828[0] / 255;
            gr = gr * D_801D0828[1] / 255;
            b = b * D_801D0828[2] / 255;
            a = a * D_801D0828[3] / 255;
        }
        g[1].w0 = 0xFA000000;
        g[1].w1 = (r << 24) | ((gr & 0xFF) << 16) | ((b & 0xFF) << 8) | (a & 0xFF);
        gTitleCardDisplayListCursor = g + 2;
        func_001FC538(pp->img);
        { GfxU1F8 *_g = (GfxU1F8 *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
        { GfxU1F8 *_g = (GfxU1F8 *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
        { GfxU1F8 *_g = (GfxU1F8 *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->words.w0 = (0xE3000A01); _g->words.w1 = (0); };
        { GfxU1F8 *_g = (GfxU1F8 *)gTitleCardDisplayListCursor; gTitleCardDisplayListCursor = _g + 1; _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
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
        if (d0 <= d1) {
            continue;
        }
        if (*(f32 *)&D_801D0770.unk34[8] < z) {
            continue;
        }
        func_001FDEC8(D_801D0770.units + i * 0x64,
                                 (D_801D0828[4] & 0x10) ? D_801D0828 : ((void *)0));
    }
}
