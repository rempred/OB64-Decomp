#ifndef OB64_COMMON_MUS_CONFIG_H
#define OB64_COMMON_MUS_CONFIG_H

#include "common/mus_bank.h"

typedef struct {
    u32 control_flag;
    s32 channels;
    void *sched;
    s32 thread_priority;
    u8 *heap;
    s32 heap_length;
    MusBank *ptr;
    u8 *wbk;
    MusFxBank *default_fxbank;
    s32 fifo_length;
    s32 syn_updates;
    s32 syn_output_rate;
    s32 syn_rsp_cmds;
    s32 syn_retraceCount;
    s32 syn_num_dma_bufs;
    s32 syn_dma_buf_size;
    s32 diskrom_handle;
} MusConfig;

void func_0001163c(MusConfig *config);
void func_00015bd0(MusConfig *config, s32 vsyncs_per_second, s32 effect);

#endif
