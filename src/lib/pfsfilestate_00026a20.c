#include "common/os_pfs.h"

typedef OSPfs PfsState;

typedef struct {
    unsigned int field00;
    unsigned short field04;
    unsigned short field06;
    unsigned char field08[4];
    unsigned char field0c[4];
    unsigned char field10[16];
} DirectoryEntry;

typedef PfsInode Node;

extern int func_00027fd0(void *queue, int channel, unsigned short address,
                         unsigned char *data);
extern void func_00023460(const void *source, void *destination,
                          unsigned int bytes);
extern int func_000272c0(void *queue, int channel);

int func_00026a20(PfsState *state, int file, OSPfsFileState *output)
{
    unsigned short table[128];
    DirectoryEntry entry;
    int result;
    int count;
    Node node;
    unsigned char bank;

    if (file >= state->dir_size || file < 0)
        return 5;
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
    result = func_00027fd0(state->queue, state->channel,
                          (unsigned short)((u32)state->dir_table + file),
                          (unsigned char *)&entry);
    if (result != 0)
        return result;
    if (entry.field04 == 0 || entry.field00 == 0)
        return 5;
    count = 0;
    node.value = entry.field06;
    bank = 0xff;
    /* Keep the exit check at the head of the traversal. */
    for (;;) {
        if (node.value < state->inode_start_page)
            goto traversal_done;
        if (node.bytes.byte00 != bank) {
            bank = node.bytes.byte00;
            result = func_00027c8c(state, table, 0, bank);
            if (result != 0)
                return result;
        }
        node.value = table[node.bytes.byte01];
        count++;
    }
traversal_done:
    if (node.value != 1)
        return 3;
    output->size = count << 8;
    output->company_code = entry.field04;
    output->game_code = entry.field00;
    func_00023460(entry.field10, output->name, 16);
    func_00023460(entry.field0c, output->extension, 4);
    return func_000272c0(state->queue, state->channel);
}
