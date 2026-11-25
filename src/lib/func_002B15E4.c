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
void func_002B15E4(u8 *o, s32 b, s32 c) {
    Gfx *g;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    if ((o[2] & 3) != 3) {
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE3000A01;
        g->w1 = 0x100000;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE200001C;
        g->w1 = 0x0C184240;
        g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFC21FFFF;
        g->w1 = 0xFFFFF238;
    }
    D_801B77CC(D_80197178, &gTitleCardDisplayListCursor, o, 1, b, c);
}
