typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_80196AF8;
extern Gfx D_801EEFB0[];
extern Gfx D_801EEF70[];
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_000a9fec(void) {
    Gfx *g = gTitleCardDisplayListCursor;
    u8 *s = D_80196AF8;
    u8 *pal;
    u8 *img;
    g->w0 = 0xDE000000;
    g->w1 = (u32)D_801EEFB0;
    pal = (*(u8 * *)((u8 *)(s) + (8)));
    img = (*(u8 * *)((u8 *)(s) + (4)));
    gTitleCardDisplayListCursor = g + 1;
    func_00087b30(pal + 0x1C0, img + 0x1668, 32, 32, 3);
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0x01004008;
    g->w1 = (u32)D_801EEF70;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0x06000204;
    g->w1 = 0x406;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xD7000000;
    g->w1 = 0x80008000;
}
