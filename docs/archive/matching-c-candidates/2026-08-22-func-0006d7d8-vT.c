typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;

typedef struct Func0006d7d8ClassRecord {
    u8 field_00[0x11];
    u8 field_11;
    u8 field_12;
} Func0006d7d8ClassRecord;

typedef struct Func0006D7D8Scratch {
    u8 movement_bytes[5];
    u8 unknown_05[7];
    u8 *movement_start;
    u8 unknown_10[8];
} Func0006D7D8Scratch;

extern u8 g_func_001957D0_source_records[];
extern u8 g_func_0019554C_records_56[];
extern u8 g_func_0006d7d8_value_f81;

extern u8 func_00043AD8(u8 a, u8 b);
extern u8 func_00040F88(u8 a, u8 b, u8 c, u8 d, u8 e);

void func_0006d7d8(u8 *pairs, s32 count)
{
    Func0006D7D8Scratch scratch;
    u8 *movement_cursor;
    u8 *pair_cursor;
    u8 *source_pair;
    u8 *cell_cursor;
    u8 *cell_base;
    u8 *char_slot_base;
    Func0006d7d8ClassRecord *class_record;
    u32 class_index;
    s32 index;
    u32 slot;
    u32 record_offset;

    index = 0;
    if (count <= 0) {
        return;
    }
    scratch.movement_start = scratch.movement_bytes;
    record_offset = 0;
    char_slot_base = &g_func_001957D0_source_records[2];
    cell_base = char_slot_base + 5;
    pair_cursor = pairs;
    do {
        slot = 0;
        movement_cursor = scratch.movement_start;
        source_pair = pair_cursor;
        cell_cursor = cell_base;
        g_func_001957D0_source_records[record_offset] = index + 1;
        g_func_001957D0_source_records[record_offset + 1] = 1;
        do {
            if (source_pair[0] == 0) {
                *movement_cursor = 0;
                goto advance;
            }
            if (source_pair[0] >= 100) {
                g_func_0006d7d8_value_f81 -= 3;
            }
            g_func_001957D0_source_records[record_offset + slot + 2] = source_pair[0];
            *cell_cursor = source_pair[1];
            class_index = source_pair[0];
            class_index &= -(class_index < 100);
            class_record = (Func0006d7d8ClassRecord *)&g_func_0019554C_records_56[class_index * 56];
            *movement_cursor = func_00043AD8(class_record->field_11, class_record->field_12);
advance:
            movement_cursor++;
            source_pair += 2;
            cell_cursor++;
            slot++;
        } while (slot < 5);
        cell_base += 25;
        pair_cursor += 10;
        index++;
        g_func_001957D0_source_records[record_offset + 0x18] =
            func_00040F88(scratch.movement_bytes[0], scratch.movement_bytes[1],
                          scratch.movement_bytes[2], scratch.movement_bytes[3],
                          scratch.movement_bytes[4]);
        record_offset += 25;
    } while (index < count);
}
