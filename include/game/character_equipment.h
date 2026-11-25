#ifndef OB64_GAME_CHARACTER_EQUIPMENT_H
#define OB64_GAME_CHARACTER_EQUIPMENT_H

#include "game/class_field_lookups.h"

typedef s8 (*EquipmentStatAdjustment)(u16 equipment_id);
typedef s8 (*AlternateEquipmentStatAdjustment)(s32 equipment_id);

typedef struct EquipmentAdjustmentTables {
    EquipmentStatAdjustment stat[6];
    EquipmentSelector class_equipment[4];
    EquipmentStatAdjustment repeated_stat[6];
    AlternateEquipmentStatAdjustment alternate[8];
} EquipmentAdjustmentTables;

extern EquipmentAdjustmentTables table_000dbcd0;
extern EquipmentSelector D_801EF288[];

u16 func_000bb47c(s32 table_mode, s32 character_index, s32 slot);
s16 func_000bd60c(s32 table_mode, s32 character_index, s32 stat_index);
s16 func_000bd8c4(s32 table_mode, s32 character_index, s32 stat_index);

#endif
