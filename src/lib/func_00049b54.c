#include "game/panel_constructor.h"

void func_00049b54(void *list, u16 a, u8 b, PanelCallback c, s16 x0, s16 y0, s16 x1, s16 y1, s16 x2, s16 y2,
                              s16 x3, s16 y3) {
    Panel *old = D_8018FDC0;
    D_8018FDC0 = list;
    func_00051eb0(a, b, c, x0, y0, x1, y1, x2, y2, x3, y3);
    D_8018FDC0 = old;
}
