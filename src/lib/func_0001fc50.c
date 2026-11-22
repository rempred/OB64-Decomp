#include "common/audio_heap.h"

/* ROM 1FC50: the four heap fields are established by this body and bump_alloc. */
void func_0001fc50(L4Heap *heap, unsigned char *base, int length)
{
    int adjustment = 16 - ((unsigned int)base & 15);

    if (adjustment != 16)
        heap->base = base + adjustment;
    else
        heap->base = base;
    heap->current = heap->base;
    heap->length = length;
    heap->field0c = 0;
}
