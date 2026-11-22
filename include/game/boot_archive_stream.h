#ifndef OB64_GAME_BOOT_ARCHIVE_STREAM_H
#define OB64_GAME_BOOT_ARCHIVE_STREAM_H

#include "common/types.h"

/* The write slot also exposes its buffer and limit through a result alias. */
typedef struct {
    u8 *buf;
    s32 size;
} ArcFileExtent;

/* Common 0x14-byte stream prefix. */
typedef struct {
    u8 open;
    void *name;
    ArcFileExtent extent;
    s32 pos;
} ArcFile;

ArcFile *func_0000F4E4(void *name, const u8 *mode, u8 *buf, s32 size);

s32 func_0000F970(u8 *dst, s32 size, s32 n, ArcFile *f);
s32 func_0000F9D8(const u8 *src, s32 size, s32 n, ArcFile *f);

#endif
