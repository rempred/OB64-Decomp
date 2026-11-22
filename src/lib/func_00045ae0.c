#include "game/class_sprite.h"

typedef struct {
    u16 sprite[2];
    u8 flags;
} ClassSpriteInfo;
extern ClassSpriteInfo D_8018ECE0[];
unsigned int D_8009DAF4(unsigned int handle);
void *D_8009DBB8(void *dst, unsigned int handle);
void *D_8009DD38(unsigned int handle);
void *func_00001330(unsigned int size);
void *func_000016C4(void *p);
void *func_00045ae0(u8 cls, u8 variant, u16 **out_pixels) {
    u32 *handles = func_00001330(D_8009DAF4(0x1DFB6EA));
    u16 v;
    s32 index;
    s32 sub;
    u8 *chunk;
    u32 *entry;
    if (variant == 0) {
        v = D_8018ECE0[cls].sprite[0];
        index = v >> 3;
    } else {
        v = D_8018ECE0[cls].sprite[1];
        index = v >> 3;
    }
    sub = v & 7;
    D_8009DBB8(handles, 0x1DFB6EA);
    index *= 4;
    /* KMC keeps the scaled index first when both address operands are words. */
    entry = (u32 *)(index + (u32)handles);
    if (D_8009DAF4(*entry) != 0) {
        chunk = D_8009DD38(*entry);
        *out_pixels = (u16 *)(chunk + (sub * 0xA0 + 0x780));
    } else {
        chunk = ((void *)0);
        *out_pixels = ((void *)0);
    }
    func_000016C4(handles);
    return chunk;
}
