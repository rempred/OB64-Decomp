#include "common/os_message_queue.h"
#include "game/nu_sc_client.h"
#include "game/nu_si_message.h"

typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
extern NUCallBackList *D_800A9EA0;
extern OSMesgQueue D_800E7988;
void func_00024f40(Thread *thread);
void func_0001a19c(void *arg);
void func_0001a19c(void *arg) {
    NUScClient siClient;
    OSMesg mesgBuf[8];
    OSMesg siMesg;
    NUCallBackList **siCallBackListPtr;
    s32 ret;
    u16 majorNo;
    u16 minorNo;
    osCreateMesgQueue(&D_800E7988, mesgBuf, 8);
    func_00019454(&siClient, &D_800E7988, 1);
    while (1) {
        func_00023AE0(&D_800E7988, &siMesg, 1);
        siCallBackListPtr = &D_800A9EA0;
        switch (((NUSiCommonMesg *)siMesg)->mesg) {
            case 1:
                if (*siCallBackListPtr == ((void *)0)) {
                    continue;
                }
                while (*siCallBackListPtr) {
                    if ((*siCallBackListPtr)->func[0]) {
                        ret = (*(*siCallBackListPtr)->func[0])(siMesg);
                    }
                    if (ret) {
                        break;
                    }
                    siCallBackListPtr = &(*siCallBackListPtr)->next;
                }
                break;
            case 0x7F00:
                func_00023C10(((NUSiCommonMesg *)siMesg)->rtnMesgQ, ((void *)0), 1);
                func_000194e4(&siClient, 0);
                func_00024f40(((void *)0));
                func_000194e4(&siClient, 1);
                break;
            default:
                majorNo = ((NUSiCommonMesg *)siMesg)->mesg & 0xFF00;
                minorNo = ((NUSiCommonMesg *)siMesg)->mesg & 0x00FF;
                while (*siCallBackListPtr) {
                    if ((*siCallBackListPtr)->majorNo == majorNo) {
                        if ((*siCallBackListPtr)->funcNum > minorNo) {
                            ((NUSiCommonMesg *)siMesg)->error = (*(*siCallBackListPtr)->func[minorNo])(siMesg);
                        }
                        if (((NUSiCommonMesg *)siMesg)->rtnMesgQ != ((void *)0)) {
                            func_00023C10(((NUSiCommonMesg *)siMesg)->rtnMesgQ, ((void *)0), 1);
                        }
                        break;
                    }
                    siCallBackListPtr = &(*siCallBackListPtr)->next;
                }
                break;
        }
    }
}
