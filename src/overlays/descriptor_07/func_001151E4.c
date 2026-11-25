typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_801F3A34;
extern s32 D_801F0DE0;
extern u8 D_801E91D0[];
extern u8 D_801E9D10[];
void func_00113A90(s32 x0, s32 y0, s32 x1, s32 y1, s32 s, s32 t, s32 ss, s32 ts);
void func_001151E4(void) {
    if (D_801F3A34 != 0) {
        return;
    }
    if ((u32)(D_801F0DE0 - 0x1B) < 2 || D_801F0DE0 == 0x63) {
        return;
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFCF279); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001001); _g->w1 = (0x8000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFD100000); _g->w1 = ((u32)D_801E91D0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE8000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5000100); _g->w1 = (0x7000000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF0000000); _g->w1 = (0x703C000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFD500000); _g->w1 = ((u32)D_801E9D10); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5500000); _g->w1 = (0x7080200); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF3000000); _g->w1 = (0x714F156); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5480C00); _g->w1 = (0x80200); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF2000000); _g->w1 = (0xBC034); };
    func_00113A90(0x88, 0xBA, 0xB8, 0xC8, 0, 0, 5, 5);
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
}
