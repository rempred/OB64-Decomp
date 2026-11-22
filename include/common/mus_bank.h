#ifndef OB64_COMMON_MUS_BANK_H
#define OB64_COMMON_MUS_BANK_H

#include "common/types.h"

typedef struct {
    u32 base_u;
    s32 len;
    u8 type;
    u8 flags;
    u32 loop;
    u32 book;
} MusWave;

typedef struct {
    u8 pad00[0x10];
    s32 flags;
    u8 pad14[0xC];
    s32 count;
    u8 *basenote;
    u8 *detune;
    MusWave **waves;
} MusBank;

typedef struct {
    s32 unk00;
    s32 count;
    u8 pad08[4];
    s32 flags;
    void *ptrbank;
    u32 unk14;
    struct MusFxEntry {
        u32 ptr;
        u32 unk4;
    } entries[1];
} MusFxBank;

MusBank *func_000121f0(MusBank *bank);
void func_0001237c(MusFxBank *bank);

#endif
