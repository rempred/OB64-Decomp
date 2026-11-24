#include "game/cutscene_panels.h"
typedef Panel Node;
Node *func_00051f74(u16 kind, u8 b, PanelCallback fn, s16 x, s16 y, s16 w, s16 h);

void func_000549e8(Node *n, s32 k);
extern inline Node *Box514(u16 kind, PanelCallback fn, s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2) {
    Node *n = func_00051f74(kind, 0, fn, x, y, w, h);
    (*(s16 *)((u8 *)(n) + (0x18))) = 0;
    (*(s32 *)((u8 *)(n) + (0x3C))) = x2;
    (*(s32 *)((u8 *)(n) + (0x40))) = y2;
    (*(s32 *)((u8 *)(n) + (0x44))) = w2;
    (*(s32 *)((u8 *)(n) + (0x48))) = h2;
    (*(s16 *)((u8 *)(n) + (0x28))) = 1;
    (*(u16 *)((u8 *)(n) + (0x26))) = 0x8000;
    return n;
}
void func_00055014(Node *o) {
    s32 x = (*(s32 *)((u8 *)(o) + (0x44)));
    s32 y = (*(s32 *)((u8 *)(o) + (0x48)));
    s16 bottom = y + 0x10;
    Node *n = Box514(4, func_000549e8, x - 12, y - 8, x - 4, y + 8, x - 0x3E, y - 0x10, x - 4, bottom);
    (*(u8 *)((u8 *)(n) + (0x22))) = (*(u8 *)((u8 *)(o) + (0x22)));
    (*(u8 *)((u8 *)(n) + (0x23))) = (*(u8 *)((u8 *)(o) + (0x22)));
    (*(u8 *)((u8 *)(n) + (0x24))) = 1;
    (*(u8 *)((u8 *)(n) + (0x25))) = 2;
}
