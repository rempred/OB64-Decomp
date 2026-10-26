typedef unsigned char u8;
typedef struct { u8 bytes[56]; } Record56;
typedef struct BitRecordSet BitRecordSet;

extern Record56 g_func_0019554C_records_56[];
extern BitRecordSet D_80187444;
extern void boot_bitstream_descriptor_encode(u8 *buffer, BitRecordSet *set);
extern void *func_00001330(int size);
extern void func_000016C4(void *pointer);
extern void func_00023460(void *source, void *destination, int size);
extern void func_00050918(u8 *bytes, void *record);
extern void func_8016BA10(int value);

void func_00042e64(u8 *buffer)
{
    u8 **saved;
    u8 **slot;
    int i;
    Record56 *record;

    func_8016BA10(0);
    saved = func_00001330(100 * sizeof(*saved));
    for (i = 0, slot = saved, record = g_func_0019554C_records_56; i < 100; slot++, record++, i++) {
        *slot = func_00001330(16);
        func_00023460(record, *slot, 16);
        func_00050918(*slot, record);
    }
    boot_bitstream_descriptor_encode(buffer, &D_80187444);
    for (i = 0, slot = saved, record = g_func_0019554C_records_56; i < 100; i++) {
        func_00023460(*slot, record, 16);
        record++;
        func_000016C4(*slot);
        slot++;
    }
    func_000016C4(saved);
    func_8016BA10(1);
}
