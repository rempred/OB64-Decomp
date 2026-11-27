#include "game/panel_constructor.h"
extern void *D_80219650;
void func_001A838C(Panel *, s32);
void func_001A8318(void) {
    void **p = &D_80219650;
    if (*p == ((void *)0)) {
        *p = D_8017BFB0(0, 0, func_001A838C, 0x18, 0x18, 0x20, 0x20, 0x18, 0x18, 0x128, 0x3C);
    }
}
