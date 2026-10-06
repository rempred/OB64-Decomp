#include "common/types.h"

typedef void (*ProbeCallback)(void *);
typedef struct ProbeRecord {
    u32 field00;
    u32 field04;
    u32 field08;
    u32 field0C;
} ProbeRecord;

extern void *func_00001330(u32 bytes);
extern void func_000016C4(void *record);
extern void func_00023780(void *record, u32 bytes);
extern void func_00023940(const char *format, ...);
extern void func_0000553C(void);
extern void func_8016CDF4(void *record);
extern void func_00005D9C(s32 id, void *record);
extern void func_00005CFC(void *record);
extern void func_00005B8C(s32 id, void *record);
extern void func_00004FF0(u32 key);
extern u8 g_boot_resource_probe_table_anchor[];

void boot_resource_probe_dispatch_prepare(s32 id)
{
    ProbeRecord *small;
    ProbeRecord *record;
    u32 generation;
    s32 count;
    s32 tableOffset;
    ProbeCallback callback;

    if (id == 15) {
        func_0000553C();
    } else if (id == 14) {
        small = func_00001330(0x10);
        func_00023780(small, 0x10);
        func_8016CDF4(&small->field0C);
        func_00005D9C(14, small);
        func_00005CFC(small);
        func_000016C4(small);
    } else if (id < 2) {
        record = func_00001330(0x1850);
        generation = record->field0C + 1;
        func_00023780(record, 0x1850);
        record->field0C = generation;
        if (generation == 0) {
            record->field0C = -1;
        }
        count = 0;
        tableOffset = 0;
        do {
            callback = *(ProbeCallback *)(g_boot_resource_probe_table_anchor + tableOffset - 0x7DAC);
            if (callback != 0) {
                callback((u8 *)record + (*(s32 *)(g_boot_resource_probe_table_anchor + tableOffset - 0x7DA8) + 0xC));
            }
            count++;
            tableOffset += 0x1C;
        } while (count < 13);
        func_00005D9C(id, record);
        func_00005B8C(id, record);
        func_000016C4(record);
    } else {
        func_00023940((const char *)g_boot_resource_probe_table_anchor - 0x20F8, id);
        for (;;) {
        }
    }
    func_00004FF0(0x37081383);
}
