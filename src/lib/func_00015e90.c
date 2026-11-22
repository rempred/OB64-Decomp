#include "common/audio_heap.h"

typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void D_8008F850(L4Heap *hp, u8 *base, s32 len);
void func_00015f30(void *dest, u8 value, u32 length);
void func_00015e90(u8 *heap, s32 length) {
    func_00015f30(heap, 0, length);
    D_8008F850(&D_800B1A70, heap, length);
}
void func_00015f30(void *dest, u8 value, u32 length);
