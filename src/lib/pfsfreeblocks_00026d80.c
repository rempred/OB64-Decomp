#include "common/os_pfs.h"


int func_00026d80(OSPfs *state, int *freeBytes)
{
    unsigned short table[128];
    int result;
    int count = 0;
    unsigned char bank;
    int block;
    int start;

    if (!(state->status & 1))
        return 5;
    result = func_00027bd4(state);
    if (result != 0)
        return result;
    for (bank = 0; bank < state->banks; bank++) {
        result = func_00027c8c(state, table, 0, bank);
        if (result != 0)
            return result;
        start = bank == 0 ? state->inode_start_page : 1;
        for (block = start; block < 128; block++) {
            if (table[block] == 3)
                count++;
        }
    }
    *freeBytes = count << 8;
    return 0;
}
