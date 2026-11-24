#include "game/cutscene_panels.h"
Panel *func_00051f74(u16 kind, u8 b, PanelCallback fn, s16 x, s16 y, s16 w, s16 h);
void func_000566f4(Panel *n, s32 a);
void func_00052484(Panel *panel, s32 index);
/* C89 promotes these narrow parameters to int at the call boundary.
 * KMC needs their declared widths here to retain the retail stack loads
 * and conversions; an ANSI int prototype changes their scheduling. */
void func_00054e24(a, kind, x, y, w, h, x2, y2, w2, h2)
s32 a;
u16 kind;
s16 x, y, w, h, x2, y2, w2, h2; {
    Panel *n = func_00051f74(kind | 0x100, 0, func_00052484, x, y, w, h);
    (*(s16 *)((u8 *)(n) + (0x18))) = 0;
    (*(s32 *)((u8 *)(n) + (0x3C))) = x2;
    (*(s32 *)((u8 *)(n) + (0x40))) = y2;
    (*(s32 *)((u8 *)(n) + (0x44))) = w2;
    (*(s32 *)((u8 *)(n) + (0x48))) = h2;
    (*(s16 *)((u8 *)(n) + (0x28))) = 1;
    (*(u16 *)((u8 *)(n) + (0x26))) = 0x8000;
    func_000566f4(n, a);
}
