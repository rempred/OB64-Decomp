#include "game/cutscene_panel_resource.h"
#include "game/chapter_card.h"

u8 *D_80227A18(s32 id, s32 n);
u8 *func_00291130(u8 **payload_end) {
    u8 *t = D_80227A18(0x18855FE, 8);
    *payload_end = t + ((u32)func_0028ac88(t[3], *(u16 *)(t + 4)) * *(u16 *)(t + 6) + 8);
    return t;
}
