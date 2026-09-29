typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

extern u8 D_8018F481;
extern u8 D_801E7E15[];
extern u16 *D_80219F20;

extern void *resource_alloc(u32 size);
extern void memset_00023780(void *destination, s32 size);
extern u8 *boot_command_stream_dispatch(u32 key, s32 mode, s32 submode, s32 index);
extern void boot_command_stream_resource_node_dispatch(u32 key, s32 mode, s32 submode);

#define READ_BE16(bytes) ((u16)(((u16)(bytes)[0] << 8) | (bytes)[1]))
#define READ_BE16_SUM(bytes) ((u16)(((u16)(bytes)[0] << 8) + (bytes)[1]))

void func_0019BE40(u32 site_index) {
    u8 *site_index_table;
    u8 *stronghold_records;
    u8 *shop_archive;
    u8 *shop_range;
    u16 *combined;
    u16 *equipment_output;
    u16 stronghold_index;
    u16 start_offset;
    u16 end_offset;
    u8 shop_index;
    s32 offset;

    {
        u16 *temporary_list = resource_alloc(0x200);
        D_80219F20 = temporary_list;
        memset_00023780(temporary_list, 0x200);
    }

    site_index_table = boot_command_stream_dispatch(0x021AF9F8, 2, -3,
                                                    D_801E7E15[12 * D_8018F481]);
    stronghold_records = boot_command_stream_dispatch(0x021AF9F8, 2, -3, 0);
    shop_archive = boot_command_stream_dispatch(0x021AF9F8, 2, -3, 60);

    ++site_index_table;
    stronghold_index = READ_BE16_SUM(&site_index_table[4 * site_index]) - 1;
    shop_index = stronghold_records[28 * stronghold_index + 27];
    shop_range = shop_archive + 2 * shop_index;
    start_offset = READ_BE16(shop_range);
    end_offset = READ_BE16(shop_range + 2);

    combined = D_80219F20;
    combined[0] = 1;
    combined[1] = 2;
    combined[2] = 3;
    combined[3] = 4;
    combined[4] = 5;
    combined[5] = 6;
    combined[6] = 8;

    equipment_output = combined + 7;
    for (offset = start_offset; offset < end_offset; offset += 2) {
        u16 item = (u16)shop_archive[offset] << 8;
        *equipment_output = item;
        item += shop_archive[offset + 1];
        *equipment_output++ = item | 0x8000;
    }

    boot_command_stream_resource_node_dispatch(0x021AF9F8, 2, -17);
}
