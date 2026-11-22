#include "common/os_pfs.h"

typedef struct {
    unsigned int field00;
    unsigned short field04;
    unsigned char field06[26];
} DirectoryEntry;

extern int func_00027fd0(void *queue, int channel, unsigned short address,
                         unsigned char *data);
extern int func_000272c0(void *queue, int channel);

int func_00026e90(OSPfs *state, int *maxFiles, int *usedFiles)
{
    DirectoryEntry entry;
    int result;
    int used = 0;
    int i;

    if (!(state->status & 1))
        return 5;
    result = func_00027bd4(state);
    if (result != 0)
        return result;
    if (state->activebank != 0) {
        result = func_000274d0(state, 0);
        if (result != 0)
            return result;
    }
    for (i = 0; i < state->dir_size; i++) {
        result = func_00027fd0(state->queue, state->channel,
                              (unsigned short)((unsigned int)state->dir_table + i),
                              (unsigned char *)&entry);
        if (result != 0)
            return result;
        if (entry.field04 != 0 && entry.field00 != 0)
            used++;
    }
    *usedFiles = used;
    *maxFiles = state->dir_size;
    return func_000272c0(state->queue, state->channel);
}
