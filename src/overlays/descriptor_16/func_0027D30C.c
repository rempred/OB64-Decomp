typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef struct {
    u16 w;
    u16 h;
    s16 s;
    s16 t;
} Icon27A;
extern Icon27A D_8022C8A0[];
void func_0027D30C(s32 x, s32 y, s32 k) {
    Icon27A *e = &D_8022C8A0[(u16)k];
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + e->w) << 2)) > (0) ? ((s16)((x + e->w) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + e->h) << 2)) > (0) ? ((s16)((y + e->h) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((e->s << 5) - (((s16)(x << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((e->t << 5) - (((y << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
