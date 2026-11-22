#include "common/os_pfs.h"
#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

extern u16 D_800AA010;
extern u32 D_800AA014;
s32 func_0001ac50(NUSiCommonMesg *mesg) {
    NUContPakFileOpenMesg *delMesg;
    delMesg = (NUContPakFileOpenMesg *)mesg->dataPtr;
    return func_000263c0(delMesg->file->pfs, D_800AA010, D_800AA014, delMesg->noteName, delMesg->extName);
}
