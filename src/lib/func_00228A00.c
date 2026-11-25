typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_00226D18(u8 *p, s32 a, s32 b);
void func_00228A00(u8 *p, s32 a, s32 b) {
    Gfx *g = gTitleCardDisplayListCursor++;
    g->w0 = 0xFA000000;
    g->w1 = 0xFF0000FF;
    func_00226D18(p + 0x26, a, b);
}
