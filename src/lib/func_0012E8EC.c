#include "game/unit_record_lookup.h"

typedef unsigned char u8;
typedef signed int s32;

extern u8 D_801969BA[][11];

s32 func_0012E8EC(void *unit)
{
    s32 row_index = func_0012E968(unit);
    s32 count = 0;
    const u8 *cursor = D_801969BA[row_index];
    const u8 *end = cursor + 5;
    /* Retail compares these five-byte row cursors as signed 32-bit addresses. */
    do {
        count += *cursor++ != 0xFF;
    } while ((s32)cursor < (s32)end);
    return count;
}
