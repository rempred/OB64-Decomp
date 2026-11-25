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
    s16 x0;
    s16 y0;
    s16 x1;
    s16 y1;
    s16 s;
    s16 t;
} Atlas27;
extern Atlas27 D_8022CA38[];
void func_0027D4AC(s32 x, s32 y, u16 id) {
    Atlas27 *a = &D_8022CA38[id];
    s32 pad;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((a->x1 + x) << 2)) > (0) ? ((s16)((a->x1 + x) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((a->y1 + y) << 2)) > (0) ? ((s16)((a->y1 + y) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((a->x0 + x) << 2)) > (0) ? ((s16)((a->x0 + x) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + a->y0) << 2)) > (0) ? ((s16)((y + a->y0) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((a->s << 5) - (((s16)((a->x0 + x) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((a->x0 + x) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((a->x0 + x) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((a->x0 + x) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((a->x0 + x) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((a->t << 5) - ((((y + a->y0) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((y + a->y0) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((y + a->y0) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((y + a->y0) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((y + a->y0) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
void func_0027D4AC(s32 x, s32 y, u16 id);
