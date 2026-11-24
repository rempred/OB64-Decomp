#include "game/cutscene_panels.h"
typedef Panel Node;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_80187020;
void func_000549e8(Node *n, s32 k);
extern u8 D_8018FE10[];
extern u8 D_8018FE14[];
extern void (*D_8018FE18[])(u8 *s, s32 x, s32 y);
void func_000577a0(s32 x, s32 y);
void func_000549e8(Node *n, s32 k) {
    s32 a = (*(s16 *)((u8 *)(n) + (0x18 + k * 2)));
    s32 x;
    s32 y;
    s32 dy;
    if (a != 0) {
        x = (*(s32 *)((u8 *)(n) + (0x2C)));
        y = (*(s32 *)((u8 *)(n) + (0x30)));
        dy = ((*(u8 *)((u8 *)(n) + (0x22))) & 1) * 14 + 4;
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFA000000;
            _g->w1 = a | ~0xFF;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE3000C00;
            _g->w1 = 0;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE3001201;
            _g->w1 = 0;
        }
        if (a == 0xFF) {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x0F0A7008;
        } else {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x504240;
        }
        gTitleCardDisplayListCursor->w0 = 0xFC119623;
        gTitleCardDisplayListCursor->w1 = 0xFF2FFFFF;
        gTitleCardDisplayListCursor++;
        D_8018FE18[D_80187020](D_8018FE10, x + 0x15, y + 2);
        D_8018FE18[D_80187020](D_8018FE14, x + 0x15, y + 0xE);
        func_000577a0(x + 1, y + dy);
    }
}
