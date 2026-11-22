#ifndef OB64_COMMON_AUDIO_HEAP_H
#define OB64_COMMON_AUDIO_HEAP_H

/* Heap fields shared by the resident initializer and allocator. */
typedef struct L4Heap {
    unsigned char *base;
    unsigned char *current;
    int length;
    int field0c;
} L4Heap;

extern L4Heap D_800B1A70;

#endif
