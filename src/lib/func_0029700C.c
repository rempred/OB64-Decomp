struct Panel;
struct PanelContent;
#include "game/cutscene_panels.h"
void D_8017C4B4(int);
void D_801793AC(u8 *text, s32 x, s32 y);
struct PanelContent * func_002952D4(struct PanelContent *, s32);
void D_8017CBE8(struct Panel *, struct PanelContent *);
void func_0029700C(struct Panel *panel, s32 k) {
        s16 *e = (s16 *)(k * 2 + (s32)panel);
    if (e[0xC] != 0) {
        PanelContent *p = panel->content;
        func_002952D4(p, (*(u16 *)((u8 *)(D_8023DE34) + (0x1A))));
        D_8017C4B4(e[0xC]);
        D_801793AC(panel->content->rows[0], (*(s32 *)((u8 *)(panel) + (0x2C))) + 4, (*(s32 *)((u8 *)(panel) + (0x30))) + 4);
        D_8017CBE8(panel, p);
    }
}
