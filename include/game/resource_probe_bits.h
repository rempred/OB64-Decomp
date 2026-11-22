#ifndef OB64_GAME_RESOURCE_PROBE_BITS_H
#define OB64_GAME_RESOURCE_PROBE_BITS_H

#include "common/types.h"

/* The special 0x10-byte record stores these bits at +0xC. */
typedef struct Bits42 {
    u32 flag : 1;
    u32 mode : 4;
    u32 rest : 27;
} Bits42;

typedef struct ProbeBitsRecord {
    u32 field00, field04, field08;
    Bits42 bits;
} ProbeBitsRecord;

void func_00042ccc(Bits42 *bits);
void func_00042cf4(Bits42 *bits);
void func_8016CDCC(Bits42 *bits);
void func_8016CDF4(Bits42 *bits);
#endif
