#ifndef OB64_COMMON_TASK_FRAMEBUFFER_H
#define OB64_COMMON_TASK_FRAMEBUFFER_H

#include "common/types.h"
#include "common/os_message_queue.h"

typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;

/* The registered framebuffer callback receives the full scheduler task from
 * func_00019940. The task ring is initialized by func_00019a60 and its
 * framebuffer field is written by func_00019c04 before queue submission. */
typedef struct {
    u32 type;
    u32 flags;
    u64 *ucode_boot;
    u32 ucode_boot_size;
    u64 *ucode;
    u32 ucode_size;
    u64 *ucode_data;
    u32 ucode_data_size;
    u64 *dram_stack;
    u32 dram_stack_size;
    u64 *output_buff;
    u64 *output_buff_size;
    u64 *data_ptr;
    u32 data_size;
    u64 *yield_data_ptr;
    u32 yield_data_size;
} OSTask;
typedef struct NUScTask_s {
    struct NUScTask_s *next;
    u32 state;
    u32 flags;
    void *framebuffer;
    OSTask list;
    OSMesgQueue *msgQ;
    OSMesg msg;
} NUScTask;
typedef void (*NUScTaskCallback)(NUScTask *task);
void func_0001b510(NUScTask *gfxTask);

#endif
