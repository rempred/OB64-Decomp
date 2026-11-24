typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
s32 func_0000378C(void);
extern void *g_resource_state_word;
extern void *D_800E8210;
void boot_display_list_color_rect_packet_emit(u16 color, s16 x0, s16 y0, s16 x1, s16 y1) {
    if (x0 < 0) {
        x0 = 0;
    } else if (x0 >= 320) {
        x0 = 319;
    }
    if (y0 < 0) {
        y0 = 0;
    } else if (y0 >= 320) {
        y0 = 319;
    }
    if (x1 < 0) {
        x1 = 0;
    } else if (x1 >= 320) {
        x1 = 319;
    }
    if (y1 < 0) {
        y1 = 0;
    } else if (y1 >= 240) {
        y1 = 239;
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (0x300000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    if (func_0000378C()) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFE000000); _g->w1 = ((u32)g_resource_state_word - 0x80000000); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFF10013F); _g->w1 = ((u32)g_resource_state_word - 0x80000000); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF7000000); _g->w1 = (0xFFFCFFFC); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF6000000 | ((unsigned int)(((unsigned int)(x1) & ((0x01 << (10)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(y1) & ((0x01 << (10)) - 1)) << (2)))); _g->w1 = (((unsigned int)(((unsigned int)(x0) & ((0x01 << (10)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(y0) & ((0x01 << (10)) - 1)) << (2)))); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFF10013F); _g->w1 = ((u32)D_800E8210 - 0x80000000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF7000000); _g->w1 = ((color << 16) | color); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF6000000 | ((unsigned int)(((unsigned int)(x1) & ((0x01 << (10)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(y1) & ((0x01 << (10)) - 1)) << (2)))); _g->w1 = (((unsigned int)(((unsigned int)(x0) & ((0x01 << (10)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(y0) & ((0x01 << (10)) - 1)) << (2)))); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
}
