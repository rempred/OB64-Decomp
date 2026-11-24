#ifndef GAME_CHARACTER_TEMPLATE_H
#define GAME_CHARACTER_TEMPLATE_H

#include "common/types.h"

/* Packed scenario input used to construct runtime characters. */
typedef struct CharacterTemplate {
    u8 main_class_id;
    u8 main_level_offset;
    u16 main_equipment_02;
    s16 main_equipment_04;
    u8 main_position;
    u8 second_class_id;
    u8 second_level_offset;
    u16 second_equipment_09;
    s16 second_equipment_0B;
    u8 field_0D[3];
    u8 third_class_id;
    u8 third_level_offset;
    u16 third_equipment_12;
    s16 third_equipment_14;
    u8 field_16[13];
} __attribute__((packed)) CharacterTemplate;

typedef char CharacterTemplate_size[sizeof(CharacterTemplate) == 0x23 ? 1 : -1];

void func_0019554C(int record_index, const CharacterTemplate *source, int template_member,
                   u8 force_52_byte_pool, int source_index);
void func_001957D0(const CharacterTemplate *source, int source_index);

#endif
