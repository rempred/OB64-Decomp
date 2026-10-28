#include "common/types.h"

void func_0025FD90(s16 frame, s16 *record, s16 *output)
{
    s32 i;

    if (frame < record[0]) {
        for (i = 0; i < 4; i++) {
            s32 initial = record[i + 5];
            output[i] = initial + (record[i + 1] - initial) * frame / record[0];
        }
    } else {
        for (i = 0; i < 4; i++) {
            output[i] = record[i + 1];
        }
    }
}
