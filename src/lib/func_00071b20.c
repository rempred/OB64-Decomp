typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_801951AC;
void D_80179018(void);
void D_80180BDC(void);
void func_000754a0(s32 k);
void func_00071b20(void) {
    if ((D_801951AC) != ((void *)0) && (*(s16 *)((u8 *)(D_801951AC) + (0))) > 0) { u32 sync = 0xE7000000; u32 cyc = 0xE3000A01; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (cyc); _g->w1 = (0x200000); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001001); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000C00); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001201); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFCFFFFFF); _g->w1 = (0xFFFCF279); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; D_80179018(); { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xD7000000); _g->w1 = (0x80008000); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (cyc); _g->w1 = (0); }; { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (sync); _g->w1 = (0); }; func_000754a0(0); D_80180BDC(); } { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };;
}
