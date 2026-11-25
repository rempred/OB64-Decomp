typedef unsigned char u8;
typedef signed short s16;
typedef unsigned int u32;
extern u8 D_801F0450[];
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq20F;
extern Seq20F *D_801F0550;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx20F;
void func_00242E30(Gfx20F **gp) {
    Gfx20F *g = *gp;
    u8 *img;
    u8 i;
    u8 j;
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xDB060000;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE7000000;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3000A01;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3000800;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xFF10013F;
        _g->w1 = (*(u32 *)((u8 *)(D_801F0550) + (0x64)));
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xED000000;
        _g->w1 = 0x005003C0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3000C00;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3000F00;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3001001;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3000D01;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3001402;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xEC15FD5D;
        _g->w1 = 0x3B78E42A;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3001201;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xFC17FE2F;
        _g->w1 = 0x77FCF87C;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3001700;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE200001C;
        _g->w1 = 0x0F0A4000;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE2001E01;
        _g->w1 = 0;
    }
    {
        Gfx20F *_g = g++;
        _g->w0 = 0xE3001801;
        _g->w1 = 0xC0;
    }
    img = (*(u8 * *)((u8 *)(D_801F0550) + (0x68)));
    for (i = 0; i < (*(s16 *)((u8 *)(D_801F0550) + (0x7A))) / 16; i++) {
        for (j = 0; j < (*(s16 *)((u8 *)(D_801F0550) + (0x78))) / 16; j++) {
            {
                Gfx20F *_g = g++;
                _g->w0 = 0xFD30000F;
                _g->w1 = (u32)img;
            }
            {
                Gfx20F *_g = g++;
                _g->w0 = 0xF5300400;
                _g->w1 = 0x07080200;
            }
            {
                Gfx20F *_g = g++;
                _g->w0 = 0xE6000000;
                _g->w1 = 0;
            }
            {
                Gfx20F *_g = g++;
                _g->w0 = 0xF4000000;
                _g->w1 = 0x0703C03C;
            }
            {
                Gfx20F *_g = g++;
                _g->w0 = 0xDC070002;
                _g->w1 = (u32)&(*(Gfx20F * *)((u8 *)(D_801F0550) + (0x60)))[i * ((*(s16 *)((u8 *)(D_801F0550) + (0x78))) / 16) + j];
            }
            {
                Gfx20F *_g = g++;
                _g->w0 = 0xDA000000;
                _g->w1 = (u32)D_801F0450;
            }
            img += 0x300;
        }
    }
    *gp = g;
}
