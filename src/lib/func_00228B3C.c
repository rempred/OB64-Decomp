typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_00227870(u8 *p, s32 a, s32 b);
void func_00228B3C(u8 *p, s32 a, s32 b) {
    Gfx *g = gTitleCardDisplayListCursor++;
    u32 i;
    u8 *q;
    g->w0 = 0xFA000000;
    g->w1 = -1;
    for (i = 0, q = p + 0x24; i < 5; i++, q += 0xC) {
        func_00227870(q, a, b);
    }
}
