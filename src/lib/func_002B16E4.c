typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_80197178[];
void D_801B77CC(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_002B16E4(u8 *o) {
    Gfx *g;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xD7000002;
    g->w1 = 0x80008000;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE3000A01;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE200001C;
    g->w1 = 0x0F0A4000;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xFC11FE23;
    g->w1 = 0xFFFFF3F9;
    D_801B77CC(D_80197178, &gTitleCardDisplayListCursor, o, 0, 0, 0);
}
