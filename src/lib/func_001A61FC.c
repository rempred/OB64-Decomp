#include "game/panel_constructor.h"
extern void *D_80219678[2];
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
void func_001A61FC(void) {
    void **p = &D_80219678[0];
    if (*p == ((void *)0)) {
        *p = D_8017BFB0(0, 0, func_001A62F4, 0x18, 0x18, 0x1C, 0x1C, 0x18, 0x18, 0x91, 0x4A);
    }
}
