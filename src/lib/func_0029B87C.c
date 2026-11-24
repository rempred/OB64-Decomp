typedef unsigned char u8;
typedef signed short s16;
typedef unsigned int u32;
typedef struct {
    void *data;
    s16 h4;
} Grid29;
typedef struct {
    u8 from[3];
    u8 to[3];
    s16 h6;
    s16 h8;
    s16 hA;
} Pair29;
typedef struct {
    u8 unk0000[0x168];
    void *p168[0x38];
    Pair29 *p248[0x5BF];
    void *p1944[0x1C];
    u8 unk19B4[0x94];
    Grid29 *grid;
    u8 unk1A4C[0x168];
    void *p1BB4[20];
} Battle29;
extern Battle29 *D_8022A974;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx29;
extern Gfx29 *gTitleCardDisplayListCursor;
typedef struct {
    u8 kind;
    u8 r;
    u8 g;
    u8 b;
    u8 c[3];
} Tint29;
void func_0029B87C(u8 *u) {
    Tint29 *p = D_8022A974->p1944[u[0xE7]];
    if (p != ((void *)0)) {
        Tint29 *t = p;
        { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000A01); _g->w1 = (0x100000); };
        { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        if (t->kind == 1) {
            { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x104240); };
            {
                Gfx29 *_g = gTitleCardDisplayListCursor++;
                ((u32 *)_g)[0] = 0xFC629603;
                ((u32 *)_g)[1] = 0x2F2D7BFD;
            }
        } else {
            { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x104240); };
            {
                Gfx29 *_g = gTitleCardDisplayListCursor++;
                ((u32 *)_g)[0] = 0xFC2296C3;
                ((u32 *)_g)[1] = 0xF22FFA3D;
            }
        }
        { Gfx29 *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFB000000); _g->w1 = ((t->r << 24) | (t->g << 16) | (t->b << 8) | 1); };
        u[0x142] = t->c[0];
        u[0x143] = t->c[1];
        u[0x144] = t->c[2];
    }
}
