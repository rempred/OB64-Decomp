typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x60];
    u16 flags;
    u8 unk62[4];
    s16 id;
} Ent23;
typedef struct {
    Ent23 ent[4];
    u8 unk1A0[0x1D0];
    s16 x0;
    s16 x1;
    s16 y0;
    s16 y1;
    u8 unk378[0x2D8];
    u16 flags;
    s16 h652;
    u8 unk654[2];
    s16 fade;
} Ctx23;
extern Ctx23 *D_801EFE48;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void D_801B5CAC(s32 a, s32 b, s32 c);
void func_00240048(void);
typedef struct {
    u8 unk0[4];
    u16 w;
    u16 h;
} SizeEB;
extern u8 D_801F0320[];
u32 D_801BE978(s32 siz, u16 w, u16 h);
void func_00240048(void) {
    SizeEB *s = (*(SizeEB * *)((u8 *)(D_801EFE48) + (0x5C4)));
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_801F0320); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((*(u8 *)((u8 *)(D_801EFE48) + (0x653)))) & ((0x01 << (8)) - 1)) << (0)))); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (14) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)((2 << 14)); };
    { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)((u8 *)s + (D_801BE978(0, s->w, s->h) + 8)); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE8) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)((256 + (((0) & 0xf) * 16))) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF0) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = ((unsigned int)(((unsigned int)((7)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((15)) & ((0x01 << (10)) - 1)) << (14))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; } };
    D_801B5CAC((s32)s, 0xFF, 0x2B);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
