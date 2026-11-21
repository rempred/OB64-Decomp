typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern void *D_8022A260[];
typedef struct {
    u32 w0;
    u32 w1;
} GfxBB;
extern GfxBB *gTitleCardDisplayListCursor;
typedef GfxBB Gfx;
void func_001BD4B0(s32 piece, s32 x, s32 y);
extern u8 D_80229FA0[];
void func_001BD4B0(s32 piece, s32 x, s32 y);
void func_001BD6FC(u8 *o) {
    {
        GfxBB *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xFCFF97FF;
        _g->w1 = 0xFF2CFE7F;
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (14) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)((2 << 14)); };
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(D_8022A260[D_80229FA0[o[0x19]]]); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE8) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)((256 + (((0) & 0xf) * 16))) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF0) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = ((unsigned int)(((unsigned int)((7)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((15)) & ((0x01 << (10)) - 1)) << (14))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; } };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(o[0x1D]) & ((0x01 << (8)) - 1)) << (0)))); };
    func_001BD4B0(0x1C, (*(s16 *)((u8 *)(o) + (0x1E))), (*(s16 *)((u8 *)(o) + (0x20))));
    func_001BD4B0(0x1D, (*(s16 *)((u8 *)(o) + (0x22))) - 16, (*(s16 *)((u8 *)(o) + (0x20))));
    func_001BD4B0(0x1E, (*(s16 *)((u8 *)(o) + (0x1E))), (*(s16 *)((u8 *)(o) + (0x24))) - 16);
    func_001BD4B0(0x1F, (*(s16 *)((u8 *)(o) + (0x22))) - 16, (*(s16 *)((u8 *)(o) + (0x24))) - 16);
}
