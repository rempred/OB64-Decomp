#include "game/cutscene_panels.h"

typedef struct { u32 w0; u32 w1; } ShopGfx;

extern u32 *volatile D_800E9BA0;
extern void func_8017C4B4(s32 value);
extern void func_80179034(void *text, s32 x, s32 y);

void func_0019A1AC(Panel *window, s32 slot)
{
    s32 x, y, row;
    u8 *data;
    ShopGfx *command;
    s32 value;
    u32 sync = 0xE7000000;

    /* Retail consumes the slot word, then reuses its address value. */
    u32 slot_word = ((u32)slot << 1) + (u32)window;
    if (*(s16 *)(slot_word + 0x18) == 0) {
        return;
    }
    x = *(volatile s32 *)&window->field2C;
    y = *(volatile s32 *)&window->field30;
    /* Only the captured setup read requires this ordered access. */
    data = (u8 *)*(PanelContent *volatile *)&window->content;
    command = (ShopGfx *)D_800E9BA0;
    command->w0 = sync;
    command->w1 = 0;
    value = *(s16 *)(slot_word + 0x18);
    D_800E9BA0 = (u32 *)(command + 1);
    row = 0;
    func_8017C4B4(value);

    for (; row < (s32)data[0x5F4]; row++) {
        s32 index = data[0x5F1] + row;
        if (index < (s32)data[0x5F5]) {
            s32 height = row * data[0x5F6] + 5;
            /* Retail reloads the pointer here, but retains captured limits. */
            u8 *current_data = (u8 *)window->content;
            func_80179034(((void **)(current_data + 0x530))[index],
                         x + 6, y + height);
        }
    }
}
