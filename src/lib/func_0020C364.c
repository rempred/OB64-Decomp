#include "common/types.h"

/* Whether value is one of 0x20 to 0x23, or 0x67. */
s32 func_0020C364(s32 value)
{
    s32 result = 0;

    if ((u32)(value - 0x20) < 2 || value == 0x22) {
        result = 1;
    } else if (value == 0x23 || value == 0x67) {
        result = 1;
    }
    return result;
}
