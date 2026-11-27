#include "game/cutscene_panels.h"
struct Panel;
void D_8017C4B4(int);
void D_801793AC(u8 *text, s32 x, s32 y);
void func_0029712C(struct Panel *panel, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)panel);
    s32 i;
    if (e[0xC] != 0) {
        D_8017C4B4(e[0xC]);
        for (i = 0; i < 2; i++) {
            D_801793AC(panel->content->rows[i], panel->field2C + 4, panel->field30 + 6 + i * 0x11);
        }
    }
}
