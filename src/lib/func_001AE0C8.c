typedef signed int s32;
extern s32 D_801EB290;
extern s32 D_801EB294;
extern s32 D_801EB298;
extern s32 D_801EB29C;
extern s32 D_801EB2A0;
extern s32 D_801EB2A4;
extern s32 D_801EB2A8;
void D_80079618(unsigned int, ...);
void func_001AE0C8(void) {
    s32 *p = &D_801EB290;
    if (*p != 0) {
        D_80079618(0x218E9B4, 0x14, -0x11);
        *p = 0;
        D_801EB294 = 0;
        D_801EB298 = 0;
        D_801EB29C = 0;
        D_801EB2A0 = 0;
        D_801EB2A4 = 0;
        D_801EB2A8 = 0;
    }
}
