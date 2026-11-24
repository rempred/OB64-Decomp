typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_001524F4(s32 x0, s32 y0, s32 x1, s32 y1) {
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xED000000 | ((unsigned int)(((unsigned int)((s32)((f32)(x0 < 0 ? 0 : x0) * 4.0f)) & ((0x01 << (12)) - 1)) << (12))) |
                 ((unsigned int)(((unsigned int)((s32)((f32)(y0 < 0 ? 0 : y0) * 4.0f)) & ((0x01 << (12)) - 1)) << (0)));
        _g->w1 = ((unsigned int)(((unsigned int)((s32)((f32)(x1 == 320 ? 319 : x1) * 4.0f)) & ((0x01 << (12)) - 1)) << (12))) |
                 ((unsigned int)(((unsigned int)((s32)((f32)(y1 == 240 ? 239 : y1) * 4.0f)) & ((0x01 << (12)) - 1)) << (0)));
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
