#include "common/os_pfs.h"
#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

extern u16 D_800AA010;
extern u32 D_800AA014;
s32 func_0001ab98(NUSiCommonMesg *mesg) {
    NUContPakFileOpenMesg *openMesg;
    NUContPakFile *file;
    s32 rtn;
    openMesg = (NUContPakFileOpenMesg *)mesg->dataPtr;
    file = openMesg->file;
    rtn = func_00026bc0(file->pfs, D_800AA010, D_800AA014, openMesg->noteName, openMesg->extName,
                        &file->file_no);
    if ((rtn == 5) && (openMesg->mode == 1)) {
        rtn = func_00025f90(file->pfs, D_800AA010, D_800AA014, openMesg->noteName, openMesg->extName,
                                openMesg->size, &file->file_no);
    }
    return rtn;
}
