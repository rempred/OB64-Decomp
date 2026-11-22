#include "common/os_pfs.h"

typedef struct {
    unsigned int field00;
    unsigned short field04;
    unsigned short field06;
    unsigned char field08[4];
    unsigned char field0c[4];
    unsigned char field10[16];
} DirectoryEntry;

extern int func_00027fd0(void *queue, int channel, unsigned short address,
                         unsigned char *data);
extern int func_000272c0(void *queue, int channel);

int func_00026bc0(OSPfs *state, unsigned short company,
                  unsigned int game, const unsigned char *name,
                  const unsigned char *extension, int *file)
{
    DirectoryEntry entry;
    int result;
    int i;
    int j;
    int different;

    if (!(state->status & 1))
        return 5;
    result = func_00027bd4(state);
    if (result != 0)
        return result;
    for (i = 0; i < state->dir_size; i++) {
        result = func_00027fd0(state->queue, state->channel,
                              (unsigned short)((unsigned int)state->dir_table + i),
                              (unsigned char *)&entry);
        if (result != 0)
            return result;
        result = func_000272c0(state->queue, state->channel);
        if (result != 0)
            return result;
        if (entry.field04 != company || entry.field00 != game)
            continue;
        different = 0;
        if (name != 0) {
            for (j = 0; j < 16; j++) {
                if (entry.field10[j] != name[j]) {
                    different = 1;
                    break;
                }
            }
        }
        if (extension != 0 && different == 0) {
            for (j = 0; j < 4; j++) {
                if (entry.field0c[j] != extension[j]) {
                    different = 1;
                    break;
                }
            }
        }
        if (different == 0) {
            *file = i;
            return result;
        }
    }
    *file = -1;
    return 5;
}
