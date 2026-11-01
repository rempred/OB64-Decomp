#include "common/types.h"

typedef s32 (*Func0024BCE8Callback)(u8 value);
extern Func0024BCE8Callback g_func_0024BCE8_callbacks[];

s16 func_0024BCE8(u8 value)
{
    s32 index;

    if (value < 20) {
        index = 0;
    } else if ((u8)(value - 20) < 27) {
        index = 1;
    } else {
        /* Direct constant selection changes KMC's branch lowering.
         * Keep the range flag separate from the final table index. */
        s32 valid = (u8)(value - 47) < 40;

        if (valid) {
            index = 2;
        } else {
            index = valid | 255;
        }
    }
    return g_func_0024BCE8_callbacks[index](value) >= 0;
}
