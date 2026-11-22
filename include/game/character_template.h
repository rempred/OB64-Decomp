#ifndef GAME_CHARACTER_TEMPLATE_H
#define GAME_CHARACTER_TEMPLATE_H

#include "common/types.h"

typedef struct CharacterTemplate {
    u8 field_00;
    u8 field_01;
    u16 field_02;
    s16 field_04;
    u8 field_06;
    u8 field_07;
    u8 field_08;
    u16 field_09;
    s16 field_0B;
    u8 field_0D[3];
    u8 field_10;
    u8 field_11;
    u16 field_12;
    s16 field_14;
    u8 field_16[13];
} __attribute__((packed)) CharacterTemplate;

typedef char CharacterTemplate_size[sizeof(CharacterTemplate) == 0x23 ? 1 : -1];

void func_0019554C(int record_index, const CharacterTemplate *source, int selector,
                   u8 flag, int source_index);
void func_001957D0(const CharacterTemplate *source, int source_index);

#endif
