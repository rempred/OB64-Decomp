#include "common/types.h"

/* Game flags, one bit per flag, at a fixed address. */
#define GAME_FLAGS ((u8 *)0x80197168)

s32 func_0005c110(s32 flag)
{
    return (GAME_FLAGS[flag / 8] >> (flag % 8)) & 1;
}
