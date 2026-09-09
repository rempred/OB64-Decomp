#include "game/combat_types.h"

extern unsigned char *D_801D06D0;

int func_0021062C(int first, int second, int selector)
{
    switch (selector) {
    case 2: {
        int result = 0;
        if ((D_801D06D0[first - 1] & 8) || (D_801D06D0[second - 1] & 8)) result = 1;
        return result;
    }
    case 8: {
        int result = 0;
        if ((D_801D06D0[first - 1] & 4) || (D_801D06D0[second - 1] & 4)) result = 1;
        return result;
    }
    case 4: {
        int result = 0;
        if ((D_801D06D0[first - 1] & 2) || (D_801D06D0[second - 1] & 2)) result = 1;
        return result;
    }
    case 16: {
        int result = 0;
        if ((D_801D06D0[first - 1] & 1) || (D_801D06D0[second - 1] & 1)) result = 1;
        return result;
    }
    default:
        return 0;
    }
}
