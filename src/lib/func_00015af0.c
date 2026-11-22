#include "common/os_message_queue.h"
#include "common/types.h"

typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
typedef struct Scheduler Scheduler;
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
} OSTask_t;
typedef struct OSScTask_s {
    struct OSScTask_s *next;
    u32 state;
    u32 flags;
    void *framebuffer;
    OSTask_t list;
    OSMesgQueue *msgQ;
    OSMesg msg;
    u64 startTime;
    u64 totalTime;
} OSScTask;
typedef struct {
    s16 type;
    s8 misc[30];
} OSScMsg;
typedef struct Client {
    struct Client *next;
    MessageQueue *queue;
} OSScClient;
typedef struct {
    OSScClient client;
    OSMesgQueue msgQ;
    OSMesg msgbuf[4];
    OSMesgQueue taskQ;
    OSMesg taskbuf[4];
} MusSchedData;
typedef struct {
    u64 *data;
    u32 size;
    u64 *ucode;
    u64 *ucode_data;
} MusTask;
extern Scheduler *D_800B18A0;
extern MusSchedData *D_800B18A4;
extern u64 D_8009ECB0[];
extern u64 D_8009ED80[];
MessageQueue *func_000242e0(Scheduler *scheduler);
void func_00015af0(MusTask *task) {
    OSScTask t;
    OSScMsg msg;
    t.next = ((void *)0);
    t.msgQ = &D_800B18A4->taskQ;
    t.msg = &msg;
    t.flags = 2;
    t.list.data_ptr = task->data;
    t.list.data_size = task->size;
    t.list.type = 2;
    t.list.ucode_boot = D_8009ECB0;
    t.list.ucode_boot_size = (u8 *)D_8009ED80 - (u8 *)D_8009ECB0;
    t.list.flags = 0;
    t.list.ucode = task->ucode;
    t.list.ucode_data = task->ucode_data;
    t.list.ucode_size = 0x1000;
    t.list.ucode_data_size = 0x800;
    t.list.dram_stack = ((void *)0);
    t.list.dram_stack_size = 0;
    t.list.output_buff = ((void *)0);
    t.list.output_buff_size = ((void *)0);
    t.list.yield_data_ptr = ((void *)0);
    t.list.yield_data_size = 0;
    func_00023C10(func_000242e0(D_800B18A0), &t, 1);
    func_00023AE0(&D_800B18A4->taskQ, ((void *)0), 1);
}
