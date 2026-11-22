#ifndef OB64_GAME_BOOT_ARCHIVE_RECORD_H
#define OB64_GAME_BOOT_ARCHIVE_RECORD_H

#include "game/boot_archive_stream.h"

/* Layout written by the retail archive record decoder. */
typedef struct ResourceRecord {
    u8 byte00;
    u8 bytes01[5];
    u8 unknown06[2];
    u32 word08;
    u32 word0C;
    u32 word10;
    u8 byte14;
    u8 byte15;
    u8 bytes16[0x100];
    u16 half116;
    u32 word118;
    u8 byte11C;
    u8 byte11D;
    u8 unknown11E[2];
    u32 word120;
    u16 half124;
    u16 half126;
    u16 half128;
    u8 unknown12A[2];
} ResourceRecord;

/* Keep the retail callers' 0x130-byte allocation and word alignment. */
typedef union {
    ResourceRecord record;
    u8 bytes[0x130];
} ResourceRecordScratch;

s32 func_0000B3E4(ArcFile *input, ResourceRecord *record);

#endif
