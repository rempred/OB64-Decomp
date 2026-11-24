#include "game/character_record.h"
#include "game/class_field_lookups.h"
#include "game/record_name_selection.h"
#include "game/class_entry.h"

extern ClassEntry D_80187C40[];
extern unsigned char *func_8009C550(unsigned char *destination, const unsigned char *source);
extern u8 func_8016F5C8(s32 target_level);
extern u8 func_8016DE70(s32 primary_class_id, s32 secondary_class_id);
extern int func_8009C7CC(void);

/* Build a 0x34-byte character from class defaults and optional overrides. */
void func_0023A3A0(CharacterRecord *character, u32 class_id, s32 target_level,
                   u32 first_equipment_override, u32 second_equipment_override)
{
    u32 secondary_class_id = D_80187C40[class_id].related_class_19;
    u8 equipment_category;
    u32 body_code;

    if (secondary_class_id == 0) {
        secondary_class_id = class_id;
    }
    func_8009C550(character->name, func_8016E1DC((u8)class_id, (u8)secondary_class_id));
    character->primary_class_id = class_id;
    character->secondary_class_id = secondary_class_id;
    character->level = target_level;
    character->equipment_slot_0 = func_8016DF88((u8)class_id, (u8)secondary_class_id);
    character->equipment_slot_1 = func_8016DFDC((u8)class_id, (u8)secondary_class_id);
    character->equipment_slot_2 = func_8016E030((u8)class_id, (u8)secondary_class_id);
    character->equipment_slot_3 = func_8016E084((u8)class_id, (u8)secondary_class_id);

    if (first_equipment_override != 0) {
        equipment_category = func_8016F5C8((u16)first_equipment_override);
        if (func_8016F5C8(character->equipment_slot_0) == equipment_category) {
            character->equipment_slot_0 = first_equipment_override;
        }
        if (func_8016F5C8(character->equipment_slot_1) == equipment_category) {
            character->equipment_slot_1 = first_equipment_override;
        }
        if (func_8016F5C8(character->equipment_slot_2) == equipment_category) {
            character->equipment_slot_2 = first_equipment_override;
        }
        if (func_8016F5C8(character->equipment_slot_3) == equipment_category) {
            character->equipment_slot_3 = first_equipment_override;
        }
    }
    if (second_equipment_override != 0) {
        equipment_category = func_8016F5C8((u16)second_equipment_override);
        if (func_8016F5C8(character->equipment_slot_0) == equipment_category) {
            character->equipment_slot_0 = second_equipment_override;
        }
        if (func_8016F5C8(character->equipment_slot_1) == equipment_category) {
            character->equipment_slot_1 = second_equipment_override;
        }
        if (func_8016F5C8(character->equipment_slot_2) == equipment_category) {
            character->equipment_slot_2 = second_equipment_override;
        }
        if (func_8016F5C8(character->equipment_slot_3) == equipment_category) {
            character->equipment_slot_3 = second_equipment_override;
        }
    }
    func_8016F11C(character, (u8)target_level);
    func_000FC120(1, character - D_80195560);
    body_code = func_8016DE70((u8)class_id, (u8)secondary_class_id);
    if (body_code == 3) {
        character->gender = 0;
    } else if (body_code == 4) {
        character->gender = func_8009C7CC() & 1;
    } else {
        character->gender = body_code;
    }
}
