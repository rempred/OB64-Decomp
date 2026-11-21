#include "game/panel_constructor.h"

void func_0018D164(Panel *panel, s32 page);
extern s32 D_8021B5A4;
extern s32 D_8021B5B0;
extern void *D_8021B58C;
void func_0018D0E0(void) {
    if (D_8021B5A4 == -1) {
        D_8021B5A4 = D_8021B5B0;
        D_8021B58C = D_8017BFB0(0, 0, func_0018D164, 0x124, 0x18, 0x128, 0x1C, 0xAF, 0x18, 0x128, 0x4A);
    }
}
