#include "game/battle_record_flag.h"

int func_0020BFF8(void *record)
{
    if (record == 0) {
        return 0;
    }

    return (*(unsigned int *)((unsigned char *)record + 0x40) >> 8) & 1;
}
