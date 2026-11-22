#ifndef OB64_GAME_BOOT_RESOURCE_DMA_H
#define OB64_GAME_BOOT_RESOURCE_DMA_H

#include "common/types.h"

typedef void (*BootResourceDmaCallback)(u32 deviceAddress, void *buffer,
                                        u32 bytes, s32 direction);

void func_0001a4f0(u32 deviceAddress, void *buffer, u32 bytes, s32 direction);
void func_0001A4F0(u32 deviceAddress, void *buffer, u32 bytes, s32 direction);

#endif
