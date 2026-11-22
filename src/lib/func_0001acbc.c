#include "game/nu_si_message.h"
#include "game/nu_cont_pak_file.h"

typedef unsigned long long u64;
typedef void *OSMesg;
typedef struct {
    NUContPakFile *file;
    s32 *max_files;
    s32 *used_files;
} NUContPakFileNumMesg;
s32 func_00026e90(OSPfs *pfs, s32 *max_files, s32 *files_used);
s32 func_0001acbc(NUSiCommonMesg *mesg) {
    NUContPakFileNumMesg *numMesg;
    numMesg = (NUContPakFileNumMesg *)mesg->dataPtr;
    return func_00026e90(numMesg->file->pfs, numMesg->max_files, numMesg->used_files);
}
