#include "game/character_record.h"

typedef struct BitRecordSet BitRecordSet;

extern BitRecordSet D_80187444;
extern u8 D_80196A28[];
extern void boot_bitstream_descriptor_decode(u8 *buffer, BitRecordSet *set);
extern void *func_00001330(unsigned int size);
extern void *func_000016C4(void *pointer);
extern void func_00023460(void *source, void *destination, int size);
extern void func_000509f4(u8 *bytes, u8 *output);
extern void func_8016B774(void);
extern void func_8016BA10(int value);
extern void func_8016CC2C(void *value);

/* Decode the 56-byte character table from the save buffer and expand its names. */
void func_00042dc4(u8 *save_buffer)
{
    u8 *encoded_name;
    int record_index;
    CharacterRecord56 *record;

    boot_bitstream_descriptor_decode(save_buffer, &D_80187444);
    encoded_name = func_00001330(16);
    for (record_index = 0, record = g_func_0019554C_records_56; record_index < 100; record_index++, record++) {
        func_00023460(record, encoded_name, 16);
        func_000509f4(encoded_name, record->record.name);
    }
    func_000016C4(encoded_name);
    func_8016B774();
    func_8016BA10(1);
    func_8016CC2C(D_80196A28);
}
