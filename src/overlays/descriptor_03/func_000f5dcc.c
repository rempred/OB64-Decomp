typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk000[0x5C];
    f32 fov;
    u8 unk060[0x10];
    f32 eye[3];
    f32 at[3];
    f32 up[3];
    u8 unk094[0x70];
    s32 w104;
    u8 unk108[4];
    f32 f10C;
    u8 unk110[0xC];
    void *sky;
    void *tex120;
    u8 unk124[0x2A];
    u8 r;
    u8 g;
    u8 b;
    u8 unk151[0xB];
    f32 f15C;
} Scene0E;
extern Gfx *gTitleCardDisplayListCursor;
extern Scene0E *D_801ABA58;
extern u8 D_8018F56D;
void *func_0000978C();
extern u8 D_8018F520[];
extern s32 D_8018F568;
extern s8 D_8018F56C;
extern u16 D_801AC624[];
void func_000f5dcc(s32 i) {
    s32 f = D_8018F568;
    if ((D_8018F520[(i * 2 + 6) / 8] >> ((i * 2 + 6) & 7)) & 1) {
        if (f >= 34) {
            D_8018F520[(i * 2 + 5) / 8] &= ~(1 << ((i * 2 + 5) & 7));
        }
        if (f >= 66) {
            f = 65;
            D_8018F520[(i * 2 + 6) / 8] &= ~(1 << ((i * 2 + 6) & 7));
            D_8018F56D = 0;
            D_8018F56C = 0;
        }
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(4) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(func_0000978C(0x0203C53E, D_801AC624[f], -0xA)); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(4) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xF3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((((((32) * (32) + 1) >> 1) - 1) < (2047) ? ((((32) * (32) + 1) >> 1) - 1) : (2047)))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((1 << 11) + ((1) > (((32) * (1) / 8)) ? (1) : (((32) * (1) / 8))) - 1) / ((1) > (((32) * (1) / 8)) ? (1) : (((32) * (1) / 8))))) & ((0x01 << (12)) - 1)) << (0)))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(4) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(1) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((32) * 1) + 7) >> 3) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(5) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(((32) - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0x97) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((u8)(D_801ABA58->f15C * 255.0f)) & ((0x01 << (8)) - 1)) << (0)))); };
    }
}
