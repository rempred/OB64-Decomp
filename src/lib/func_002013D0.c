#include "game/formation_panel.h"

extern void * volatile D_801CE8C0;
extern u8 D_801976DC;
extern u8 D_801976E8;

void func_00201108(void);

void func_002013D0(void)
{
    func_00201108();
    func_00209774(0, (u8 *)D_801CE8C0 + 0x82F, D_801976DC);
    func_00209774(1, (u8 *)D_801CE8C0 + 0x848, D_801976E8);
}
