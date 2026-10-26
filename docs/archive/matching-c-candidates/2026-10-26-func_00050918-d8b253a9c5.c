#include "common/types.h"

extern u8 D_8018FC6C;
extern int func_00051400(u8 **cursor);
extern int func_00050620(u8 **cursor);

void func_00050918(u8 *input, u8 *output)
{
    int saved = D_8018FC6C;
    u8 *cursor = input;
    int value;

    if (saved == 1) {
        D_8018FC6C = 0;
    }
    while (*cursor != 0) {
        if (*cursor == '{') {
            cursor++;
            *output++ = func_00051400(&cursor) - 1;
            cursor++;
        } else {
            value = (short)func_00050620(&cursor);
            if (value < 0) {
                *output = 0x30;
            } else {
                *output = value;
            }
            output++;
        }
    }
    *output = 0xFF;
    D_8018FC6C = saved;
}
