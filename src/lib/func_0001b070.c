#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

s32 func_0001a0f8(NUScMsg mesg, void *dataPtr);
void func_0001b070(NUContPakFile *file) {
    file->error = func_0001a0f8(0x208, file);
}
