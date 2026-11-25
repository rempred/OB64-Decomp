#include "game/character_record.h"
#include "game/scenario_source_record.h"

enum {
    SCENARIO_MEMBER_ID_OFFSET = 2,
    SCENARIO_POSITION_OFFSET = 7
};

typedef struct FormationDisplayState {
    const Func001957D0SourceRecord *source_record;
    u8 cell_flags[15];
} FormationDisplayState;

extern FormationDisplayState *D_801A7960;
u8 func_00043d1c(int primary_class_id, int secondary_class_id);

/* Build formation display flags from the five members of a scenario record. */
void func_00083970(s32 use_source_positions, const Func001957D0SourceRecord *source_record)
{
    FormationDisplayState *display;
    const u8 *member_cursor;
    s32 slot;
    s32 position;
    u8 member_id;
    u32 member_index;
    u8 primary_class;
    u8 secondary_class;
    u8 *cell;

    display = D_801A7960;
    slot = 0;
    display->source_record = source_record;
    do {
        u8 *reset_cell = (u8 *)display + slot;
        if (slot < 9) {
            reset_cell[4] = 0xF;
        } else {
            reset_cell[4] = 0;
        }
        slot++;
    } while (slot < 15);

    slot = 0;
    member_cursor = (const u8 *)source_record;
    do {
        if (use_source_positions == 0) {
            position = 8 - member_cursor[SCENARIO_POSITION_OFFSET];
        } else {
            position = member_cursor[SCENARIO_POSITION_OFFSET];
        }
        member_id = member_cursor[SCENARIO_MEMBER_ID_OFFSET];
        member_index = member_id;
        secondary_class = 0;
        if (member_index >= 100) {
            primary_class = 0;
            member_id = 0;
        } else if (display->source_record->field_01 & 0x80) {
            primary_class = D_80195560[member_index].primary_class_id;
            secondary_class = D_80195560[member_index].secondary_class_id;
        } else {
            primary_class = D_80193BC0[member_index].record.primary_class_id;
            secondary_class = D_80193BC0[member_index].record.secondary_class_id;
        }

        if (member_id != 0 && func_00043d1c(primary_class, secondary_class) == 2) {
            cell = (u8 *)display + position;
            cell[4] = 0xF;
            if (position < 6) {
                cell[13] |= 3;
                switch (position % 3) {
                case 0:
                    cell[14] |= 1;
                    cell[5] |= 5;
                    break;
                case 1:
                    cell[14] |= 1;
                    cell[12] |= 2;
                    cell[3] |= 0xA;
                    cell[5] |= 5;
                    break;
                case 2:
                    cell[12] |= 2;
                    cell[3] |= 0xA;
                    break;
                }
            }
            if (position >= 3) {
                u8 *previous_cell = (u8 *)display + position;
                previous_cell[1] &= 3;
                switch (position % 3) {
                case 0:
                    previous_cell[2] &= 0xB;
                    break;
                case 1:
                    previous_cell[2] &= 0xB;
                    previous_cell[0] &= 7;
                    break;
                case 2:
                    previous_cell[0] &= 7;
                    break;
                }
            }
        }
        slot++;
        member_cursor++;
    } while (slot < 5);
}
