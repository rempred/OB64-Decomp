typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;

extern u8 g_data_801969B9[];
extern u8 g_data_801969BA[];
extern u8 g_data_801971F1[];
extern u8 g_data_801971F2[];

void func_00048510(s32 arg0)
{
    short saved_unit_index = 0;
    short outer_index = 0;
    short slot;
    short search_key;
    int row_offset;
    u8 *row_members;
    u8 *row_formation;
    u8 *member_ptr;
    u8 record_flags;
    u8 *group_members;
    u8 *group_members_next;
    int member_offset;
    u8 *desc_members;
    u8 *key_ptr;
    u8 group_flags;
    u8 shifted_byte;
    u8 target_id;
    u8 *member_ids;
    u8 *formation_ids;

    target_id = arg0;
    member_ids = g_data_801971F2;
    formation_ids = member_ids + 5;
    do {
        slot = 0;
        row_offset = outer_index * 25;
        row_members = row_offset + member_ids;
        row_formation = row_offset + formation_ids;
        do {
            member_ptr = row_members + slot;
            if (*member_ptr == target_id) {
                record_flags = g_data_801971F1[row_offset];
                g_data_801971F1[row_offset] = record_flags & 0xFB;
                if (slot != 0) {
                    *member_ptr = 0;
                    row_formation[slot] = 0;
                    return;
                }
                g_data_801971F1[row_offset] = record_flags & 0xFA;
                if (!(record_flags & 2)) {
                    return;
                }
                saved_unit_index = outer_index;
                break;
            }
            slot++;
        } while (slot < 5);
        slot = 0;
        outer_index++;
    } while (outer_index < 30);

    outer_index = 0;
    do {
        slot = 0;
        search_key = saved_unit_index;
        group_members = g_data_801969BA;
        group_members_next = group_members + 1;
        member_offset = outer_index * 11;
        desc_members = member_offset + group_members;
        do {
            key_ptr = desc_members + slot;
            if (*key_ptr == search_key) {
                group_flags = g_data_801969B9[member_offset];
                g_data_801969B9[member_offset] = group_flags & 0xFB;
                if (slot == 0) {
                    g_data_801969B9[member_offset] = group_flags & 0xFA;
                    return;
                }
                if (slot < 4) {
                    do {
                        shifted_byte = group_members_next[member_offset + slot];
                        desc_members[slot] = shifted_byte;
                        slot++;
                    } while (slot < 4);
                }
                desc_members[slot] = 0xFF;
                break;
            }
            slot++;
        } while (slot < 5);
        outer_index++;
    } while (outer_index < 6);
}
