#include "game/boot_dma_platform.h"

extern struct OSPiHandle_s *D_800E7A20;
extern void os_inval_dcache(void *, s32);

void func_0001a380(u32 rom_address, u8 *destination, u32 remaining)
{
    DmaIoMessage io;
    MessageQueue queue;
    void *message;
    u32 chunk;

    func_00023970(&queue, &message, 1);
    io.priority = 0;
    io.return_queue = &queue;
    os_inval_dcache(destination, remaining);
    while (remaining != 0) {
        chunk = remaining;
        if (chunk > 0x200) chunk = 0x200;
        io.device_address = rom_address;
        io.dram_address = destination;
        io.size = chunk;
        func_0001c040(D_800E7A20, &io, 0);
        /* Keeping the chunk live through the start call reproduces the original
         * allocation; the compiler schedules these updates before that call. */
        rom_address += chunk;
        destination += chunk;
        remaining -= chunk;
        func_00023AE0(&queue, &message, 1);
    }
}
