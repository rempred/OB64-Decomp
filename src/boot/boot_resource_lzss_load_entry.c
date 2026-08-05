typedef unsigned char u8;
typedef unsigned int u32;

typedef struct BootResourceRecord {
    u32 field_00;
    void *field_04;
    u8 field_08;
    u8 pad_09[3];
    void *field_0C;
    void *field_10;
} BootResourceRecord;

extern void func_00023AE0(const u8 *table, BootResourceRecord **record, u32 mode);
extern void func_0000A510(void *field_10, void *field_0C);
extern void func_00023C10(void *field_04, BootResourceRecord *record, u32 mode);
extern void func_00023940(const u8 *message);

extern const u8 g_boot_resource_lzss_table[];
extern const u8 g_boot_resource_lzss_error_anchor[];

void func_0000B030(void)
{
    BootResourceRecord *record_storage;
    register BootResourceRecord *record asm("$2");
    BootResourceRecord *record_after;
    register u32 status asm("$5");

    record_storage = 0;
    for (;;) {
        func_00023AE0(g_boot_resource_lzss_table, &record_storage, 1);
        record = record_storage;
        status = record->field_08;
        if (status == 1) {
            func_0000A510(record->field_10, record->field_0C);
            record_after = record_storage;
            func_00023C10(record_after->field_04, record_after, 1);
        } else {
            func_00023940(g_boot_resource_lzss_error_anchor - 0x1FC8);
        }
    }
}
