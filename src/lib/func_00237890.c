#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u16 D_801C8FB8(void *record);
s32 D_8016F580(s32 equipment_id);
u8 D_8016F598(s32 equipment_id);
s32 D_801CD19C(s32 a, s32 cls, s32 flag);
s32 func_00237890(void *source, void *target) {
    u8 infliction_mask;
    u8 protection_mask;
    u16 equipment_id = D_801C8FB8(source);
    infliction_mask = 0;
    protection_mask = 0;
    if (equipment_id != 0) {
        infliction_mask = D_8016F580((u16)equipment_id);
    }
    if (((BattleRosterRecord *)target)->equipment_slot_0 != 0) {
        protection_mask = D_8016F598(((BattleRosterRecord *)target)->equipment_slot_0);
    }
    if (((BattleRosterRecord *)target)->equipment_slot_1 != 0) {
        protection_mask |= D_8016F598(((BattleRosterRecord *)target)->equipment_slot_1);
    }
    if (((BattleRosterRecord *)target)->equipment_slot_2 != 0) {
        protection_mask |= D_8016F598(((BattleRosterRecord *)target)->equipment_slot_2);
    }
    if (((BattleRosterRecord *)target)->equipment_slot_3 != 0) {
        protection_mask |= D_8016F598(((BattleRosterRecord *)target)->equipment_slot_3);
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->primary_class_id.word, ((BattleRosterRecord *)target)->secondary_class_id.word, 4)) {
        protection_mask |= 2;
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->primary_class_id.word, ((BattleRosterRecord *)target)->secondary_class_id.word, 8)) {
        protection_mask |= 4;
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->primary_class_id.word, ((BattleRosterRecord *)target)->secondary_class_id.word, 2)) {
        protection_mask |= 8;
    }
    if (D_801CD19C(((BattleRosterRecord *)target)->primary_class_id.word, ((BattleRosterRecord *)target)->secondary_class_id.word, 0x10)) {
        protection_mask |= 0x20;
    }
    infliction_mask &= ~protection_mask;
    return infliction_mask;
}
