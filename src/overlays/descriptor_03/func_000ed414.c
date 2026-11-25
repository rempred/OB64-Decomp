typedef unsigned char u8;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
u8 func_000ed414(u8 mode, f32 y) {
    if ((y >= 350.0f) | (y <= 9.0f) || (y >= 170.0f) & (y <= 189.0f)) {
        if (mode != 1) {
            Gfx *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xFCFFFFFF;
            g->w1 = 0xFFFDF6FB;
            mode = 1;
        }
    } else if (mode != 2) {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFCFFFFFF;
        g->w1 = 0xFFFE773B;
        mode = 2;
    }
    return mode;
}
