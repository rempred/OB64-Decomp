#include "common/mus_dma.h"
typedef struct DmaBuffer {
    struct DmaBuffer *prev;
    struct DmaBuffer *next;
    s32 frames;
    u32 startAddr;
    u8 *ptr;
} DmaBuffer;
u32 osVirtualToPhysical(void *addr);
DmaBuffer *func_0001587c(u32 addr, s32 len);
s32 func_00015810(s32 address, s32 len, void *state) {
    /* Callback arguments carry the address bits; calculations are unsigned. */
    u32 addr = address;
    DmaBuffer *dmaPtr = func_0001587c(addr, len);
    if (dmaPtr == ((void *)0)) {
        return osVirtualToPhysical((void *)addr);
    }
    if ((addr & 0xFF000000) == 0xFF000000) {
        addr &= 0xFFFFFF;
        addr += 0x140000;
    }
    return osVirtualToPhysical(dmaPtr->ptr + addr - dmaPtr->startAddr);
}
DmaBuffer *func_0001587c(u32 addr, s32 len);
