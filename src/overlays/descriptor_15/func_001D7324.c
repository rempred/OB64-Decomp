typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801B81B0;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_001D6148(u8 *o, s32 a, s32 b, s32 c);
extern inline u8 *Panel1D4(u32 i) {
    u8 *r = ((void *)0);
    if (i < 13) {
        u8 *e = D_801B81B0 + i * 0x90;
        r = (u8 *)((s32)e & -((*(s32 *)((u8 *)(e) + (0x4C))) != 0));
    }
    return r;
}
void func_001D7324(void) {
    Gfx *g;
    s32 i;
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
    g->w0 = 0xE3001001;
    g->w1 = 0;
    for (i = 0; i < 6; i++) {
        u8 *o = Panel1D4(i);
        if (o != ((void *)0)) {
            func_001D6148(o, 1, 0, 0);
        }
    }
}
