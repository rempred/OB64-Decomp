#include "game/character_record.h"

typedef struct BitRecordSet BitRecordSet;

extern BitRecordSet D_80187618;
extern void boot_bitstream_descriptor_decode(u8 *buffer, BitRecordSet *set);
extern void *func_00001330(unsigned int size);
extern void *func_000016C4(void *pointer);
extern void func_00023460(void *source, void *destination, int size);
extern void func_80093380(void *destination, int size);
extern void func_000509f4(u8 *bytes, u8 *output);

void func_00042f68(u8 *buffer)
{
    u8 *bytes;
    int i;
    CharacterRecord *record;

    record = g_func_0019554C_records_52;
    func_80093380(record, 100 * sizeof(*record));
    boot_bitstream_descriptor_decode(buffer, &D_80187618);
    bytes = func_00001330(16);
    for (i = 0; i < 100; i++, record++) {
        func_00023460(record, bytes, 16);
        func_000509f4(bytes, record->field_00);
    }
    func_000016C4(bytes);
}
