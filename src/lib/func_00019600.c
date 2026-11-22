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
typedef struct SpTaskView {
    unsigned int type;
    unsigned int flags;
    void *field_08;
    unsigned int field_0C;
    void *field_10;
    unsigned int field_14;
    void *field_18;
    unsigned int field_1C;
    void *field_20;
    unsigned int field_24;
    void *outputBuffer;
    unsigned long long *outputSize;
    void *field_30;
    unsigned int field_34;
    void *field_38;
    unsigned int field_3C;
} SpTaskView;
typedef s16 NUScMsg;
typedef struct NUScTask_s {
    struct NUScTask_s *next;
    u32 state;
    u32 flags;
    void *framebuffer;
    SpTaskView list;
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
void osWritebackDCacheAll(void);
u32 __osSpGetStatus(void);
void osSpTaskYield(void);
u32 osSpTaskYielded(SpTaskView *task);
void osSpTaskLoad(SpTaskView *task);
void osSpTaskStartGo(SpTaskView *task);
void func_00019600(void *arg);
void func_00019600(void *arg) {
    NUScTask *gfxTask;
    OSMesg audioTask;
    OSMesg msg;
    u32 yieldFlag;
    while (1) {
        func_00023AE0(&D_800E8B10.audioRequestMQ, &audioTask, 1);
        if (!(D_800C4800 & 2)) {
            osWritebackDCacheAll();
            yieldFlag = 0;
            gfxTask = D_800E8B10.curGraphicsTask;
            if ((__osSpGetStatus() & 0x202) != 0x202 && gfxTask) {
                osSpTaskYield();
                yieldFlag = 2;
                func_00023AE0(&D_800E8B10.rspMQ, &msg, 1);
                if (osSpTaskYielded(&gfxTask->list)) {
                    yieldFlag = 1;
                }
            }
            D_800E8B10.curAudioTask = audioTask;
            osSpTaskLoad(&((NUScTask *)audioTask)->list);
            osSpTaskStartGo(&((NUScTask *)audioTask)->list);
            func_00023AE0(&D_800E8B10.rspMQ, &msg, 1);
            D_800E8B10.curAudioTask = ((void *)0);
            if (yieldFlag == 1) {
                osSpTaskLoad(&gfxTask->list);
                osSpTaskStartGo(&gfxTask->list);
            } else if (yieldFlag == 2) {
                func_00023C10(&D_800E8B10.rspMQ, &msg, 1);
            }
        }
        func_00023C10(((NUScTask *)audioTask)->msgQ, ((NUScTask *)audioTask)->msg, 1);
    }
}
