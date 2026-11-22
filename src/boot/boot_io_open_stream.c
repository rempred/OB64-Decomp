#include "game/boot_archive_stream.h"

extern ArcFile D_800AF340;
extern ArcFile D_800AF358;
ArcFile *boot_io_open_stream(void *name, const u8 *mode, u8 *buf, s32 size);
ArcFile *boot_io_open_stream(void *name, const u8 *mode, u8 *buf, s32 size) {
    if (mode[0] == 'r') {
        if (D_800AF340.open) {
            return ((void *)0);
        }
        D_800AF340.name = name;
        D_800AF340.extent.buf = buf;
        D_800AF340.extent.size = size;
        D_800AF340.pos = 0;
        return &D_800AF340;
    }
    if (D_800AF358.open) {
        return ((void *)0);
    }
    D_800AF358.name = name;
    D_800AF358.extent.buf = buf;
    D_800AF358.extent.size = size;
    D_800AF358.pos = 0;
    return &D_800AF358;
}
