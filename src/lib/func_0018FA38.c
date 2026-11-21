#include "game/panel_constructor.h"

extern void *D_8021B170;
void func_0018FB30(Panel *panel, s32 page);
void func_0018FA38(void) {
    if (D_8021B170 == ((void *)0)) {
        D_8021B170 =
            D_8017BFB0(0, 0, func_0018FB30, 0x18, 0x14, 0x20, 0x1C, 0x18, 0x14, 0x9A, 0x40);
    }
}
