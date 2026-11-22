#ifndef OB64_GAME_NU_SI_MESSAGE_H
#define OB64_GAME_NU_SI_MESSAGE_H

struct MessageQueue;

typedef short NUScMsg;

typedef struct NUSiCommonMesg {
    NUScMsg mesg;
    struct MessageQueue *rtnMesgQ;
    int error;
    void *dataPtr;
} NUSiCommonMesg;

typedef int (*NUCallBackFunc)(NUSiCommonMesg *mesg);

typedef struct NUCallBackList_s {
    struct NUCallBackList_s *next;
    NUCallBackFunc *func;
    unsigned short majorNo;
    unsigned char funcNum;
} NUCallBackList;

void func_0001b530(NUCallBackList *list);
void func_0001b5d0(NUCallBackList *list);

#endif
