#include "game/panel_constructor.h"

extern void *D_8021B588;
void func_0018D164(Panel *panel, s32 page);
void func_0018D06C(void) {
    void **p = &D_8021B588;
    if (*p == ((void *)0)) {
        *p = D_8017BFB0(0, 0, func_0018D164, 0x18, 0x18, 0x1C, 0x1C, 0x18, 0x18, 0x91, 0x4A);
    }
}
