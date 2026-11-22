#include "game/class_sprite.h"
#include "game/cutscene_panel_resource.h"
#include "game/cutscene_panels.h"

void *func_00001330(u32 size);
void *func_000016C4(void *p);
void bzero(void *p, s32 n);
extern u8 D_800EB0B0[];
void *D_8009DBB8(void *dst, u32 handle);
void *D_8009DD38(u32 handle);
void D_800EA6B0();
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
void func_0028ad2c(void) {
    u8 *raw;
    D_8023DE34 = func_00001330(sizeof(PanelParameters));
    bzero(D_8023DE34, sizeof(PanelParameters));
    raw = D_8009DBB8(((void *)0), 0x1890C90);
    D_8023DE34->field14 = D_8009DD38(*(u32 *)(raw + 0x4C));
    func_000016C4(raw);
    D_8023DE34->field10 = D_8016FBE0(0x7D, 0, &D_8023DE34->field00);
    D_8023DE34->field08 = func_00291130(&D_8023DE34->field04);
    D_8023DE34->field0C = D_8009DD38(0x1885534);
    D_800EA6B0(D_800EB0B0, 7, 5);
}
