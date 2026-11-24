typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern s32 D_801B8090;
extern s32 g_resource_state_word;
u8 D_8016CD30(void);
void func_001CF65C(void);
void func_00025a10(u32 f);
extern void *D_800E8210;
extern u8 D_80186380[];
u32 osVirtualToPhysical(void *p);
void func_001CF65C(void) {
    if (D_8016CD30()) {
        func_00025a10(0x9A);
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (u32)(0x300000); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xED000000); _g->w1 = (u32)(0xA00780); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        if (g_resource_state_word != 0) {
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFE000000); _g->w1 = (u32)(g_resource_state_word - 0x80000000); };
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFF10027F); _g->w1 = (u32)(g_resource_state_word - 0x80000000); };
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF7000000); _g->w1 = (u32)(0xFFFCFFFC); };
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = (u32)(D_80186380); };
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        }
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFF10027F); _g->w1 = (u32)(osVirtualToPhysical(D_800E8210)); };
        if (D_801B8090 != 0) {
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF7000000); _g->w1 = (u32)(0x10001); };
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = (u32)(D_80186380); };
        }
        D_801B8090 = 1;
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (u32)(0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    }
}
