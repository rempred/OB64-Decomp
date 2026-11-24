#include "common/types.h"

/* One bit per entry, numbered from 1, at a fixed address. */
#define NUMBERED_FLAGS ((u8 *)0x80196A81)

s32 func_00048abc(s32 number)
{
    s32 bit = (u8)number - 1;

    return (NUMBERED_FLAGS[bit / 8] >> (bit & 7)) & 1;
}
