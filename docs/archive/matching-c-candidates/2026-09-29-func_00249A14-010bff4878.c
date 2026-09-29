typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

typedef struct ResourceArchiveInput {
    u32 field_00;
    u32 field_04;
    u8 *field_08;
    u32 field_0C;
} ResourceArchiveInput;

/* The two archive inputs and the transient 35-byte record occupy one frame. */
typedef struct ScenarioRecordScratch {
    u8 staged[0x28];
    u8 selected[8];
    u8 source_record[0x23];
    u8 gap_53[5];
    ResourceArchiveInput first;
    ResourceArchiveInput second;
    u8 gap_78[7];
    u8 apply_flag;
} ScenarioRecordScratch;

extern ResourceArchiveInput D_801D7C78;
extern u16 D_80187C42[][36];
extern void *func_0002DFB8(void *destination, u32 key);
extern u32 func_0002DEF4(u32 key);
extern void resource_free(void *resource);
extern void boot_resource_archive_load_many(ResourceArchiveInput *first,
                                            ResourceArchiveInput *second, s32 count);
extern void memcpy_aligned(void *destination, const void *source, s32 size);
extern void memset_00023780(void *destination, s32 size);
extern u8 func_000454c8(u16 selector);
extern u8 func_00249290(u8 slot, u8 *selected, s8 modifier, u32 option);
extern void func_002488D0(u8 *staged, u32 selector);

s32 func_00249A14(s32 record_index, s32 option, u8 apply_flag)
{
    u8 staged[0x28];
    u8 selected[8];
    u8 source_record[0x23];
    ResourceArchiveInput first, second;
    u8 apply_flag_copy;
    u32 *link;
    u32 inner_key;
    s32 group, member, slot_count, slot_index;

    first = D_801D7C78;
    second = D_801D7C78;
    apply_flag_copy = apply_flag;

    link = (u32 *)func_0002DFB8(0, 0x021AE74C);
    inner_key = *link;
    resource_free(link);
    first.field_0C = func_0002DEF4(inner_key);
    first.field_08 = (u8 *)func_0002DFB8(0, inner_key);
    second.field_04 = 0;
    boot_resource_archive_load_many(&first, &second, 1);
    resource_free(first.field_08);

    memcpy_aligned(source_record,
                   second.field_08 + record_index * 0x23, 0x23);
    resource_free(second.field_08);
    memset_00023780(staged, 0x28);

    staged[0] = source_record[0];
    staged[2] = source_record[1];
    *(u16 *)(staged + 4) =
        (source_record[2] << 8) + source_record[3];
    *(u16 *)(staged + 6) =
        (source_record[4] << 8) + source_record[5];
    staged[1] = source_record[6];

    slot_count = 1;
    for (group = 0; (u8)group < 2; group++) {
        const u8 *source_group = source_record + group * 9;
        for (member = 0; (u8)member < 3; member++) {
            u8 selector = source_group[13 + member];
            if (selector != 0) {
                u8 *slot = staged + ((u8)slot_count * 8);
                slot[0] = source_group[7];
                slot[2] = source_group[8];
                *(u16 *)(slot + 4) =
                    (source_group[9] << 8) + source_group[10];
                *(u16 *)(slot + 6) =
                    (source_group[11] << 8) + source_group[12];
                slot_count++;
                slot[1] = selector;
            }
        }
    }

    for (slot_index = 0; (u8)slot_index < (u8)slot_count; slot_index++) {
        u8 *slot = staged + ((u8)slot_index * 8);
        memset_00023780(selected, 8);
        for (member = 0; (u8)member < 2; member++) {
            u8 value = func_000454c8(*(u16 *)(slot + 4 + member * 2));
            s32 match = 0;
            if (func_000454c8(D_80187C42[slot[0]][0]) == value) {
                match = 1;
            } else if (func_000454c8(D_80187C42[slot[0]][1]) == value) {
                match = 2;
            } else if (func_000454c8(D_80187C42[slot[0]][2]) == value) {
                match = 3;
            } else if (func_000454c8(D_80187C42[slot[0]][3]) == value) {
                match = 4;
            }
            if (match != 0) {
                *(u16 *)(staged + 0x26 + match * 2) = *(u16 *)(slot + 4 + member * 2);
            }
        }
        slot[0] = func_00249290(slot[0], selected,
                                (s8)slot[2], (u8)option);
    }

    if (apply_flag_copy != 0) {
        func_002488D0(staged, 0xFF);
    }
    return 0;
}
