#include "game/cutscene_panels.h"
typedef Panel Win514;
Win514 *func_0005219c(Win514 *w, s16 x0, s16 y0, s16 x1, s16 y1) {
    w->field2C = x0;
    w->field3C = x0;
    w->field30 = y0;
    w->field40 = y0;
    w->field34 = x1;
    w->field44 = x1;
    w->field18 = 0xFF;
    w->field28 = 0;
    w->field26 = 0x8004;
    w->field38 = y1;
    w->field48 = y1;
    return w;
}
