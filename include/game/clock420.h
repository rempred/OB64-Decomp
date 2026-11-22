#ifndef OB64_GAME_CLOCK420_H
#define OB64_GAME_CLOCK420_H

#include "common/types.h"

typedef struct Clock420 {
    u16 hours;
    u8 minutes;
    u8 seconds;
} Clock420;

void func_00042a44(Clock420 *clock);
void D_8016CB44(Clock420 *clock);
#endif
