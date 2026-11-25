#include "game/battle_recruitment.h"
#include "game/battle_roster_side_one.h"
#include "game/battle_roster_types.h"
#include "game/character_record.h"
#include "game/class_field_lookups.h"

typedef struct InventoryEntry {
    u16 equipment_id;
    u8 equipped_count;
    u8 total_count;
} InventoryEntry;

extern InventoryEntry D_80196B00[];

extern void bzero(void *destination, s32 size);
extern void bcopy(const void *source, void *destination, s32 size);
extern u8 func_8016C048(void);
extern void func_8016C0C8(u8 index);
extern s32 func_8016B6FC(s32 equipment_id);

enum {
    CHARACTER_TABLE_CAPACITY = 100,
    INVENTORY_CAPACITY = 0x116,
    INVENTORY_COUNT_LIMIT = 99
};

/* Copy the first side-one actor's scenario member into the player army. */
void func_002142C4(void)
{
    BattleRosterRecord *actor = (BattleRosterRecord *)battle_roster_find_first_side_one();
    CharacterRecord56 *destination;
    InventoryEntry *inventory;
    u16 equipment[4];
    u16 *equipment_slots;
    u32 slot;
    s32 index;
    s32 destination_index;
    u8 class_id;
    u32 default_equipment;

    for (index = 1; index < CHARACTER_TABLE_CAPACITY; index++) {
        if (D_80193BC0[index].record.primary_class_id == 0) {
            destination_index = index;
            goto found_destination;
        }
    }
    destination_index = 0;

found_destination:
    destination = &D_80193BC0[destination_index];
    bzero(destination, sizeof(*destination));
    bcopy(&D_80195560[actor->member_index], destination, sizeof(CharacterRecord));
    D_80193BC0[destination_index].field_34 = func_8016C048();
    func_8016C0C8((u8)destination_index);

    equipment[0] = actor->equipment_slot_0;
    equipment[1] = actor->equipment_slot_1;
    equipment[2] = actor->equipment_slot_2;
    equipment[3] = actor->equipment_slot_3;

    class_id = actor->secondary_class_id.bytes.low;
    default_equipment = D_8016DF88(class_id, class_id);
    if (equipment[0] == (u16)default_equipment) {
        D_80193BC0[destination_index].record.equipment_slot_0 = 0;
    }
    class_id = actor->secondary_class_id.bytes.low;
    default_equipment = D_8016DFDC(class_id, class_id);
    if (equipment[1] == (u16)default_equipment) {
        D_80193BC0[destination_index].record.equipment_slot_1 = 0;
    }
    class_id = actor->secondary_class_id.bytes.low;
    default_equipment = D_8016E030(class_id, class_id);
    if (equipment[2] == (u16)default_equipment) {
        D_80193BC0[destination_index].record.equipment_slot_2 = 0;
    }
    class_id = actor->secondary_class_id.bytes.low;
    default_equipment = D_8016E084(class_id, class_id);
    /* KMC schedules the loop initializer in the final comparison's delay slot. */
    slot = 0;
    if (equipment[3] == (u16)default_equipment) {
        D_80193BC0[destination_index].record.equipment_slot_3 = 0;
    }

    equipment_slots = equipment;
    inventory = D_80196B00;
    for (; (u16)slot < 4; slot++) {
        u16 equipment_id = equipment_slots[(u16)slot];
        u32 inventory_index;
        if (equipment_id == 0) {
            continue;
        }

        inventory_index = func_8016B6FC(equipment_id);
        if ((u16)inventory_index < INVENTORY_CAPACITY) {
            InventoryEntry *equipped_entry;
            u32 total_count;

            total_count = D_80196B00[(u16)inventory_index].total_count;
            if (total_count < INVENTORY_COUNT_LIMIT) {
                u32 updated_total = total_count;

                /* Keep the checked total separate from the value written. */
                updated_total++;
                inventory[(u16)inventory_index].total_count = updated_total;
            }
            /* The index-first address preserves the retail ADDU operand order. */
            equipped_entry = (InventoryEntry *)((u16)inventory_index * sizeof(*equipped_entry)
                                               + (u32)inventory);
            equipped_entry->equipped_count =
                D_80196B00[(u16)inventory_index].equipped_count + 1;
        } else {
            for (inventory_index = 0; (u16)inventory_index < INVENTORY_CAPACITY; inventory_index++) {
                if (D_80196B00[(u16)inventory_index].equipment_id == 0) {
                    u16 added_equipment = equipment_slots[(u16)slot];
                    D_80196B00[(u16)inventory_index].total_count = 1;
                    D_80196B00[(u16)inventory_index].equipped_count = 1;
                    D_80196B00[(u16)inventory_index].equipment_id = added_equipment;
                    break;
                }
            }
        }
    }
}

