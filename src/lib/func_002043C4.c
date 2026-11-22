#include "common/types.h"

extern void *func_002043E0(void *input, u32 index, u16 *table, u8 *value_out, u32 options);

void *func_002043C4(void *input, u32 index, u16 *table, u8 *value_out)
{
    return func_002043E0(input, index, table, value_out, 0);
}
