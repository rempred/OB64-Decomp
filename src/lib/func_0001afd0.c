#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

s32 func_0001a0f8(NUScMsg mesg, void *dataPtr);
extern OSPfs D_800E99E8[4];
void func_0001afd0(NUContPakFile *file, u32 contNo) {
    file->pfs = &D_800E99E8[contNo];
    file->pfs->channel = contNo;
    file->error = func_0001a0f8(0x201, file);
}
