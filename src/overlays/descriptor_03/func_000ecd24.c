typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern s16 D_800E7A36;
extern s16 D_800E7A38;
extern s16 D_800E7A3A;
extern s16 D_800E7A3C;
extern volatile u8 D_8018F480;
extern Gfx D_80186BD0[];
extern Gfx D_80186D90[];
void D_801768D4(s32 w, s32 h, s32 x0, s32 y0, s32 x1, s32 y1);
void D_80197B70(void);
void D_801B06F4(void);
void func_000ed0a0(void);
void func_000ecd24(void);
void func_000ecd24(void) {
    Gfx *g;
    D_801768D4(320, 240, D_800E7A36, D_800E7A38, D_800E7A3A, D_800E7A3C);
    D_8018F480 = 0;
    D_8018F480 = 0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDE000000;
    g->w1 = (u32)D_80186BD0;
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDE000000;
    g->w1 = (u32)D_80186BD0;
    D_80197B70();
    D_801B06F4();
    func_000ed0a0();
    g = gTitleCardDisplayListCursor++;
    g->w0 = 0xDE000000;
    g->w1 = (u32)D_80186D90;
}
