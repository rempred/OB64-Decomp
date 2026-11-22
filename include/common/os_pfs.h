#ifndef OB64_COMMON_OS_PFS_H
#define OB64_COMMON_OS_PFS_H

#include "common/types.h"

struct MessageQueue;

/* The directory operations share this controller-pak state. */
typedef struct OSPfs {
    s32 status;
    struct MessageQueue *queue;
    s32 channel;
    u8 id[32];
    u8 label[32];
    s32 version;
    s32 dir_size;
    s32 inode_table;
    s32 minode_table;
    s32 dir_table;
    s32 inode_start_page;
    u8 banks;
    u8 activebank;
} OSPfs;

typedef char OSPfsSizeCheck[sizeof(OSPfs) == 0x68 ? 1 : -1];

typedef union PfsInode {
    u16 value;
    struct {
        u8 byte00;
        u8 byte01;
    } bytes;
} PfsInode;

typedef char PfsInodeSizeCheck[sizeof(PfsInode) == 2 ? 1 : -1];

typedef struct PakHeader {
    u32 field00;
    u32 field04;
    unsigned long long field08;
    unsigned long long field10;
    u16 field18;
    u8 field1a;
    u8 field1b;
    u16 field1c;
    u16 field1e;
} PakHeader;

typedef char PakHeaderSizeCheck[sizeof(PakHeader) == 0x20 ? 1 : -1];

typedef struct OSPfsFileState {
    u32 size;
    u32 game_code;
    u16 company_code;
    u8 extension[4];
    u8 name[16];
} OSPfsFileState;

typedef char OSPfsFileStateSizeCheck[sizeof(OSPfsFileState) == 0x20 ? 1 : -1];

s32 func_00025f90(OSPfs *pfs, u16 company, u32 game, const u8 *name,
                  const u8 *extension, s32 size, s32 *file);
s32 func_000263c0(OSPfs *pfs, u16 company, u32 game, const u8 *name,
                  const u8 *extension);
s32 func_00026a20(OSPfs *pfs, s32 file, OSPfsFileState *output);
s32 func_00026bc0(OSPfs *pfs, u16 company, u32 game, const u8 *name,
                  const u8 *extension, s32 *file);
s32 func_000274d0(OSPfs *pfs, u8 bank);
s32 func_00027574(PakHeader *header, u16 *sum, u16 *inverse);
s32 func_000275b8(OSPfs *pfs, PakHeader *old_header, PakHeader *new_header);
s32 func_000278a4(OSPfs *pfs, PakHeader *header);
s32 func_00027a08(OSPfs *pfs);
s32 func_00027bd4(OSPfs *pfs);
s32 func_00027c8c(OSPfs *pfs, void *table, u8 mode, u8 bank);

#endif
