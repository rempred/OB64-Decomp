typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct Fade {
    f32 cur;
    f32 start;
    f32 end;
    u8 dir;
    f32 step;
    s32 r;
    s32 g;
    s32 b;
} Fade;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
void emit_rdp_setup_displaylist(Gfx **pp, Fade *f) {
    Gfx *g = *pp;
    { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(g++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (20) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)(0); };
    { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    {
        Gfx *_g = g++;
        _g->w0 = 0xD9000000;
        _g->w1 = 0;
    }
    { Gfx *_g = (Gfx *)(g++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(f->r) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(f->g) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(f->b) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((u32)f->cur) & ((0x01 << (8)) - 1)) << (0)))); };
    {
        Gfx *_g = g++;
        _g->w0 = 0xFCFFFFFF;
        _g->w1 = 0xFFFDF6FB;
    }
    {
        Gfx *_g = g++;
        _g->w0 = 0xE200001C;
        _g->w1 = 0x005041C8;
    }
    { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(g++); _g->w0 = (((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(319 << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(239 << 2) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (0))))); }; };
    { Gfx *_g = (Gfx *)(g++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    *pp = g;
}
