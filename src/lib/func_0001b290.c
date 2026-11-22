#include "game/nu_cont_pak_file.h"
#include "game/nu_si_message.h"

s32 func_0001a0f8(NUScMsg mesg, void *dataPtr);
void func_0001b290(NUContPakFile *file, s32 offset, s32 size, u8 *buf, u32 mode) {
    NUContPakFileRWMesg rwMesg;
    rwMesg.file = file;
    rwMesg.offset = offset;
    rwMesg.size = size;
    rwMesg.mode = mode;
    rwMesg.buf = buf;
    file->error = func_0001a0f8(0x204, &rwMesg);
}
