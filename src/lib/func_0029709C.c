struct PanelContent;
struct Panel;
#include "game/cutscene_panels.h"
struct PanelContent *func_00295A54(struct PanelContent *, int);
void D_8017C4B4(int);
void D_801793AC(u8 *text, s32 x, s32 y);
void func_002B4B88(void);
void D_8017CBE8(struct Panel *, struct PanelContent *);
void func_0029709C(struct Panel *panel, s32 k) {
        s16 *e = (s16 *)(k * 2 + (s32)panel);
    if (e[0xC] != 0) {
        PanelContent *p = panel->content;
        func_00295A54(p, (*(u16 *)((u8 *)(D_8023DE34) + (0x1C))));
        D_8017C4B4(e[0xC]);
        D_801793AC(panel->content->rows[0], (*(s32 *)((u8 *)(panel) + (0x2C))) + 4, (*(s32 *)((u8 *)(panel) + (0x30))) + 4);
        D_8017CBE8(panel, p);
    }
}
