#include "game/nu_si_message.h"
#include "game/nu_cont_pak_file.h"

typedef unsigned long long u64;
typedef void *OSMesg;
extern struct MessageQueue D_800E9B88;
s32 func_00026f90(struct MessageQueue *queue, OSPfs *pfs, s32 channel);
s32 func_0001aae0(NUSiCommonMesg *mesg) {
    s32 rtn;
    NUContPakFile *file;
    file = (NUContPakFile *)mesg->dataPtr;
    file->type = 0;
    rtn = func_00026f90(&D_800E9B88, file->pfs, file->pfs->channel);
    if (!rtn) {
        file->type = 1;
    }
    return rtn;
}
