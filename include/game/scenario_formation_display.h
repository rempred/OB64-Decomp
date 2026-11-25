#ifndef OB64_GAME_SCENARIO_FORMATION_DISPLAY_H
#define OB64_GAME_SCENARIO_FORMATION_DISPLAY_H

#include "game/scenario_source_record.h"

typedef struct FormationDisplayState {
    const Func001957D0SourceRecord *source_record;
    u8 cell_flags[15];
    u8 field_13;
    u32 member_image_14;
    u32 member_image_18;
    u32 member_image_1C;
    u32 field_20[2];
    u32 background_image;
    u32 cell_image;
} FormationDisplayState;

extern FormationDisplayState *D_801A7960;

#endif
