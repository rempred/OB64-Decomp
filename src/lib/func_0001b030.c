#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

s32 func_0001a0f8(NUScMsg mesg, void *dataPtr);
s32 func_0001b030(NUContPakFile *file) {
    NUContPakFreeMesg freeMesg;
    freeMesg.file = file;
    file->error = func_0001a0f8(0x202, &freeMesg);
    return freeMesg.size;
}
