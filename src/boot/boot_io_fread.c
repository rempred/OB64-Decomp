#include "game/boot_archive_stream.h"

s32 boot_io_fread(u8 *dst, s32 size, s32 n, ArcFile *f);
s32 boot_io_fread(u8 *dst, s32 size, s32 n, ArcFile *f) {
    s32 i, j;
    for (i = 0; i < n; i++) {
        for (j = 0; j < size; j++) {
            if (f->pos >= f->extent.size) {
                return i;
            }
            *dst++ = f->extent.buf[f->pos++];
        }
    }
    return i;
}
