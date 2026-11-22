#include "game/boot_resource_dma.h"

typedef struct ProbeChunkRecord {
    /* Together with the byte input below, preserve the observed store/read order. */
    BootResourceDmaCallback volatile callback;
} ProbeChunkRecord;

extern void *resource_alloc(u32 bytes);
extern void *resource_free(void *record);
/* Fixed external RAM input. Volatile retains the retail ordering with KMC GCC. */
extern volatile u8 D_800C4800;

void boot_resource_probe_chunk_callback_walk(u8 *buffer)
{
    ProbeChunkRecord *record;
    s32 offset;

    record = resource_alloc(0x10);
    record->callback = func_0001A4F0;
    if (D_800C4800 == 0) {
        offset = 0;
        do {
            record->callback(offset, buffer + offset, 0x100, 1);
            offset += 0x100;
        } while (offset < 0x8000);
    }
    resource_free(record);
}
