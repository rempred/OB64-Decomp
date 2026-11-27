#include "game/cutscene_panels.h"
#include "game/combat_draw_commands.h"
struct Panel;
void D_8017C4B4(int);
void D_801793AC(u8 *text, s32 x, s32 y);
void func_002935F8(s16 x, s16 y, u8 a);
u8 D_8016CD30(void);
void func_0029779C(struct Panel *panel, s32 k) {
    u8 *o = (u8 *)panel;
    s16 *e = (s16 *)(k * 2 + (s32)o);
    s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
    s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
    if (e[0xC] != 0) {
        u8 *w = (*(u8 * *)((u8 *)(o) + (0xD0)));
        s32 i;
        D_8017C4B4(e[0xC]);
        if (D_8016CD30() == 1) {
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
        }
        for (i = 0; i < w[0x5F5]; i++) {
            u8 *text = panel->content->rows[w[0x5F1] + i];
            s32 dy = i * 17 + 8;
            if (i < 3) {
                do {
                    D_801793AC(text, x + 0x36, y + dy);
                } while (0);
            } else if (i < 7) {
                D_801793AC(text, x + 2, y + dy);
            }
        }
    } else {
        D_8017C4B4(0);
    }
    func_002935F8(x + 10, y + 8, 0xFF);
}
