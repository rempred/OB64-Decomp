typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_8023DF48[];
void D_8022B980(u8 *img, s32 x, s32 y);
struct TitleImageHeader;
void func_002908CC(struct TitleImageHeader *image) {
    u8 *img = (u8 *)image;
    u16 w = (*(u16 *)((u8 *)(img) + (4)));
    s32 row;
    s32 h;
    if (img[3] == 3) {
        row = ((u32)(w + 3) >> 2) << 4;
    } else if (img[3] == 2) {
        row = ((u32)(w + 3) >> 2) << 3;
    } else if (img[3] == 1) {
        row = ((u32)(w + 7) >> 3) << 3;
    } else {
        row = ((u32)(w + 15) >> 4) << 3;
    }
    h = (*(u16 *)((u8 *)(img) + (6)));
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8023DF48); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(255) & ((0x01 << (8)) - 1)) << (0)))); };
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(img + (row * h + 8)); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE8) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(256) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF0) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = ((unsigned int)(((unsigned int)((7)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((255)) & ((0x01 << (10)) - 1)) << (14))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; } };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xD7) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (11))) | ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((1)) & ((0x01 << (7)) - 1)) << (1)))); _g->w1 = (((unsigned int)(((unsigned int)((0x8000)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((0x8000)) & ((0x01 << (16)) - 1)) << (0)))); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    D_8022B980(img, 0, 0);
}
