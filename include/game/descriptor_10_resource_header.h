#ifndef GAME_DESCRIPTOR_10_RESOURCE_HEADER_H
#define GAME_DESCRIPTOR_10_RESOURCE_HEADER_H

#include "common/types.h"

/* Resource headers and records share this eight-byte prefix. The role of
 * field_02 depends on whether the address is a container or a record. */
typedef struct Descriptor10ResourceHeader {
    u8 magic0;
    u8 magic1;
    u8 field_02;
    u8 flags;
    u16 width;
    u16 height;
} Descriptor10ResourceHeader;

typedef char Descriptor10ResourceHeaderSizeCheck[
    sizeof(Descriptor10ResourceHeader) == 8 ? 1 : -1];

void func_00203030(Descriptor10ResourceHeader *header);
void func_002032B8(Descriptor10ResourceHeader *header);
void *func_00203414(Descriptor10ResourceHeader *header, u32 index);
void *func_00203570(Descriptor10ResourceHeader *header, u32 index);
Descriptor10ResourceHeader *func_00203664(Descriptor10ResourceHeader *header, u32 index);

#endif
