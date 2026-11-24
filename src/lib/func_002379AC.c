#include "game/battle_roster_record.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
u8 D_8016F598(s32 id);
s32 D_801CD19C(s32 a, s32 cls, s32 flag);
s32 func_002379AC(s32 effect, void *record) {
    u8 protection_mask = 0;
    s32 result;
    if (((BattleRosterRecord *)record)->equipment_slot_0 != 0) {
        protection_mask = D_8016F598(((BattleRosterRecord *)record)->equipment_slot_0);
    }
    if (((BattleRosterRecord *)record)->equipment_slot_1 != 0) {
        protection_mask |= D_8016F598(((BattleRosterRecord *)record)->equipment_slot_1);
    }
    if (((BattleRosterRecord *)record)->equipment_slot_2 != 0) {
        protection_mask |= D_8016F598(((BattleRosterRecord *)record)->equipment_slot_2);
    }
    if (((BattleRosterRecord *)record)->equipment_slot_3 != 0) {
        protection_mask |= D_8016F598(((BattleRosterRecord *)record)->equipment_slot_3);
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->primary_class_id.word, ((BattleRosterRecord *)record)->secondary_class_id.word, 4)) {
        protection_mask |= 2;
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->primary_class_id.word, ((BattleRosterRecord *)record)->secondary_class_id.word, 8)) {
        protection_mask |= 4;
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->primary_class_id.word, ((BattleRosterRecord *)record)->secondary_class_id.word, 2)) {
        protection_mask |= 8;
    }
    if (D_801CD19C(((BattleRosterRecord *)record)->primary_class_id.word, ((BattleRosterRecord *)record)->secondary_class_id.word, 0x10)) {
        protection_mask |= 0x20;
    }
    switch ((u32)effect) {
        case 4:
            result = protection_mask & 2;
            break;
        case 3:
            result = protection_mask & 8;
            break;
        case 8:
            result = protection_mask & 4;
            break;
        case 10:
            result = protection_mask & 0x20;
            break;
        default:
            return 1;
    }
    if (result != 0) {
        result = 0;
    } else {
        result = 1;
    }
    return result;
}
