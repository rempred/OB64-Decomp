#ifndef OB64_GAME_NU_CONT_PAK_FILE_H
#define OB64_GAME_NU_CONT_PAK_FILE_H

#include "common/os_pfs.h"

typedef struct NUContPakFile {
    OSPfs *pfs;
    s32 file_no;
    s32 error;
    u32 type;
} NUContPakFile;

typedef struct NUContPakFreeMesg {
    NUContPakFile *file;
    s32 size;
} NUContPakFreeMesg;

typedef struct NUContPakFileRWMesg {
    NUContPakFile *file;
    s32 offset;
    s32 size;
    u8 mode;
    u8 *buf;
} NUContPakFileRWMesg;

typedef struct NUContPakFileOpenMesg {
    NUContPakFile *file;
    u8 *noteName;
    u8 *extName;
    s32 size;
    s32 mode;
} NUContPakFileOpenMesg;

typedef struct NUContPakFileStateMesg {
    NUContPakFile *file;
    void *state;
} NUContPakFileStateMesg;

#endif
