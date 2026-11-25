#include "game/character_record.h"

typedef struct FormationState {
    u8 field_00[0x0C];
    void *squad;
    int squad_source_index;
    u8 slot_flags[15];
} FormationState;

/* The five member-index and formation-slot bytes are parallel arrays. */
typedef struct FormationSquadView {
    u8 field_00[2];
    u8 member_indices[5];
    u8 formation_slots[5];
} FormationSquadView;

extern FormationState *D_801CFA70;

u8 D_8016DE1C(int primary_class_id, int secondary_class_id);

/* Initialize formation slot flags for the selected squad. */
void func_00209774(s32 selector, void *state, s32 squad_source_index)
{
    FormationState *formations = D_801CFA70;
    FormationState *formation;
    int index;
    FormationSquadView *squad = state;

    if (formations == 0) {
        return;
    }

    formation = &formations[selector];
    formation->squad = state;
    formation->squad_source_index = squad_source_index;
    index = 0;
    do {
        u8 *slot = (u8 *)formation + index;

        if (index < 9) {
            slot[0x14] = 0xF;
        } else {
            slot[0x14] = 0;
        }
        index++;
    } while (index < 15);

    for (index = 0; index < 5; index++) {
        int slot_index;
        u8 member_index;
        int primary_class_id;
        int secondary_class_id;
        u8 *slot_flags;

        if (selector == 0) {
            slot_index = 8 - squad->formation_slots[index];
        } else {
            slot_index = squad->formation_slots[index];
        }

        member_index = squad->member_indices[index];
        if ((unsigned int)member_index >= 100) {
            primary_class_id = 0;
            secondary_class_id = 0;
            member_index = 0;
        } else if (formation->squad_source_index >= 30) {
            primary_class_id = D_80195560[member_index].primary_class_id;
            secondary_class_id = D_80195560[member_index].secondary_class_id;
        } else {
            primary_class_id = D_80193BC0[member_index].record.primary_class_id;
            secondary_class_id = D_80193BC0[member_index].record.secondary_class_id;
        }

        if (member_index == 0 || D_8016DE1C(primary_class_id, secondary_class_id) != 2) {
            continue;
        }

        slot_flags = (u8 *)formation + slot_index;
        slot_flags[0x14] = 0xF;
        if (slot_index < 6) {
            slot_flags[0x1D] |= 3;
            switch (slot_index % 3) {
            case 0:
                slot_flags[0x1E] |= 1;
                slot_flags[0x15] |= 5;
                break;
            case 1: {
                u8 right_edge = slot_flags[0x1E] | 1;
                u8 left_edge = slot_flags[0x1C] | 2;
                u8 left_slot = slot_flags[0x13] | 0xA;
                u8 right_slot = slot_flags[0x15] | 5;

                slot_flags[0x1E] = right_edge;
                slot_flags[0x1C] = left_edge;
                slot_flags[0x13] = left_slot;
                slot_flags[0x15] = right_slot;
                break;
            }
            case 2:
                slot_flags[0x1C] |= 2;
                slot_flags[0x13] |= 0xA;
                break;
            }
        }

        if (slot_index >= 3) {
            u8 *upper_slot_flags = (u8 *)formation + slot_index;

            upper_slot_flags[0x11] &= 3;
            switch (slot_index % 3) {
            case 0:
                upper_slot_flags[0x12] &= 0xB;
                break;
            case 1: {
                u8 right_slot = upper_slot_flags[0x12] & 0xB;
                u8 left_slot = upper_slot_flags[0x10] & 7;

                upper_slot_flags[0x12] = right_slot;
                upper_slot_flags[0x10] = left_slot;
                break;
            }
            case 2:
                upper_slot_flags[0x10] &= 7;
                break;
            }
        }
    }
}
