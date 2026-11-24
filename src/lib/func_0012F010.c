typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

typedef struct { u8 bytes[25]; } SourceRecord25;
extern SourceRecord25 g_func_001957D0_source_records[];
extern u16 D_8019532C[];
extern u16 D_80190EBC[];
extern u8 D_80195480[];
extern u8 D_80191010[];
extern u16 D_80195578[][26];
extern u16 D_80193BD8[][28];
extern u8 D_80195593[][52];
extern u8 D_80193BF3[][56];

/* Check status bit 2 for each occupied member with nonzero HP. */
s32 func_0012F010(s32 squad_source_index)
{
    s32 uses_army_roster = squad_source_index < 30;
    u8 *member_slots = g_func_001957D0_source_records[squad_source_index].bytes + 2;
    s32 member_slot;
    for (member_slot = 0; member_slot < 5; member_slot++) {
        s32 member_index = member_slots[member_slot];
        s32 status_flags;
        if (member_index == 0) {
            continue;
        }
        if (member_index >= 100) {
            if (!uses_army_roster) {
                if (D_8019532C[member_index] == 0) {
                    continue;
                }
                status_flags = D_80195480[member_index];
            } else {
                if (D_80190EBC[member_index] == 0) {
                    continue;
                }
                status_flags = D_80191010[member_index];
            }
        } else {
            if (!uses_army_roster) {
                if (D_80195578[member_index][0] == 0) {
                    continue;
                }
                status_flags = D_80195593[member_index][0];
            } else {
                if (D_80193BD8[member_index][0] == 0) {
                    continue;
                }
                status_flags = D_80193BF3[member_index][0];
            }
        }
        if (!(status_flags & 4)) {
            return 0;
        }
    }
    return 1;
}
