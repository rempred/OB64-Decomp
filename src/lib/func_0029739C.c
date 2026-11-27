#include "game/combat_draw_commands.h"
struct PanelContent;
struct Panel;
#include "game/cutscene_panels.h"
void D_8017C4B4(int);
void D_801793AC(u8 *text, s32 x, s32 y);
void D_8017CBE8(struct Panel *, struct PanelContent *);
void func_002935F8(s16 x, s16 y, u8 a);
void func_0029739C(struct Panel *panel, s32 k) {
        s16 *e = (s16 *)(k * 2 + (s32)panel);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(panel) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(panel) + (0x30)));
        PanelContent *w = panel->content;
        s32 i;
        D_8017C4B4(e[0xC]);
        {
            CombatDrawCommand *_g = D_800E9BA0++;
            _g->first = 0xFA000000;
            _g->second = ((u8 *)e)[0x19] | 0xC8C8C800;
        }
        {
            CombatDrawCommand *_g = D_800E9BA0++;
            _g->first = 0xFC11FE23;
            _g->second = 0xFFFFF3F9;
        }
        for (i = 0; i < w->field5F4; i++) {
            s32 j = w->field5F1 + i;
            if (j < w->field5F5) {
                s32 dy = i * w->field5F6;
                dy += 2;
                D_801793AC(panel->content->rows[j], x + 0x2B, y + dy);
            }
        }
        func_002935F8(x, y, ((u8 *)panel)[k * 2 + 0x19]);
        D_8017CBE8(panel, w);
    }
}
