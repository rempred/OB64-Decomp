#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

s32 func_0001a0f8(NUScMsg mesg, void *dataPtr);
void func_0001b2e0(NUContPakFile *file, u8 *noteName, u8 *extName) {
    NUContPakFileOpenMesg delMesg;
    delMesg.file = file;
    delMesg.noteName = noteName;
    delMesg.extName = extName;
    file->error = func_0001a0f8(0x205, &delMesg);
}
