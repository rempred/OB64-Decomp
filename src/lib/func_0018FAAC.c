#include "game/panel_constructor.h"

void func_0018FB30(Panel *panel, s32 page);
extern void *D_8021B174;
extern s32 D_8021B2AC;
extern void *D_8021B174;
extern s32 D_8021B2AC;
extern s32 D_8021B2B4;
void func_0018FAAC(void) {
    if (D_8021B2AC == -1) {
        D_8021B2AC = D_8021B2B4;
        D_8021B174 = D_8017BFB0(0, 0, func_0018FB30, 0x120, 0x14, 0x128, 0x1C, 0xA6, 0x14, 0x128, 0x40);
    }
}
