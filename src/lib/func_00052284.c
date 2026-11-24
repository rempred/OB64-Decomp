#include "game/cutscene_panels.h"
extern u8 D_80187020;
typedef Panel Win514;
void func_00052284(Win514 *w) {
    s32 cx;
    s32 cy;
    s32 c;
    s32 d0;
    s32 d1;
    s32 lo;
    s32 hi;
    cx = D_80187020 ? 320 : 160;
    cy = D_80187020 ? 240 : 120;
    if (w->field2C == w->field4C && w->field30 == w->field50 && w->field34 == w->field54 && w->field38 == w->field58) {
        c = cx;
        lo = w->field2C;
        hi = w->field34;
        d0 = lo - c;
        if (d0 < 0) {
            d0 = -d0;
        }
        d1 = hi - c;
        if (d1 < 0) {
            d1 = -d1;
        }
        if (d1 < d0) {
            w->field3C = w->field2C;
            w->field44 = w->field2C + 8;
        } else {
            w->field3C = w->field34 - 8;
            w->field44 = w->field34;
        }
        c = cy;
        lo = w->field30;
        hi = w->field38;
        d0 = lo - c;
        if (d0 < 0) {
            d0 = -d0;
        }
        d1 = hi - c;
        if (d1 < 0) {
            d1 = -d1;
        }
        if (d1 < d0) {
            w->field40 = w->field30;
            w->field48 = w->field30 + 8;
        } else {
            w->field40 = w->field38 - 8;
            w->field48 = w->field38;
        }
    } else {
        w->field3C = w->field4C;
        w->field40 = w->field50;
        w->field44 = w->field54;
        w->field48 = w->field58;
    }
    w->field28 = 2;
    w->field26 = 0x8000;
}
