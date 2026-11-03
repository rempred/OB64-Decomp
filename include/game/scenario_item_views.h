#ifndef OB64_GAME_SCENARIO_ITEM_VIEWS_H
#define OB64_GAME_SCENARIO_ITEM_VIEWS_H

#include "common/types.h"

/* Shared address views used by the scenario item paths. Field names encode only
 * observed offsets; these are not complete behavioral type identifications. */
typedef struct { s16 field00, field02, field04, field06; u16 field08; } ScenarioCursor;
typedef struct {
    u8 members[5], positions[5], field0A, items[8], remaining[6];
} ScenarioGroup;
typedef struct {
    u8 pad00[0x11], field11, pad12, field13, pad14[2];
    u16 field16, field18;
    u8 pad1A[0x19], field33, pad34[4];
} ScenarioCharacter;

extern ScenarioGroup D_801971F2[];
extern ScenarioCharacter D_80193BC0[];
extern ScenarioCursor D_8021E3A0, D_8021E3AA;
extern u16 D_80190F82[];
extern u8 func_00040FF4(s32, u8);
/* Callers supply a bounded member value; keep the full-width call operand. */
extern u16 func_00153898(s32, s32, u8);
extern u8 func_001AD8CC(u16, u8, s32);

#endif
