typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_8022C5C0;
typedef struct {
    s32 m[16];
} Mtx27;
typedef struct {
    s16 v[8];
} Vtx27;
typedef struct {
    void *p0;
    void *p4;
    Mtx27 *mtx;
    void *pC;
    Vtx27 *vtx;
} FbSet27;
typedef struct {
    u8 *spr;
    u8 unk04[0x2C];
    u8 *spr2;
    u8 unk34[0x50];
    s16 transX;
    s16 transY;
    s16 scaleX;
    s16 scaleY;
    u8 unk8C[0x14];
} Battle27;
extern Battle27 D_801D0770;
extern u16 gCardMatrixCount;
extern u16 D_800E79E0;
extern Mtx27 *D_801969B0;
extern Vtx27 *D_80197178;
typedef struct {
    s16 vscale[4];
    s16 vtrans[4];
} Vp27;
extern Vp27 D_8022C860;
extern Vp27 D_8022C870;
extern u8 D_801CEAA8;
extern u8 D_801CEAA9;
extern u8 D_801CEAAA;
s32 D_801B5934(void);
s32 D_801B5940(void);
void D_801B8F2C(u8 *o);
void D_801BB58C(u8 *pp);
void D_801BB87C(u8 *pp);
void D_8020E4A0(void);
void D_8020E3A0(u16 a);
void D_801B574C(u8 a);
void D_801B0300(void);
void D_8022BF68(void);
void func_0027B538(FbSet27 *fb) {
    D_801969B0 = fb->mtx + gCardMatrixCount;
    D_80197178 = fb->vtx + D_800E79E0;
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    D_8022C860.vtrans[0] = D_801D0770.transX + 0x280;
    D_8022C860.vtrans[1] = D_801D0770.transY + 0x1E0;
    D_8022C860.vscale[0] = D_801D0770.scaleX + 0x280;
    D_8022C860.vscale[1] = D_801D0770.scaleY + 0x1E0;
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDC080008); _g->w1 = ((u32)&D_8022C870); };
    if (D_801B5934()) {
        D_801B8F2C((u8 *)&D_801D0770.spr);
        D_801BB58C((u8 *)&D_801D0770.spr);
    }
    D_8020E4A0();
    D_8020E3A0(1);
    D_801B574C(D_801CEAA8);
    D_8022BF68();
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    D_801B0300();
    D_801B574C(D_801CEAA9);
    if (D_801B5940()) {
        D_801B8F2C((u8 *)&D_801D0770.spr2);
        D_801BB87C((u8 *)&D_801D0770.spr2);
    }
    D_8020E3A0(2);
    D_801B574C(D_801CEAAA);
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDC080008); _g->w1 = ((u32)&D_8022C870); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFDF6FB); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x00504240); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (D_8022C5C0[5]); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE44FC3BC); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE1000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF1000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    gCardMatrixCount += D_801969B0 - (fb->mtx + gCardMatrixCount);
    D_800E79E0 += D_80197178 - (fb->vtx + D_800E79E0);
}
