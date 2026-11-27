#include "game/panel_constructor.h"
extern void *D_80219678[2];
extern s32 D_80219630;
extern s32 D_80219660;
typedef struct {
    u8 unk00[0x18];
    s16 fade[2];
    u8 unk1C[0x10];
    s32 x;
    s32 y;
    u8 unk34[0x48];
    s32 rect[4];
} Win18C;
void func_001A62F4(Panel *, s32);
void func_001A6270(void) {
    if (D_80219630 == -1) {
        D_80219630 = D_80219660;
        D_80219678[1] = D_8017BFB0(0, 0, func_001A62F4, 0x124, 0x18, 0x128, 0x1C, 0xAF, 0x18, 0x128, 0x4A);
    }
}
