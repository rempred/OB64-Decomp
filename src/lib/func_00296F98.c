#include "game/cutscene_panels.h"
struct Panel;
void func_00294E04(void *p);
void D_8017C4B4(int);
void D_801793AC(u8 *text, s32 x, s32 y);
void func_00291194(s32 k, u8 *o);
void func_00291194(s32 a, u8 *o);
void func_00296F98(struct Panel *panel, s32 k) {
    u8 *o = (u8 *)panel;
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        func_00294E04((*(void * *)((u8 *)(o) + (0xD0))));
        D_8017C4B4(e[0xC]);
        D_801793AC(panel->content->rows[0], (*(s32 *)((u8 *)(o) + (0x2C))) + 4, (*(s32 *)((u8 *)(o) + (0x30))) + 4);
        func_00291194(1, o);
    }
}
