#include "game/menu_cursor_stack.h"

extern u8 *D_80196AF8;
u8 D_801D8B58(void);
u8 D_801D8AE0(void);
extern void (*D_801EF1E0[])(void);
void func_000b69a4(void) {
    if (D_801D8B58()) {
        D_80196AF8[0xA0] |= 0x82;
        func_000ae30c((-((*(s16 *)((u8 *)(D_80196AF8) + (0x122))) != 0) & 9) | 8, 0, 0);
    } else if ((*(s16 *)((u8 *)(D_80196AF8) + (0x122))) != 0 && D_801D8AE0()) {
        D_80196AF8[0xA0] |= 0x81;
        (*(s16 *)((u8 *)(D_80196AF8) + (0x120))) = 7;
        func_000ae30c(6, 0x63, 0);
    } else {
        D_801EF1E0[(*(s32 *)((u8 *)(D_80196AF8) + (0x1BD4)))]();
    }
}
