#include "game/boot_archive_stream.h"

static void func_0000FA40(void);
s32 boot_io_fwrite(const u8 *src, s32 size, s32 n, ArcFile *f) {
    /* The cursor only reads bytes. Its type keeps KMC's retail load and store order. */
    u8 *cursor = (u8 *)src;
    s32 i, j;
    for (i = 0; i < n; i++) {
        for (j = 0; j < size; j++) {
            if (f->pos >= f->extent.size) {
                return i;
            }
            f->extent.buf[f->pos++] = *cursor++;
        }
    }
    return i;
}
static void func_0000FA40(void) {
}
