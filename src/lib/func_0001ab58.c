#include "game/nu_si_message.h"
#include "game/nu_cont_pak_file.h"

typedef unsigned long long u64;
typedef void *OSMesg;
s32 func_000265e0(OSPfs *pfs, s32 file_no, u8 flag, s32 offset, s32 size, u8 *data_buffer);
s32 func_0001ab58(NUSiCommonMesg *mesg) {
    NUContPakFileRWMesg *rwMesg;
    rwMesg = (NUContPakFileRWMesg *)mesg->dataPtr;
    return func_000265e0(rwMesg->file->pfs, rwMesg->file->file_no, rwMesg->mode, rwMesg->offset,
                              rwMesg->size, rwMesg->buf);
}
