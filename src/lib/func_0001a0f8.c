#include "common/os_message_queue.h"
#include "game/nu_si_message.h"

typedef signed short s16;
typedef signed int s32;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
extern OSMesgQueue D_800E7988;
s32 func_0001a0f8(NUScMsg mesg, void *dataPtr) {
    OSMesgQueue rtnMesgQ;
    NUSiCommonMesg siCommonMesg;
    OSMesg rtnMesgBuf;
    siCommonMesg.mesg = mesg;
    siCommonMesg.dataPtr = dataPtr;
    siCommonMesg.rtnMesgQ = &rtnMesgQ;
    osCreateMesgQueue(&rtnMesgQ, &rtnMesgBuf, 1);
    func_00023C10(&D_800E7988, (OSMesg)&siCommonMesg, 1);
    func_00023AE0(&rtnMesgQ, ((void *)0), 1);
    return siCommonMesg.error;
}
