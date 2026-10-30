#include "common/types.h"

extern s32 (*D_80209700[])(u8);
extern u32 D_8020A2D4;
extern void *D_80209770[];
extern u16 D_801CEF10[];
extern void func_00208DC8(void *, s32);

void func_0024E8DC(u8 index, s32 value)
{
    s32 invalidKind = 0xFF;
    s32 kind;
    u32 complemented;

    if (index < 20) {
        kind = 0;
    } else if ((u8)(index - 20) < 27) {
        kind = 1;
    } else if ((u8)(index - 47) < 40) {
        kind = 2;
    } else {
        /* The real default value is kept separate from the range selection. */
        kind = invalidKind;
    }
    complemented = ~D_80209700[kind](index);
    value = value * 2 + (complemented >> 31);
    func_00208DC8(D_80209770[D_8020A2D4], D_801CEF10[value]);
    if (++D_8020A2D4 >= 2) {
        D_8020A2D4 = 0;
    }
}
