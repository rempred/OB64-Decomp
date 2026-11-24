typedef unsigned char u8;
typedef struct { u8 bytes[56]; } Record56;
typedef struct BitRecordSet BitRecordSet;

extern Record56 g_func_0019554C_records_56[];
extern BitRecordSet D_80187444;
extern void boot_bitstream_descriptor_encode(u8 *buffer, BitRecordSet *set);
extern void *func_00001330(unsigned int size);
extern void *func_000016C4(void *pointer);
extern void func_00023460(void *source, void *destination, int size);
extern void func_00050918(u8 *bytes, u8 *record);
extern void func_8016BA10(int value);

/* Encode the 56-byte character table, then restore the live names. */
void func_00042e64(void *save_buffer)
{
    u8 **saved_names;
    int record_index;

    func_8016BA10(0);
    saved_names = func_00001330(100 * sizeof(*saved_names));
    for (record_index = 0; record_index < 100; record_index++) {
        saved_names[record_index] = func_00001330(16);
        func_00023460(&g_func_0019554C_records_56[record_index], saved_names[record_index], 16);
        func_00050918(saved_names[record_index], g_func_0019554C_records_56[record_index].bytes);
    }
    boot_bitstream_descriptor_encode(save_buffer, &D_80187444);
    for (record_index = 0; record_index < 100; record_index++) {
        func_00023460(saved_names[record_index], &g_func_0019554C_records_56[record_index], 16);
        func_000016C4(saved_names[record_index]);
    }
    func_000016C4(saved_names);
    func_8016BA10(1);
}
