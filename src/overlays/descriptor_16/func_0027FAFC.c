typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk00[0x18];
    s32 *w18;
    s16 h1C;
    s16 h1E;
    u8 *w20;
    u8 *w24;
    s16 h28;
} Obj27;
extern Gfx *gTitleCardDisplayListCursor;
extern Obj27 *D_8022CB20;
extern u8 D_8022CAB8[];
extern s16 D_8022CB2A;
extern u8 D_8022CAB8[];
extern u8 D_8022CAB8[];
extern s16 D_8022CB2A;
extern s16 D_8022CB2A;
extern s16 D_8022CB64[2][8];
u8 *D_8017BFB0(s32 a, s32 b, void *fn, s32 x0, s32 y0, s32 x1, s32 y1, s32 x2, s32 y2, s32 x3, s32 y3);
void func_00280410(void);
void func_0027FAFC(s16 mode) {
    Obj27 *o = D_8022CB20;
    D_8022CB2A = 1;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8022CAB8); };
    if (mode == 0) {
        o->w24 = D_8017BFB0(4, 0, func_00280410, D_8022CB64[0][0], D_8022CB64[0][1],
                               D_8022CB64[0][2], D_8022CB64[0][3], D_8022CB64[0][4],
                               D_8022CB64[0][5], D_8022CB64[0][6], D_8022CB64[0][7]);
    } else if (mode == 1) {
        o->w24 = D_8017BFB0(4, 0, func_00280410, D_8022CB64[1][0], D_8022CB64[1][1],
                               D_8022CB64[1][2], D_8022CB64[1][3], D_8022CB64[1][4],
                               D_8022CB64[1][5], D_8022CB64[1][6], D_8022CB64[1][7]);
    }
}
void func_00280410(void);
