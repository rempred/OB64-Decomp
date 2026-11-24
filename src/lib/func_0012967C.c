typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef struct { u8 bytes[25]; } Record25;
typedef struct { u8 pad[24]; u16 hp; u8 tail[26]; } Record52;
typedef struct { u8 pad[24]; u16 hp; u8 tail[30]; } Record56;
typedef struct { u8 bytes[192]; } Record192;

extern Record25 g_func_001957D0_source_records[];
extern Record52 g_func_0019554C_records_52[];
extern Record56 g_func_0019554C_records_56[];
extern Record192 D_801F1080[];
extern u16 D_8019532C[];
extern u16 D_80190EBC[];
extern void func_80093380(void *, int);
extern int func_00129068(u8 *);

#define WORD(p, o) (*(u32 *)((p) + (o)))

/* Seed a runtime unit from its source record and check its members' HP. */
void func_0012967C(int squad_source_index)
{
    u8 *source_record;
    u8 *object;
    u32 flags = 0;
    int has_member_with_hp;
    int first_member_unavailable;
    int uses_scenario_roster;
    int member_slot;
    int member_index;
    int member_hp;
    u8 *member_entry;

    source_record = g_func_001957D0_source_records[squad_source_index].bytes;
    source_record[1] &= 0xFB;
    object = D_801F1080[squad_source_index].bytes;
    func_80093380(object, 192);
    has_member_with_hp = 0;
    first_member_unavailable = 0;
    uses_scenario_roster = squad_source_index >= 30;
    if (source_record[1] & 1) {
        for (member_slot = 0; member_slot < 5; member_slot++) {
            member_entry = source_record + member_slot;
            member_index = member_entry[2];
            if (member_index != 0) {
                if (member_index >= 100) {
                    if (uses_scenario_roster)
                        member_hp = D_8019532C[member_index];
                    else
                        member_hp = D_80190EBC[member_index];
                    if (member_hp != 0)
                        has_member_with_hp = 1;
                    else
                        member_entry[2] = 0;
                } else {
                    if (uses_scenario_roster)
                        member_hp = g_func_0019554C_records_52[member_index].hp;
                    else
                        member_hp = g_func_0019554C_records_56[member_index].hp;
                    if (member_hp != 0)
                        has_member_with_hp = 1;
                }
                if ((member_slot == 0) && (has_member_with_hp == 0))
                    first_member_unavailable = 1;
            }
        }
    }
    if (has_member_with_hp)
        flags |= 0x10;
    if (!first_member_unavailable)
        flags |= 0x100;
    flags |= 0x40020;
    if (!(source_record[1] & 0x80))
        flags |= 8;
    else
        flags &= ~0x20;
    /* Retail performs these ordered field resets after clearing the full object. */
    WORD(object, 0) = flags;
    object[4] = squad_source_index;
    WORD(object, 0x8) = 0;
    WORD(object, 0xc) = 0;
    WORD(object, 0x10) = 0;
    WORD(object, 0x14) = 0;
    WORD(object, 0x18) = 0;
    WORD(object, 0x1c) = 0;
    object[0x20] = 0;
    WORD(object, 0x24) = 0;
    WORD(object, 0x28) = 0;
    WORD(object, 0x2c) = 0;
    WORD(object, 0x30) = 0;
    WORD(object, 0x34) = 0;
    WORD(object, 0x38) = 0;
    WORD(object, 0x3c) = 0;
    WORD(object, 0x40) = 0;
    WORD(object, 0x44) = 0;
    WORD(object, 0x48) = 0;
    WORD(object, 0x4c) = 0;
    WORD(object, 0x50) = 0;
    WORD(object, 0x54) = 0;
    WORD(object, 0x58) = 0;
    WORD(object, 0x5c) = 0;
    WORD(object, 0x60) = 0;
    WORD(object, 0x64) = 0;
    WORD(object, 0x68) = 0;
    WORD(object, 0x6c) = 0;
    WORD(object, 0x70) = func_00129068(source_record);
    WORD(object, 0x74) = -1;
    WORD(object, 0x78) = 0;
    WORD(object, 0x7C) = -1;
    WORD(object, 0x80) = -1;
    WORD(object, 0x84) = -1;
    WORD(object, 0x88) = 0;
    WORD(object, 0x8C) = 0;
    object[0x90] = 0;
    object[0x91] = 0;
    object[0x92] = 0;
    WORD(object, 0x94) = 0;
    object[0x98] = 0;
    *(float *)(object + 0x9C) = -1.0f;
    WORD(object, 0xa0) = 0;
    WORD(object, 0xa4) = 0;
    WORD(object, 0xa8) = 0;
    WORD(object, 0xac) = 0;
    WORD(object, 0xb0) = 0;
    object[0xB4] = 0;
    object[0xB5] = 0xFF;
    *(u16 *)(object + 0xB6) = 0;
    object[0xb8] = 0;
    object[0xb9] = 0;
    object[0xba] = 0;
    object[0xbb] = 0;
    object[0xbc] = 0;
    object[0xbd] = 0;
    object[0xbe] = 0;
    object[0xbf] = 0;
}
