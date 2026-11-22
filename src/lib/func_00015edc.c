#include "common/audio_heap.h"

typedef signed int s32;
void *alHeapDBAlloc(void *file, s32 line, void *hp, s32 num, s32 size);
void *func_00015edc(s32 size) {
    return alHeapDBAlloc(((void *)0), 0, &D_800B1A70, 1, size);
}
