#include "common/types.h"

typedef void (*TitleSceneCallback)(s32 slot);

extern u8 D_800E7A32;
extern u8 D_800E7A33;
extern TitleSceneCallback D_800E7A44;
extern TitleSceneCallback D_800E7A48;
extern TitleSceneCallback D_800E7A4C;
extern u16 D_800E7A50;
extern void *D_800E7A54;
extern u8 D_800E91D0[];

extern void func_00281FA8(s32 slot);
extern void func_00282004(s32 slot);
extern void func_00282094(s32 slot);
extern void func_0028A310(void);
extern void bzero(void *buffer, s32 size);

void func_00281F10(s32 slot)
{
    u8 flags32 = D_800E7A32;
    u8 flags33 = D_800E7A33;

    D_800E7A44 = func_00281FA8;
    D_800E7A48 = func_00282004;
    D_800E7A4C = func_00282094;
    D_800E7A50 = 0x5C;
    D_800E7A54 = 0;
    D_800E7A33 = flags33 | 1;
    D_800E7A32 = flags32 | 9;
    bzero(D_800E91D0, 0x5C);
    func_0028A310();
}
