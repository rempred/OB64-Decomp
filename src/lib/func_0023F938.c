typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
typedef struct {
    s16 x;
    s16 y;
    s16 z;
    u8 pad6[6];
    s8 nx;
    s8 ny;
    s8 nz;
    u8 a;
} Vtx23;
extern Vtx23 *D_80197178;
void func_0023F938(s16 a, s16 b, s16 c) {
    Vtx23 *v = D_80197178;
    s32 i;
    for (i = 0; i < 16; i++) {
        bzero(D_80197178, 0x10);
        if ((u32)(i % 4) >= 2) {
            D_80197178->x = 0;
        } else {
            D_80197178->x = -a;
        }
        if (i == 0 || i == 3 || (u32)(i - 4) < 4 || (u32)(i - 13) < 2) {
            D_80197178->y = b;
        } else {
            D_80197178->y = -b;
        }
        if ((u32)i < 4 || (u32)(i - 5) < 2 || i == 8 || i == 11) {
            D_80197178->z = c;
        } else {
            D_80197178->z = -c;
        }
        if ((u32)i < 4) {
            D_80197178->nz = 0x7F;
        } else if ((u32)(i - 4) < 4) {
            D_80197178->ny = 0x7F;
        } else if ((u32)(i - 8) < 4) {
            D_80197178->ny = -0x7F;
        } else {
            D_80197178->nz = -0x7F;
        }
        D_80197178->a = 0xFF;
        D_80197178++;
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0x01010020;
        _g->w1 = (u32)v;
    }
    for (i = 0; i < 16; i += 4) {
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = ((unsigned int)(((unsigned int)(6) & ((0x01 << (8)) - 1)) << (24))) | (((unsigned int)(((unsigned int)(i * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((i + 1) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((i + 2) * 2) & ((0x01 << (8)) - 1)) << (0))));
            _g->w1 = ((unsigned int)(((unsigned int)(i * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((i + 2) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((i + 3) * 2) & ((0x01 << (8)) - 1)) << (0)));
        }
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    }
}
void func_0023F938(s16 a, s16 b, s16 c);
