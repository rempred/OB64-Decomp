#include "common/os_pfs.h"

extern void func_00024bc4(void);
extern void func_00024c30(void);
extern int func_000272c0(void *queue, int channel);
extern int func_00027fd0(void *queue, int channel, unsigned short address,
                        unsigned char *data);
extern int func_000281c0(void *queue, int channel, unsigned short address,
                        unsigned char *data, int mode);
extern void func_80093060(const void *source, void *destination, unsigned int bytes);
extern int func_00023350(const void *first, const void *second, unsigned int bytes);
extern int func_0002b070(OSPfs *state);
int func_00027188(OSPfs *state);

int func_00026f90(struct MessageQueue *queue, OSPfs *state, int channel)
{
    PakHeader header;
    PakHeader repaired;
    unsigned short sum;
    unsigned short inverse;
    PakHeader *active;
    int result;

    func_00024bc4();
    result = func_000272c0(queue, channel);
    func_00024c30();
    if (result != 0)
        return result;
    state->queue = queue;
    state->channel = channel;
    state->status = 0;
    result = func_00027188(state);
    if (result != 0)
        return result;
    result = func_000274d0(state, 0);
    if (result != 0)
        return result;
    result = func_00027fd0(state->queue, state->channel, 1,
                          (unsigned char *)&header);
    if (result != 0)
        return result;
    func_00027574(&header, &sum, &inverse);
    active = &header;
    if (header.field1c != sum || header.field1e != inverse) {
        result = func_000278a4(state, active);
        if (result != 0) {
            state->status |= 4;
            return result;
        }
    }
    if (!(active->field18 & 1)) {
        result = func_000275b8(state, active, &repaired);
        if (result != 0) {
            if (result == 10)
                state->status |= 4;
            return result;
        }
        /* Select the repaired header only on the successful path. This keeps
         * its address live across the status check in the pinned compiler. */
        active = &repaired;
        if (!(active->field18 & 1))
            return 11;
    }
    func_80093060(active, state->id, 32);
    state->version = active->field1b;
    state->banks = active->field1a;
    /* Keep the first bank-byte use adjacent: intervening word stores cause
     * the pinned compiler to reload it and alter the retail schedule. */
    state->inode_start_page = state->banks * 2 + 3;
    state->dir_size = 16;
    state->inode_table = 8;
    state->minode_table = (state->banks + 1) * 8;
    state->dir_table = state->minode_table + state->banks * 8;
    result = func_00027fd0(state->queue, state->channel, 7, state->label);
    if (result != 0)
        return result;
    result = func_0002b070(state);
    state->status |= 1;
    return result;
}

int func_00027188(OSPfs *state)
{
    unsigned char test[32];
    unsigned char readback[32];
    unsigned char saved[32];
    int i;
    int result;

    result = func_000274d0(state, 0);
    if (result != 0)
        return result;
    result = func_00027fd0(state->queue, state->channel, 0, saved);
    if (result != 0)
        return result;
    for (i = 31; i >= 0; i--)
        test[i] = i;
    result = func_000281c0(state->queue, state->channel, 0, test, 0);
    if (result != 0)
        return result;
    result = func_00027fd0(state->queue, state->channel, 0, readback);
    if (result != 0)
        return result;
    if (func_00023350(test, readback, 32) != 0)
        return 11;
    return func_000281c0(state->queue, state->channel, 0, saved, 0);
}
