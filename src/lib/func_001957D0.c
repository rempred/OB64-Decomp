#include "common/syncprintf.h"
#include "game/character_record.h"
#include "game/character_template.h"
#include "game/scenario_source_record.h"

extern u8 g_func_001957D0_active_source_ids[];
extern u16 g_func_001957D0_special_slots[];
extern u16 g_func_001957D0_normal_slots[];
extern u16 g_func_001957D0_special_slot_seed;
extern u16 g_func_001957D0_normal_slot_seed;
extern u8 g_func_001957D0_special_slot_state[];
extern u8 g_func_001957D0_normal_slot_state[];
extern const char g_func_001957D0_record_error[];
extern const char g_func_001957D0_slot_error[];
extern void func_00023780(void *destination, int size);
extern u8 func_001957D0_finalize(Func001957D0SourceRecord *record);
/* Build the scenario source's member list from its packed character template. */
void func_001957D0(const CharacterTemplate *incoming_source, int source_index)
{
    const CharacterTemplate *source;
    u8 force_52_byte_pool_value;
    register u8 source_byte;
    u32 source_record_index;
    u8 second_class_id;
    u8 second_member_position;
    int main_character_index;
    int second_special_index;
    int second_character_index;
    int third_special_index;
    int scan_index;
    int member_index;
    int source_offset;
    u32 masked_source_index;
    int record_offset;
    int character_index_arg;
    int use_52_byte_main_pool;
    u8 force_52_byte_pool;
    u16 *normal_slots_or_source_index;
    u32 field_10_special_slots;
    u8 third_class_id;
    u16 *slot_cursor;
    Func001957D0SourceRecord *source_record;
    /* The packed-field read form retains KMC register allocation in the slot loops. */
    u32 source_work;
    source_byte = (u8)source_index;
    force_52_byte_pool_value = source_byte >> 7;
    force_52_byte_pool_value ^= 1;
    source_byte = source_byte < 30;
    source_byte ^= 1;
    source_byte = -source_byte;
    force_52_byte_pool_value &= source_byte;
    force_52_byte_pool = force_52_byte_pool_value;
    source_index &= 0x7F;
    masked_source_index = (s8)source_index;
    source_record_index = (u8)masked_source_index;
    source_record = &g_func_001957D0_source_records[source_record_index];
    g_func_001957D0_active_source_ids[source_record_index] = masked_source_index;
    {
        if (masked_source_index) {
            source_index++;
        } else {
            source_index++;
        }
        source_record->field_00 = source_index;
    }
    source = incoming_source;
    if (force_52_byte_pool != 0) {
        source_record->field_01 = 0x81;
    } else {
        source_record->field_01 = 1;
    }
    func_00023780(source_record->field_02, 5);
    use_52_byte_main_pool = masked_source_index >= 30;
    use_52_byte_main_pool |= force_52_byte_pool;
    /* Class byte +0x12 marks free rows in either character pool. */
    member_index = 0;
    if (use_52_byte_main_pool != 0) {
        scan_index = 1;
        record_offset = 52;
main_records_52:
        main_character_index = scan_index;
        if (((u8 *)g_func_0019554C_records_52)[record_offset + 0x12] == 0) {
            goto main_record_done;
        }
        scan_index++;
        record_offset += 52;
        if (scan_index < 100) {
            goto main_records_52;
        }
        main_character_index = -1;
        goto main_record_done;
    } else {
        scan_index = 1;
        record_offset = 56;
main_records_56:
        main_character_index = scan_index;
        if (((u8 *)g_func_0019554C_records_56)[record_offset + 0x12] == 0) {
            goto main_record_done;
        }
        scan_index++;
        record_offset += 56;
        if (scan_index < 100) {
            goto main_records_56;
        }
        main_character_index = -1;
    }
    {
    u32 source_index_arg;
    int special_pool;
    const CharacterTemplate *call_source;
main_record_done:
    if (main_character_index < 0) {
        func_00023940(g_func_001957D0_record_error);
        character_index_arg = main_character_index;
        call_source = source;
    } else {
        character_index_arg = main_character_index;
        call_source = source;
    }
    source_index_arg = (u8)masked_source_index;
    special_pool = force_52_byte_pool;
    func_0019554C(
        character_index_arg,
        call_source,
        0,
        special_pool,
        source_index_arg);
    {
        u8 main_member_position;
        u8 *member_entry;
        member_entry = (u8 *)source_record + member_index;
        member_entry[2] = main_character_index;
        main_member_position = ((u8 *)source)[6];
        member_entry[7] = main_member_position - 1;
        second_class_id = ((u8 *)source)[7];
    }
    member_index++;
    /* Template class 1 uses separate pool entries with member IDs starting at 100. */
    if (second_class_id == 1) {
        register u16 *special_slot_base;
        int pool_compare;
        source_offset = 0;
        pool_compare = source_index_arg < 30;
        pool_compare ^= 1;
        special_pool |= pool_compare;
        special_slot_base = g_func_001957D0_special_slots;
        normal_slots_or_source_index = g_func_001957D0_normal_slots;
        source_work = (u32)source;
field_07_slot_outer:
        if (((CharacterTemplate *)source_work)->field_0D[0] != 0) {
            scan_index = 0;
            if (special_pool != 0) {
                switch (member_index) {
                case 0:
                    slot_cursor = special_slot_base;
                    break;
                case 1:
                    slot_cursor = special_slot_base;
                    break;
                default:
                    slot_cursor = special_slot_base;
                    break;
                }
field_07_special_slot_scan:
                second_special_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_07_slot_scan_done;
                }
                scan_index++;
                slot_cursor++;
                if (scan_index < 120) {
                    goto field_07_special_slot_scan;
                }
                second_special_index = -1;
                goto field_07_slot_scan_done;
            } else {
                slot_cursor = normal_slots_or_source_index;
field_07_normal_slot_scan:
                second_special_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_07_slot_scan_done;
                }
                scan_index++;
                slot_cursor++;
                if (scan_index < 120) {
                    goto field_07_normal_slot_scan;
                }
                second_special_index = -1;
            }
field_07_slot_scan_done:
            if (second_special_index < 0) {
                func_00023940(g_func_001957D0_slot_error);
            }
            if (special_pool != 0) {
                special_slot_base[second_special_index] = g_func_001957D0_special_slot_seed;
                g_func_001957D0_special_slot_state[second_special_index] = 0;
            } else {
                normal_slots_or_source_index[second_special_index] = g_func_001957D0_normal_slot_seed;
                g_func_001957D0_normal_slot_state[second_special_index] = 0;
            }
            {
                u8 *member_entry;
                member_entry = (u8 *)source_record + member_index;
                member_index++;
                member_entry[2] = second_special_index + 100;
                member_entry[7] =
                    ((CharacterTemplate *)source_work)->field_0D[0] - 1;
                source_offset++;
            }
            source_work++;
            if (source_offset < 3) {
                goto field_07_slot_outer;
            }
        }
    } else if (second_class_id != 0) {
        int pool_compare;
        source_offset = 0;
        normal_slots_or_source_index = (u16 *)source_index_arg;
        pool_compare = source_index_arg < 30;
        pool_compare ^= 1;
        special_pool |= pool_compare;
        source_work = (u32)source;
field_07_record_outer:
        if (((CharacterTemplate *)source_work)->field_0D[0] != 0) {
            scan_index = 1;
            if (special_pool != 0) {
                record_offset = 52;
field_07_records_52:
                second_character_index = scan_index;
                if (((u8 *)g_func_0019554C_records_52)[record_offset + 0x12] == 0) {
                    goto field_07_record_scan_done;
                }
                scan_index++;
                record_offset += 52;
                if (scan_index < 100) {
                    goto field_07_records_52;
                }
                second_character_index = -1;
                goto field_07_record_scan_done;
            } else {
                record_offset = 56;
field_07_records_56:
                second_character_index = scan_index;
                if (((u8 *)g_func_0019554C_records_56)[record_offset + 0x12] == 0) {
                    goto field_07_record_scan_done;
                }
                scan_index++;
                record_offset += 56;
                if (scan_index < 100) {
                    goto field_07_records_56;
                }
                second_character_index = -1;
            }
field_07_record_scan_done:
            {
            int helper_flag;
            if (second_character_index < 0) {
                func_00023940(g_func_001957D0_record_error);
                scan_index = second_character_index;
                helper_flag = force_52_byte_pool;
            } else {
                scan_index = second_character_index;
                helper_flag = force_52_byte_pool;
            }
            func_0019554C(
                scan_index,
                source,
                1,
                helper_flag,
                (u32)normal_slots_or_source_index);
            }
            {
                slot_cursor =
                    (u16 *)((u8 *)source_record + member_index);
                member_index++;
                ((u8 *)slot_cursor)[2] = second_character_index;
                second_member_position =
                    ((CharacterTemplate *)source_work)->field_0D[0];
                if (normal_slots_or_source_index) {
                    source_offset++;
                } else {
                    source_offset++;
                }
                ((u8 *)slot_cursor)[7] = second_member_position - 1;
            }
            source_work++;
            if (source_offset < 3) {
                goto field_07_record_outer;
            }
        }
    }
    }
    third_class_id = source->third_class_id;
    if (third_class_id == 1) {
        int slot_compare;
        int slot_special;
        u32 normal_slot_base;
        u8 *member_entry;
        slot_compare = masked_source_index < 30;
        slot_compare ^= 1;
        slot_special = force_52_byte_pool || slot_compare;
        field_10_special_slots = (u32)g_func_001957D0_special_slots;
        normal_slot_base = (u32)g_func_001957D0_normal_slots;
        source_work = (u32)source;
field_10_slot_outer:
        if (((CharacterTemplate *)source_work)->field_16[0] != 0) {
            scan_index = 0;
            if (slot_special != 0) {
                slot_cursor = (u16 *)field_10_special_slots;
field_10_special_slot_scan:
                third_special_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_10_slot_scan_done;
                }
                scan_index++;
                slot_cursor++;
                if (scan_index < 120) {
                    goto field_10_special_slot_scan;
                }
                third_special_index = -1;
                goto field_10_slot_scan_done;
            } else {
                slot_cursor = (u16 *)normal_slot_base;
field_10_normal_slot_scan:
                third_special_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_10_slot_scan_done;
                }
                scan_index++;
                slot_cursor++;
                if (scan_index < 120) {
                    goto field_10_normal_slot_scan;
                }
                third_special_index = -1;
            }
field_10_slot_scan_done:
            if (third_special_index < 0) {
                func_00023940(g_func_001957D0_slot_error);
            }
            if (slot_special != 0) {
                ((u16 *)field_10_special_slots)[third_special_index] = g_func_001957D0_special_slot_seed;
                g_func_001957D0_special_slot_state[third_special_index] = 0;
            } else {
                ((u16 *)normal_slot_base)[third_special_index] = g_func_001957D0_normal_slot_seed;
                g_func_001957D0_normal_slot_state[third_special_index] = 0;
            }
            member_entry = (u8 *)source_record + member_index;
            member_entry[2] = third_special_index + 100;
            member_entry[7] =
                ((CharacterTemplate *)source_work)->field_16[0] - 1;
            source_work++;
            member_index++;
            if ((int)source_work < (int)((u32)source + 3)) {
                goto field_10_slot_outer;
            }
        }
    } else if (third_class_id != 0) {
        u32 second_source_index;
        int record_compare;
        int record_index;
        int record_special;
        second_source_index = (u8)masked_source_index;
        if (member_index) {
            record_compare = second_source_index < 30;
        } else {
            record_compare = second_source_index < 30;
        }
        record_compare ^= 1;
        source_work = (u32)source;
        record_special = force_52_byte_pool | record_compare;
field_10_record_outer:
        if (((CharacterTemplate *)source_work)->field_16[0] != 0) {
            scan_index = 1;
            if (record_special != 0) {
                record_offset = 52;
field_10_records_52:
                if (((u8 *)g_func_0019554C_records_52)[record_offset + 0x12] == 0) {
                    record_index = scan_index;
                    goto field_10_record_scan_done;
                }
                record_index = scan_index++;
                record_offset += 52;
                if (scan_index < 100) {
                    goto field_10_records_52;
                }
                record_index = -1;
                goto field_10_record_scan_done;
            } else {
                record_offset = 56;
field_10_records_56:
                if (((u8 *)g_func_0019554C_records_56)[record_offset + 0x12] == 0) {
                    goto field_10_record_found_56;
                }
                record_index = scan_index++;
                record_offset += 56;
                if (scan_index < 100) {
                    goto field_10_records_56;
                }
                record_index = -1;
                goto field_10_record_scan_done;
field_10_record_found_56:
                record_index = scan_index;
            }
field_10_record_scan_done:
            {
            int helper_flag;
            if (record_index < 0) {
                func_00023940(g_func_001957D0_record_error);
                scan_index = record_index;
                helper_flag = force_52_byte_pool;
            } else {
                scan_index = record_index;
                helper_flag = force_52_byte_pool;
            }
            func_0019554C(
                scan_index,
                source,
                2,
                helper_flag,
                second_source_index);
            }
            {
                u8 *member_entry;
                member_entry = (u8 *)source_record + member_index;
                member_entry[2] = record_index;
                member_entry[7] =
                    ((CharacterTemplate *)source_work)->field_16[0] - 1;
                source_work++;
            }
            member_index++;
            if ((int)source_work < (int)((u32)source + 3)) {
                goto field_10_record_outer;
            }
        }
    }
    if (force_52_byte_pool == 0) {
        source_record->field_18 = func_001957D0_finalize(source_record);
    } else {
        source_record->field_18 = func_001957D0_finalize(source_record);
    }
    func_00023780(source_record->field_0D, 10);
}
