typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef double f64;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern f32 *D_8018F58C;
extern u8 D_80214C7C;
extern u8 D_80212518[];
extern u8 D_80212410[];
extern u8 D_80213648[];
void func_001520E0(void *img, void *pal, s32 w, s32 h, s32 fmt);
void func_00151F40(s32 x, s32 y, s32 k);
extern f64 D_80214E48;
void func_0015F694(s32 x, s32 y) {
    u8 c;
    s32 b;
    f32 h = *D_8018F58C;
    D_80214C7C = (D_80214C7C + 1) & 7;
    if (h < D_80214E48) {
        y -= 6;
    }
    c = D_80214C7C;
    if (c < 4) {
        b = c;
    } else {
        b = 7 - c;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFA000000;
        g->w1 = -1;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_80213648;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE3000C00;
        g->w1 = 0;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE200001C;
        g->w1 = 0x504240;
    }
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xFC119623;
        g->w1 = 0xFF2FFFFF;
    }
    func_001520E0(D_80212518, D_80212410, 16, 32, 2);
    func_00151F40(x, y + b + 8, 0x3F);
    {
        Gfx *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xE7000000;
        g->w1 = 0;
    }
}
