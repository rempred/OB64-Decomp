#include "common/types.h"

/* Whether value is one of 0x2D to 0x30. */
s32 func_0020C180(s32 value)
{
    s32 result = 0;

    if ((u32)(value - 0x2D) < 2 || value == 0x2F || value == 0x30) {
        result = 1;
    }
    return result;
}
