typedef unsigned char u8;
typedef unsigned short u16;
typedef struct {
    u8 pad[0x12];
    u8 secondary_class_id;
    u8 pad13[5];
    u16 hp;
    u8 tail[30];
} Record56;
typedef struct {
    u8 pad[0x12];
    u8 secondary_class_id;
    u8 pad13[5];
    u16 hp;
    u8 tail[26];
} Record52;
typedef struct {
    u8 field0;
    u8 field1;
    u8 members[5];
    u8 tail[18];
} Record25;

extern Record56 g_func_0019554C_records_56[];
extern Record52 g_func_0019554C_records_52[];
extern Record25 g_func_001957D0_source_records[];
extern u8 D_801F0BD8[];
extern u8 D_801F0C3C;
extern void func_80093380(void *, int);

/* Rebuild character marks for empty, zero-HP and assigned rows. */
void func_00128E80(void)
{
    int character_index;
    int member_slot;
    int member_index;
    int source_index;

    func_80093380(D_801F0BD8, 200);
    D_801F0BD8[0] |= 1;
    D_801F0C3C |= 1;
    for (character_index = 1; character_index < 100; character_index++) {
        if (g_func_0019554C_records_56[character_index].secondary_class_id == 0)
            D_801F0BD8[character_index] |= 1;
        if (g_func_0019554C_records_56[character_index].hp == 0)
            D_801F0BD8[character_index] |= 1;
    }
    for (character_index = 1; character_index < 100; character_index++) {
        if (g_func_0019554C_records_52[character_index].secondary_class_id == 0)
            /* This address form preserves the retail indexed symbol load. */
            (*(u8 *)((unsigned int)&D_801F0C3C + character_index)) |= 1;
        if (g_func_0019554C_records_52[character_index].hp == 0)
            (*(u8 *)((unsigned int)&D_801F0C3C + character_index)) |= 1;
    }
    for (source_index = 0; source_index < 50; source_index++) {
        if (g_func_001957D0_source_records[source_index].field1 & 1) {
            if (source_index < 30) {
                for (member_slot = 0; member_slot < 5; member_slot++) {
                    /* The pinned compiler needs the explicit second member read. */
                    member_index = g_func_001957D0_source_records[source_index].members[member_slot];
                    if (member_index != 0 && (member_index = g_func_001957D0_source_records[source_index].members[member_slot]) < 100)
                        D_801F0BD8[member_index] |= 1;
                }
            } else {
                for (member_slot = 0; member_slot < 5; member_slot++) {
                    member_index = g_func_001957D0_source_records[source_index].members[member_slot];
                    if (member_index != 0 && (member_index = g_func_001957D0_source_records[source_index].members[member_slot]) < 100)
                        (*(u8 *)((unsigned int)&D_801F0C3C + member_index)) |= 1;
                }
            }
        }
    }
}
