#include "game/boot_resource_dma.h"
#include "game/boot_dma_platform.h"

extern struct OSPiHandle_s *D_800E79AC;
void osInvalDCache(void *addr, s32 size);
void osWritebackDCache(void *addr, s32 size);

void func_0001a4f0(u32 rom_addr, void *buf_ptr, u32 size, s32 direction) {
    DmaIoMessage dmaIoMesgBuf;
    MessageQueue dmaMesgQ;
    void *dmaMesgBuf;
    osCreateMesgQueue(&dmaMesgQ, &dmaMesgBuf, 1);
    dmaIoMesgBuf.priority = 0;
    dmaIoMesgBuf.return_queue = &dmaMesgQ;
    dmaIoMesgBuf.dram_address = buf_ptr;
    dmaIoMesgBuf.device_address = rom_addr;
    dmaIoMesgBuf.size = size;
    if (direction == 0) {
        osInvalDCache(buf_ptr, size);
    } else {
        osWritebackDCache(buf_ptr, size);
    }
    D_8008BC40(D_800E79AC, &dmaIoMesgBuf, direction);
    func_00023AE0(&dmaMesgQ, &dmaMesgBuf, 1);
}
