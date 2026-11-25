typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx133;
extern Gfx133 *gTitleCardDisplayListCursor;
extern u8 D_8018F480;
s32 func_00139D74(void);
void func_001344D4(u8 *img) {
    if (img[2] == 2) {
        if (D_8018F480 < 2) {
            D_8018F480 = 2;
            {
                Gfx133 *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE3001001;
                _g->w1 = 0x8000;
            }
        }
        if (img[1] != 0) {
            Gfx133 *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xFD100000;
            g->w1 = (u32)(img + (func_0013466C(img) + 8));
            {
                Gfx133 *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE8000000;
                _g->w1 = 0;
            }
            {
                Gfx133 *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xF5000100;
                _g->w1 = 0x7000000;
            }
            {
                Gfx133 *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE6000000;
                _g->w1 = 0;
            }
            {
                Gfx133 *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xF0000000;
                _g->w1 = (img[1] << 14) | 0x7000000;
            }
            {
                Gfx133 *_g = gTitleCardDisplayListCursor++;
                _g->w0 = 0xE7000000;
                _g->w1 = 0;
            }
        }
    } else if ((D_8018F480 == 2) | (D_8018F480 == 0)) {
        D_8018F480 = 1;
        {
            Gfx133 *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE3001001;
            _g->w1 = 0;
        }
    }
}
s32 func_00139D74(void);
