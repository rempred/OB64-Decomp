#include "game/nu_si_message.h"
#include "game/nu_cont_pak_file.h"

typedef unsigned long long u64;
typedef void *OSMesg;
s32 func_0001ac90(NUSiCommonMesg *mesg) {
    NUContPakFileStateMesg *stateMesg;
    stateMesg = (NUContPakFileStateMesg *)mesg->dataPtr;
    return func_00026a20(stateMesg->file->pfs, stateMesg->file->file_no, stateMesg->state);
}
