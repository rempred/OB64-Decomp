typedef unsigned char u8;

typedef struct Func001957D0SourceRecord {
    u8 field_00;
    u8 field_01;
    u8 field_02[5];
    u8 field_07[5];
    u8 field_0C;
    u8 field_0D[10];
    u8 field_17;
    u8 field_18;
} Func001957D0SourceRecord;

extern Func001957D0SourceRecord g_func_001957D0_source_records[];
extern void func_00023780(void *destination, int size);

void func_000490ec(void)
{
    u8 *descriptor;
    Func001957D0SourceRecord *record;
    u8 unit_index;
    u8 member_index;
    u8 pad_index;

    descriptor = (u8 *)g_func_001957D0_source_records - 0x838;
    func_00023780(descriptor, 11);
    for (unit_index = 0; unit_index < 30; unit_index++) {
        for (member_index = 0; member_index < 5; member_index++) {
            if (g_func_001957D0_source_records[0].field_02[member_index] == 1) {
                break;
            }
        }
        if (member_index < 5) {
            break;
        }
    }
    record = &g_func_001957D0_source_records[unit_index];
    for (pad_index = 0; pad_index < 5; pad_index++) {
    }
    descriptor[0] = 1;
    descriptor[1] = 1;
    descriptor[3] = 0xFF;
    descriptor[4] = 0xFF;
    descriptor[5] = 0xFF;
    descriptor[6] = 0xFF;
    descriptor[8] = 1;
    descriptor[9] = record->field_18;
    descriptor[10] = 0xA;
}
