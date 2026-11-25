typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
s32 D_801BE978(s32, s32, s32);
void func_00246270(u8 *img, s32 a, s32 b, s32 w, s32 h, f32 x, f32 y);
void func_00246E34(u8 *img, f32 x, f32 y) {
    if (img[2] == 2) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001001); _g->w1 = (0x8000); };
        if (img[3] == 0) {
            { Gfx *_p = gTitleCardDisplayListCursor++; _p->w0 = 0xFD100000; _p->w1 = (u32)((img) + (D_801BE978((img)[3], (*(u16 *)((u8 *)(img) + (4))), (*(u16 *)((u8 *)(img) + (6)))) + 8)); { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE8000000); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5000100); _g->w1 = (0x7000000); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF0000000); _g->w1 = (0x703C000); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); }; };
        } else if (img[3] == 1) {
            { Gfx *_p = gTitleCardDisplayListCursor++; _p->w0 = 0xFD100000; _p->w1 = (u32)((img) + (D_801BE978((img)[3], (*(u16 *)((u8 *)(img) + (4))), (*(u16 *)((u8 *)(img) + (6)))) + 8)); { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE8000000); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5000100); _g->w1 = (0x7000000); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF0000000); _g->w1 = (0x73FC000); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); }; };
        }
    }
    func_00246270(img, 0, 0, (*(u16 *)((u8 *)(img) + (4))), (*(u16 *)((u8 *)(img) + (6))), x, y);
}
