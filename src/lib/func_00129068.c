typedef unsigned char u8;
typedef unsigned int u32;
typedef struct { u8 bytes[52]; } Record52;
typedef struct { u8 bytes[56]; } Record56;
typedef struct { u8 bytes[72]; } Record72;

extern u8 D_8018F481;
extern Record52 g_func_0019554C_records_52[];
extern Record56 g_func_0019554C_records_56[];
extern Record72 g_func_0019554C_class_records[];
extern int func_00040f88(u8, u8, u8, u8, u8);

/* Combine movement types for the members of a source record. */
int func_00129068(u8 *source_record)
{
    u8 movement_types[5];
    int member_slot;
    unsigned int member_or_class_id;

    if (source_record[0] == 0x1F && D_8018F481 != 8) {
        return 7;
    }
    switch (D_8018F481) {
    case 0x27:
    case 0x2D:
    case 0x2E:
    case 0x2F:
    case 0x3C:
        if (source_record[0] == 0x20) {
            return 7;
        }
        break;
    }
    for (member_slot = 0; member_slot < 5; member_slot++) {
        /* This address form keeps the retail base/index order in addu. */
        member_or_class_id = *(u8 *)((u32)source_record + member_slot + 2);
        if (member_or_class_id == 0) {
            movement_types[member_slot] = 0;
        } else if (member_or_class_id >= 100) {
            movement_types[member_slot] = 2;
        } else {
            if (source_record[0] >= 0x1F) {
                member_or_class_id = g_func_0019554C_records_52[member_or_class_id].bytes[0x12];
            } else {
                member_or_class_id = g_func_0019554C_records_56[member_or_class_id].bytes[0x12];
            }
            movement_types[member_slot] = g_func_0019554C_class_records[member_or_class_id].bytes[0x2C];
        }
    }
    return (u8)func_00040f88(movement_types[0], movement_types[1], movement_types[2], movement_types[3], movement_types[4]);
}
