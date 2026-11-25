typedef unsigned char u8;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_80196AF8;
typedef struct {
    u32 c[4][4];
} Pal87;
extern Pal87 D_801EF8A8;
void func_00088024(u8 k) {
    Pal87 t = D_801EF8A8;
    if (k < 3) {
        Gfx *g = gTitleCardDisplayListCursor++;
        u8 v;
        g->w0 = 0xFA000000;
        v = D_80196AF8[k * 32 + 0x147];
        g->w1 = (v << 24) | (v << 16) | (v << 8) | 0xFF;
    } else if (D_80196AF8[0x5E6] != 0) {
        Gfx *g = gTitleCardDisplayListCursor++;
        u8 v;
        g->w0 = 0xFA000000;
        v = D_80196AF8[0x5E6];
        g->w1 = (v << 24) | (v << 16) | (v << 8) | 0xFF;
    } else {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFA000000;
        g->w1 = ((u8)t.c[k - 3][0] << 24) | ((u8)t.c[k - 3][1] << 16) | ((u8)t.c[k - 3][2] << 8) | (u8)t.c[k - 3][3];
    }
}
