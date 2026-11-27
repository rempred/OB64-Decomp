#include "game/panel_constructor.h"
extern void *D_8021B448[];
extern void *D_8021B44C;
void func_0019E2E0(Panel *, s32);
void func_001A276C(u8 k) {
    if (k == 0) {
        D_8021B448[0] = D_8017BFB0(0, 0, func_0019E2E0, 0x18, 0x14, 0x20, 0x1C, 0x18, 0x14, 0x9A, 0x40);
    } else {
        D_8021B44C = D_8017BFB0(0, 0, func_0019E2E0, 0x120, 0x14, 0x128, 0x1C, 0xA6, 0x14, 0x128, 0x40);
    }
}
