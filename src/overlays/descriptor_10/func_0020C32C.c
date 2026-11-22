#include "game/battle_record_flag.h"

inline int func_0020C32C(void *record)
{
    if (record == 0) {
        return 0;
    }
    return (*(const unsigned int *)((const unsigned char *)record + 0x40) >> 1) & 1;
}
