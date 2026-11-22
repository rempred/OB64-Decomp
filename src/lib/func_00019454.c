#include "common/os_message_queue.h"
#include "game/nu_sc_client.h"

typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
typedef Thread OSThread;
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
typedef s16 NUScMsg;
typedef struct NUScTask_s {
    struct NUScTask_s *next;
    u32 state;
    u32 flags;
    void *framebuffer;
    OSTask list;
    OSMesgQueue *msgQ;
    OSMesg msg;
} NUScTask;
typedef struct {
    NUScMsg retraceMsg;
    NUScMsg prenmiMsg;
    OSMesgQueue audioRequestMQ;
    OSMesg audioRequestBuf[8];
    OSMesgQueue graphicsRequestMQ;
    OSMesg graphicsRequestBuf[8];
    OSMesgQueue retraceMQ;
    OSMesg retraceMsgBuf[8];
    OSMesgQueue rspMQ;
    OSMesg rspMsgBuf[8];
    OSMesgQueue rdpMQ;
    OSMesg rdpMsgBuf[8];
    OSMesgQueue waitMQ;
    OSMesg waitMsgBuf[8];
    OSThread schedulerThread;
    OSThread audioThread;
    OSThread graphicsThread;
    NUScClient *clientList;
    NUScTask *curGraphicsTask;
    NUScTask *curAudioTask;
    NUScTask *graphicsTaskSuspended;
    u32 retraceCount;
    u8 frameRate;
    u8 frameBufferNum;
} NUSched;
extern NUSched D_800E8B10;
extern u8 D_800C4800;
u32 osSetIntMask(u32 mask);
void func_00019454(NUScClient *c, OSMesgQueue *mq, NUScMsg msgType) {
    u32 mask;
    mask = osSetIntMask(1);
    c->msgQ = mq;
    c->next = D_800E8B10.clientList;
    c->msgType = msgType;
    D_800E8B10.clientList = c;
    if ((msgType & 2) && D_800C4800) {
        func_00023C10(mq, &D_800E8B10.prenmiMsg, 0);
    }
    osSetIntMask(mask);
}
