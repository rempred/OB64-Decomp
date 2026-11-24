#include "common/types.h"

#define STATE_8018F481 (*(u8 *)0x8018F481)

/* Whether the state byte is one of 0x3F to 0x42. */
s32 func_00130794(void)
{
    u8 state = STATE_8018F481;
    s32 result = (state == 0x3F || state == 0x41);

    if (state == 0x40 || state == 0x42) {
        result = 1;
    }
    return result;
}
