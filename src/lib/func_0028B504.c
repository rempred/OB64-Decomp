typedef unsigned char u8;
typedef unsigned int u32;
extern u8 D_8023DE3C;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_0028B504(void);
extern void *g_resource_state_word;
extern void *D_800E8210;
extern u8 D_80186380[];
u32 osVirtualToPhysical(void *p);
void func_0028B504(void) {
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (u32)(0x300000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (u32)(0); };
    if (g_resource_state_word != ((void *)0)) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFE000000); _g->w1 = (u32)((u32)g_resource_state_word - 0x80000000); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFF10027F); _g->w1 = (u32)((u32)g_resource_state_word - 0x80000000); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF7000000); _g->w1 = (u32)(0xFFFCFFFC); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = (u32)(D_80186380); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFF10027F); _g->w1 = (u32)(osVirtualToPhysical(D_800E8210)); };
    if (D_8023DE3C < 2) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF7000000); _g->w1 = (u32)(0x10001); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = (u32)(D_80186380); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    if (D_8023DE3C < 5) {
        D_8023DE3C++;
    }
}
