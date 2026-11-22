#include "game/nu_si_message.h"
#include "game/nu_cont_pak_file.h"

typedef unsigned long long u64;
typedef void *OSMesg;
s32 func_00026d80(OSPfs *pfs, s32 *bytes_not_used);
s32 func_0001ab30(NUSiCommonMesg *mesg) {
    NUContPakFreeMesg *freeMesg;
    freeMesg = (NUContPakFreeMesg *)mesg->dataPtr;
    return func_00026d80(freeMesg->file->pfs, &freeMesg->size);
}
