#include "common/types.h"

extern void func_0001A380(u32 rom_address, void *destination, u32 bytes);

void func_0002de50(u32 rom_address, u8 *destination, u32 bytes)
{
    u8 dma_scratch[32];
    u8 *source;
    u8 *cursor;

    /* The original rounds this real stack buffer up to sixteen-byte alignment. */
    source = (u8 *)((((u32)dma_scratch + 15) >> 4) << 4);
    if (bytes < 16) {
        cursor = destination;
        func_0001A380(rom_address, source, (bytes + 1) & ~1U);
        bytes--;
        if (bytes != ~0U) {
            do {
                *cursor++ = *source++;
                bytes--;
            } while (bytes != ~0U);
        }
    } else {
        func_0001A380(rom_address, destination, (bytes + 1) & ~1U);
    }
}

/* Required independent empty entry at physical owner offset 0x9C. The private
 * census uses global bodies; production retains the established local entry. */
void func_0002DEEC(void)
{
}
