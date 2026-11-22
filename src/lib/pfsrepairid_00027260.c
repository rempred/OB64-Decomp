#include "common/os_pfs.h"

int func_00027260(OSPfs *state)
{
    int result;

    if (state->status & 5) {
        result = func_00027a08(state);
        if (result == 0)
            state->status &= ~4;
    } else
        result = 5;
    return result;
}
