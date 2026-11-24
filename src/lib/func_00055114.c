#include "game/cutscene_panels.h"
typedef Panel Node;
Node *func_00051f74(u16 kind, u8 b, PanelCallback fn, s16 x, s16 y, s16 w, s16 h);
void func_000566f4(Node *n, u32 a);
void func_00054b84(Node *n, s32 k);
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
void func_00054b84(Node *n, s32 k);
Node *func_00055114(s32 a, u16 kind, s32 c, s32 d, s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2,
                              s16 h2) {
    Node *n = Box514(kind | 0x1000, func_00054b84, x, y, w, h, x2, y2, w2, h2);
    func_000566f4(n, a | 0x20000);
    (*(u8 *)((u8 *)(n) + (0x23))) = c;
    (*(u8 *)((u8 *)(n) + (0x22))) = c;
    (*(u8 *)((u8 *)(n) + (0x24))) = d;
    return n;
}
