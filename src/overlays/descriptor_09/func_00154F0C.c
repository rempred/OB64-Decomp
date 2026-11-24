typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_00151F40(void *a, s32 b, s32 c);
void func_00151F40(void *a, s32 y, s32 k);
void func_00154F0C(s32 x, s32 y, s32 n) {
    s32 d = n % 9;
    if (d != 0) {
        d--;
    }
    func_00151F40(x, y + 3, 0x46);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 13) << 2)) > (0) ? ((s16)((x + 13) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 9) << 2)) > (0) ? ((s16)((y + 9) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 7) << 2)) > (0) ? ((s16)((x + 7) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((d * 7 << 5) - (((s16)((x + 7) << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)((x + 7) << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)((x + 7) << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)((x + 7) << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)((x + 7) << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((((n == 0 ? 0x340 : 0) | 0x200) - (((y << 2) < 0) ? (((s16)(1 << 10) < 0) ? ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(1 << 10)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1 << 10)) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
