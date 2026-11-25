#include "game/character_record.h"
#include "game/class_field_lookups.h"
#include "game/scenario_source_record.h"

typedef struct InventoryEntry {
    u16 equipment_id;
    u8 equipped_count;
    u8 total_count;
} InventoryEntry;

extern InventoryEntry D_80196B00[];

extern u8 D_801974DE[];
extern EquipmentSelector table_0024b844[];
extern void bzero(void *destination, s32 size);
extern void memcpy_aligned(void *destination, const void *source, s32 size);
extern u8 func_8016BFC0(void);
extern u8 func_8016C048(void);
extern void func_8016C150(u8 index);
extern void func_8016C0C8(u8 index);
extern s32 func_8016B6FC(s32 equipment_id);

enum {
    SCENARIO_CHARACTER_LIMIT = 99,
    PLAYER_CHARACTER_LIMIT = 100,
    PLAYER_SQUAD_LIMIT = 30,
    SCENARIO_SQUAD_LIMIT = 50,
    SQUAD_MEMBER_COUNT = 5,
    SQUAD_ACTIVE_FLAG = 1,
    SQUAD_TAIL_OFFSET = 0x0D,
    INVENTORY_CAPACITY = 0x116,
    INVENTORY_COUNT_LIMIT = 99,
    EQUIPMENT_SLOT_COUNT = 4
};

/* Transfer the scenario squad containing the requested class to the player army. */
u16 func_00249D98(u16 primary_class_id)
{
    u32 player_squad_index = 0;
    u32 index = 0;
    u32 scenario_index;
    /* These working locals are reused as the transfer moves from rows to members. */
    u32 row_position;
    u32 slot;
    u8 *scenario_squad_bytes;
    Func001957D0SourceRecord *squad;
    Func001957D0SourceRecord *destination_squad;
    u16 free_character_indices[SQUAD_MEMBER_COUNT];
    u32 scan_offset;
    u32 next_free_index_address;
    u32 scenario_squad_offset;
    u32 destination_offset;
    u32 source_tail_address;
    u32 squad_table_address;
    EquipmentSelector *equipment_selectors;
    InventoryEntry *inventory;
    u32 one;

    for (; index < SCENARIO_CHARACTER_LIMIT; index++) {
        if (D_80195560[index].primary_class_id == primary_class_id) {
            break;
        }
    }
    scenario_index = PLAYER_SQUAD_LIMIT;
    if (index == SCENARIO_CHARACTER_LIMIT) {
        return 0xFFFF;
    }

    scenario_squad_bytes = D_801974DE;
    for (; scenario_index < SCENARIO_SQUAD_LIMIT; scenario_index++) {
        squad = (Func001957D0SourceRecord *)scenario_squad_bytes;

        for (slot = 0; slot < SQUAD_MEMBER_COUNT; slot++) {
            if (squad->field_02[slot] == index) {
                break;
            }
        }
        if (slot < SQUAD_MEMBER_COUNT) {
            break;
        }
        scenario_squad_bytes += sizeof(*squad);
    }
    if (scenario_index == SCENARIO_SQUAD_LIMIT) {
        return 0xFFFF;
    }
    row_position = scenario_index;

    for (scenario_index = 0; scenario_index < PLAYER_SQUAD_LIMIT; scenario_index++) {
        if ((g_func_001957D0_source_records[scenario_index].field_01 & SQUAD_ACTIVE_FLAG) == 0) {
            player_squad_index = scenario_index;
            break;
        }
    }
    slot = 0;
    if (scenario_index == PLAYER_SQUAD_LIMIT) {
        return (u16)row_position;
    }

    /* The retail code iterates over the five member positions here. */
    do {
        ++slot;
    } while (slot < SQUAD_MEMBER_COUNT);

    slot = 0;
    index = 0;
    scan_offset = 0;
    /* The retail scan advances through every empty row and stores only the first five. */
    next_free_index_address = (u32)free_character_indices;
    for (; index < PLAYER_CHARACTER_LIMIT; index++, scan_offset += sizeof(CharacterRecord56)) {
        if (((CharacterRecord56 *)((u8 *)D_80193BC0 + scan_offset))->record.primary_class_id == 0) {
            if (slot < SQUAD_MEMBER_COUNT) {
                *(u16 *)next_free_index_address = index;
            }
            next_free_index_address += sizeof(u16);
            slot++;
        }
    }

    slot = func_8016BFC0();
    scenario_squad_offset = row_position * sizeof(*squad);
    source_tail_address = (u32)g_func_001957D0_source_records[0].field_0D;
    bzero((void *)(source_tail_address + scenario_squad_offset), sizeof(squad->field_0D));
    /* Separate byte offsets recover the compiler's allocation across the copy. */
    destination_offset = player_squad_index * sizeof(*squad);
    squad_table_address = source_tail_address - SQUAD_TAIL_OFFSET;
    destination_squad = (Func001957D0SourceRecord *)(destination_offset + squad_table_address);
    memcpy_aligned(destination_squad, (void *)(scenario_squad_offset + squad_table_address),
                   sizeof(*destination_squad));
    squad = destination_squad;
    squad->field_00 = slot;
    func_8016C150((u8)player_squad_index);

    index = 0;
    /* Class 1 skips equipment processing. A newly added stock item starts at one. */
    one = 1;
    equipment_selectors = table_0024b844;
    inventory = D_80196B00;
    for (; index < SQUAD_MEMBER_COUNT; index++) {
        u16 *new_index;
        u32 free_index_offset;
        CharacterRecord56 *character;

        row_position = (u32)((u8 *)squad + index);

        if (((Func001957D0SourceRecord *)row_position)->field_02[0] == 0) {
            continue;
        }
        free_index_offset = index * sizeof(*new_index);
        new_index = (u16 *)(free_index_offset + (u32)free_character_indices);
        character = &D_80193BC0[*new_index];
        bzero(character, sizeof(*character));
        slot = func_8016C048();
        memcpy_aligned(character,
                       &D_80195560[((Func001957D0SourceRecord *)row_position)->field_02[0]],
                       sizeof(CharacterRecord));
        character->field_34 = slot;
        ((Func001957D0SourceRecord *)row_position)->field_02[0] = *new_index;
        func_8016C0C8((u8)*new_index);

        if (character->record.primary_class_id == one) {
            continue;
        }

        row_position = (u32)&character->record.equipment_slot_0;
        slot = 0;
        do {
            u32 equipment_id;
            u32 inventory_index;
            u32 total_count;
            u32 override_id;

            equipment_id = equipment_selectors[(u16)slot](character->record.primary_class_id,
                                                           character->record.secondary_class_id);
            if ((u16)equipment_id == 0) {
                goto next_equipment;
            }

            inventory_index = func_8016B6FC((u16)equipment_id);
            if ((u16)inventory_index < INVENTORY_CAPACITY) {
                u32 inventory_offset = (u16)inventory_index * sizeof(*inventory);
                total_count = ((InventoryEntry *)((u32)D_80196B00 + inventory_offset))->total_count;
                if (total_count < INVENTORY_COUNT_LIMIT) {
                    u32 updated_total = total_count;
                    InventoryEntry *entry;

                    updated_total++;
                    entry = (InventoryEntry *)(inventory_offset + (u32)inventory);
                    entry->total_count = updated_total;
                }
            } else {
                for (inventory_index = 0; (u16)inventory_index < INVENTORY_CAPACITY; inventory_index++) {
                    if (D_80196B00[(u16)inventory_index].equipment_id == 0) {
                        D_80196B00[(u16)inventory_index].equipment_id = equipment_id;
                        D_80196B00[(u16)inventory_index].total_count = one;
                        break;
                    }
                }
            }

            if ((u16)equipment_id == *(u16 *)row_position) {
                *(u16 *)row_position = 0;
            }
            override_id = *(u16 *)row_position;
            if ((u16)override_id == 0) {
                goto next_equipment;
            }

            equipment_id = override_id;
            inventory_index = func_8016B6FC((u16)override_id);
            if ((u16)inventory_index < INVENTORY_CAPACITY) {
                u32 inventory_offset = (u16)inventory_index * sizeof(*inventory);
                InventoryEntry *entry;

                total_count = ((InventoryEntry *)((u32)D_80196B00 + inventory_offset))->total_count;
                if (total_count < INVENTORY_COUNT_LIMIT) {
                    entry = (InventoryEntry *)(inventory_offset + (u32)inventory);
                    total_count++;
                    entry->total_count = total_count;
                }
            } else {
                for (inventory_index = 0; (u16)inventory_index < INVENTORY_CAPACITY; inventory_index++) {
                    if (D_80196B00[(u16)inventory_index].equipment_id == 0) {
                        D_80196B00[(u16)inventory_index].equipment_id = equipment_id;
                        D_80196B00[(u16)inventory_index].total_count = one;
                        break;
                    }
                }
            }
next_equipment:
            slot++;
            row_position += sizeof(u16);
        } while ((u16)slot < EQUIPMENT_SLOT_COUNT);
    }
    return 0;
}

