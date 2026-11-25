typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
struct Phase8PackedFields;
struct ListMenu;
void func_000E5780(u8 *p);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_8018F480;
void func_000ba790(struct ListMenu *);
void func_000E5780(u8 *img) {
    if (img[2] == 2) {
        if (D_8018F480 < 2) {
            D_8018F480 = 2;
            {
                Gfx *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE3001001;
                _g->w1 = 0x8000;
            }
        }
        if (img[1] != 0) {
            Gfx *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xFD100000;
            g->w1 = (u32)(img + (func_000E5938(img) + 8));
            {
                Gfx *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE8000000;
                _g->w1 = 0;
            }
            {
                Gfx *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xF5000100;
                _g->w1 = 0x7000000;
            }
            {
                Gfx *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE6000000;
                _g->w1 = 0;
            }
            {
                Gfx *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xF0000000;
                _g->w1 = (img[1] << 14) | 0x7000000;
            }
            {
                Gfx *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE7000000;
                _g->w1 = 0;
            }
        }
    } else if ((D_8018F480 == 2) | (D_8018F480 == 0)) {
        D_8018F480 = 1;
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE3001001;
            _g->w1 = 0;
        }
    }
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xE7000000;
        _g->w1 = 0;
    }
}
void func_000ba790(struct ListMenu *);
