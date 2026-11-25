typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_80196AF8;
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_00088174(void) {
    Gfx *g = gTitleCardDisplayListCursor;
    u8 *s = D_80196AF8;
    u8 *img;
    u8 *pal;
    g->w0 = 0xE3001001;
    g->w1 = 0x8000;
    img = (*(u8 * *)((u8 *)(s) + (8))) + 0x340;
    pal = (*(u8 * *)((u8 *)(s) + (4))) + 0x2B28;
    gTitleCardDisplayListCursor = g + 1;
    func_00087b30(img, pal, 0x20, 0x32, 2);
}
