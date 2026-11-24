#include "game/task27_object.h"

typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 D_8022CAB8[];
extern s16 D_8022CB2A;
extern s16 D_8022CB64[2][8];

void func_00280410(Panel *panel, int selector);
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
void func_00280410(Panel *panel, int selector);
