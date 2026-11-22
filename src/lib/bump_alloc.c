#include "common/audio_heap.h"

/* Complete ROM 1FC90 owner; the first two interface arguments are unused. */
void *bump_alloc(void *unused0, int unused1, void *heapStorage, int count, int size)
{
    L4Heap *heap = heapStorage;
    int bytes = (count * size + 15) & ~15;
    unsigned char *next = heap->current + bytes;
    void *result = 0;

    if (heap->base + heap->length >= next) {
        result = heap->current;
        heap->current = next;
    }
    return result;
}
