typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
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
extern s32 D_80197178;
extern u8 D_8022AB48[];
void memcpy_aligned(s32 dst, void *src, s32 n);
void func_0029B660(void) {
    Grid29 *g = D_8022A974->grid;
    s32 v;
    s32 i;
    if (g == ((void *)0)) {
        return;
    }
    memcpy_aligned(D_80197178, g->data, 0x3A0);
    v = D_80197178;
    {
        Gfx29 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDE000000;
        _g->w1 = (u32)D_8022AB48;
    }
    for (i = 0; i < 4; i++) {
        {
            Gfx29 *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0x01004008;
            _g->w1 = v;
        }
        v += 0x20;
        {
            Gfx29 *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0x06000206;
            _g->w1 = 0x604;
        }
    }
    v = D_80197178;
    {
        Gfx29 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0x01008010;
        _g->w1 = v;
    }
    {
        Gfx29 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0x06000408;
        _g->w1 = 0x80C;
    }
    {
        Gfx29 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE7000000;
        _g->w1 = 0;
    }
    D_80197178 += 0x3A0;
}
