typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef struct Func001957D0Template {
    u8 field_00;
    u8 field_01;
    u16 field_02;
    s8 field_04[2];
    u8 field_06;
    u8 field_07;
    u8 field_08;
    u16 field_09;
    s8 field_0B[2];
    u8 field_0D[3];
    u8 field_10;
    u8 field_11;
    u16 field_12;
    s8 field_14[2];
    u8 field_16[13];
} __attribute__((packed)) Func001957D0Template;

typedef struct Func001957D0SourceRecord {
    u8 field_00;
    u8 field_01;
    u8 field_02[5];
    u8 field_07[5];
    u8 field_0C;
    u8 field_0D[10];
    u8 field_17;
    u8 field_18;
} Func001957D0SourceRecord;

typedef struct Func001957D0Record52 {
    u8 field_00[0x12];
    u8 field_12;
    u8 field_13[0x21];
} Func001957D0Record52;

typedef struct Func001957D0Record56 {
    u8 field_00[0x12];
    u8 field_12;
    u8 field_13[0x25];
} Func001957D0Record56;

extern u8 g_func_001957D0_active_source_ids[];
extern Func001957D0SourceRecord g_func_001957D0_source_records[];
extern Func001957D0Record52 g_func_0019554C_records_52[];
extern Func001957D0Record56 g_func_0019554C_records_56[];
extern u16 g_func_001957D0_special_slots[];
extern u16 g_func_001957D0_normal_slots[];
extern u16 g_func_001957D0_special_slot_seed;
extern u16 g_func_001957D0_normal_slot_seed;
extern u8 g_func_001957D0_special_slot_state[];
extern u8 g_func_001957D0_normal_slot_state[];
extern const char g_func_001957D0_record_error[];
extern const char g_func_001957D0_slot_error[];

extern void func_00023780(void *destination, int size);
extern void func_00023940(const char *message);
extern void func_0019554C(
    int record_index,
    const Func001957D0Template *source,
    int selector,
    u8 flag,
    u8 source_index);
extern u8 func_001957D0_finalize(Func001957D0SourceRecord *record);

void func_001957D0(const Func001957D0Template *source, int source_index)
{
    register u32 source_value asm("$2");
    register int source_sign asm("$3");
    volatile u8 special_source[16];
    register int record_index asm("$16");
    register int scan_index asm("$4");
    register int member_index asm("$18");
    register int source_offset asm("$19");
    u32 masked_source_index;
    register int masked_source_arg asm("$5");
    int record_offset;
    register int special_pool asm("$20");
    register int main_pool asm("$2");
    register u32 saved_s7 asm("$23");
    u16 *slot_cursor;
    register Func001957D0SourceRecord *source_record asm("$21");
    register const Func001957D0Template *source_reg asm("$22") = source;
    register u32 source_work asm("$17");

    source_value = (u8)source_index;
    source_sign = source_value >> 7;
    source_sign ^= 1;
    source_value = source_value < 30;
    source_value ^= 1;
    source_value = -source_value;
    source_sign &= source_value;
    asm("" : "=r"(source_sign) : "0"(source_sign));
    masked_source_arg = source_index & 0x7F;
    asm("" : "=r"(masked_source_arg) : "0"(masked_source_arg));
    masked_source_index = masked_source_arg;
    special_source[15] = source_sign;
    source_sign = (u8)masked_source_index;
    source_value = source_sign * 25;
    g_func_001957D0_active_source_ids[source_sign] = masked_source_index;
    source_record = (Func001957D0SourceRecord *)
        ((u8 *)g_func_001957D0_source_records + source_value);
    source_record->field_00 = masked_source_arg + 1;
    if (special_source[15] != 0) {
        source_record->field_01 = 0x81;
    } else {
        source_record->field_01 = 1;
    }
    func_00023780(source_record->field_02, 5);

    asm volatile(
        ".set noreorder\n"
        "lbu $8,31($sp)\n"
        "sltiu $2,%1,30\n"
        "xori $2,$2,1\n"
        "or %0,$8,$2\n"
        ".set reorder\n"
        : "=r"(main_pool)
        : "r"(masked_source_index)
        : "$8");
    member_index = 0;
    if (main_pool != 0) {
        asm("");
        scan_index = 1;
        record_offset = 52;
main_records_52:
        record_index = scan_index;
        if (((u8 *)g_func_0019554C_records_52)[record_offset + 0x12] == 0) {
            goto main_record_done;
        }
        scan_index++;
        if (scan_index < 100) {
            record_offset += 52;
            goto main_records_52;
        }
        asm("");
        record_index = -1;
        goto main_record_done;
    } else {
        scan_index = 1;
        record_offset = 56;
main_records_56:
        record_index = scan_index;
        if (((u8 *)g_func_0019554C_records_56)[record_offset + 0x12] == 0) {
            goto main_record_done;
        }
        scan_index++;
        if (scan_index < 100) {
            record_offset += 56;
            goto main_records_56;
        }
        record_index = -1;
    }
main_record_done:
    asm volatile(
        ".set noreorder\n"
        "bgez %2,1f\n"
        "addu $4,%2,$0\n"
        "lui $4,%%hi(g_func_001957D0_record_error)\n"
        "jal func_00023940\n"
        "addiu $4,$4,%%lo(g_func_001957D0_record_error)\n"
        "addu $4,%2,$0\n"
        "1:\n"
        "addu $5,%4,$0\n"
        "lbu %0,31($sp)\n"
        "addu $6,$0,$0\n"
        "andi %1,%5,0x00ff\n"
        "sw %1,16($sp)\n"
        "jal func_0019554C\n"
        "addu $7,%0,$0\n"
        "addu $2,%3,%6\n"
        "sb %2,2($2)\n"
        "lbu $3,6(%4)\n"
        "addiu $3,$3,-1\n"
        "sb $3,7($2)\n"
        ".set reorder\n"
        : "=r"(special_pool), "=r"(source_work)
        : "r"(record_index), "r"(source_record), "r"(source_reg),
          "r"(masked_source_index), "r"(member_index)
        : "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9", "$10", "$11",
          "$12", "$13", "$14", "$15", "$24", "$25", "$31", "memory");
    member_index++;

    if (source_reg->field_07 == 1) {
        register u16 *special_slot_base asm("$5");
        register int pool_compare asm("$2");
        u16 * volatile preserved_slot_base;

        source_offset = 0;
        pool_compare = source_work < 30;
        pool_compare ^= 1;
        special_pool |= pool_compare;
        special_slot_base = g_func_001957D0_special_slots;
        saved_s7 = (u32)g_func_001957D0_normal_slots;
        source_work = (u32)source_reg;
        asm("" : "=r"(source_work) : "0"(source_work));
field_07_slot_outer:
        if (((const Func001957D0Template *)source_work)->field_0D[0] != 0) {
            scan_index = 0;
            if (special_pool != 0) {
                slot_cursor = special_slot_base;
field_07_special_slot_scan:
                record_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_07_slot_scan_done;
                }
                scan_index++;
                if (scan_index < 120) {
                    slot_cursor++;
                    goto field_07_special_slot_scan;
                }
                asm("");
                record_index = -1;
                goto field_07_slot_scan_done;
            } else {
                slot_cursor = (u16 *)saved_s7;
field_07_normal_slot_scan:
                record_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_07_slot_scan_done;
                }
                scan_index++;
                if (scan_index < 120) {
                    slot_cursor++;
                    goto field_07_normal_slot_scan;
                }
                record_index = -1;
            }
field_07_slot_scan_done:
            if (record_index < 0) {
                preserved_slot_base = special_slot_base;
                func_00023940(g_func_001957D0_slot_error);
                special_slot_base = preserved_slot_base;
            }
            if (special_pool != 0) {
                special_slot_base[record_index] = g_func_001957D0_special_slot_seed;
                g_func_001957D0_special_slot_state[record_index] = 0;
            } else {
                ((u16 *)saved_s7)[record_index] = g_func_001957D0_normal_slot_seed;
                g_func_001957D0_normal_slot_state[record_index] = 0;
            }
            {
                register u8 *member_entry asm("$3");

                member_entry = (u8 *)source_record + member_index;
                asm volatile(
                    ".set noreorder\n"
                    "addiu %0,%2,1\n"
                    "addiu $2,%4,100\n"
                    "sb $2,2(%5)\n"
                    "lbu $2,13(%6)\n"
                    "addiu %1,%3,1\n"
                    "addiu $2,$2,-1\n"
                    "sb $2,7(%5)\n"
                    ".set reorder\n"
                    : "=r"(member_index), "=r"(source_offset)
                    : "0"(member_index), "1"(source_offset), "r"(record_index),
                      "r"(member_entry), "r"(source_work)
                    : "$2", "memory");
            }
            source_work++;
            if (source_offset < 3) {
                goto field_07_slot_outer;
            }
        }
    } else if (source_reg->field_07 != 0) {
        register int pool_compare asm("$2");

        source_offset = 0;
        saved_s7 = source_work;
        pool_compare = source_work < 30;
        pool_compare ^= 1;
        special_pool |= pool_compare;
        source_work = (u32)source_reg;
        asm("" : "=r"(source_work) : "0"(source_work));
field_07_record_outer:
        if (((const Func001957D0Template *)source_work)->field_0D[0] != 0) {
            scan_index = 1;
            if (special_pool != 0) {
                record_offset = 52;
field_07_records_52:
                record_index = scan_index;
                if (((u8 *)g_func_0019554C_records_52)[record_offset + 0x12] == 0) {
                    goto field_07_record_scan_done;
                }
                scan_index++;
                if (scan_index < 100) {
                    record_offset += 52;
                    goto field_07_records_52;
                }
                asm("");
                record_index = -1;
                goto field_07_record_scan_done;
            } else {
                record_offset = 56;
field_07_records_56:
                record_index = scan_index;
                if (((u8 *)g_func_0019554C_records_56)[record_offset + 0x12] == 0) {
                    goto field_07_record_scan_done;
                }
                scan_index++;
                if (scan_index < 100) {
                    record_offset += 56;
                    goto field_07_records_56;
                }
                record_index = -1;
            }
field_07_record_scan_done:
            asm volatile(
                ".set noreorder\n"
                "bgez %0,1f\n"
                "addu $4,%0,$0\n"
                "lui $4,%%hi(g_func_001957D0_record_error)\n"
                "jal func_00023940\n"
                "addiu $4,$4,%%lo(g_func_001957D0_record_error)\n"
                "addu $4,%0,$0\n"
                "1:\n"
                "lbu $7,31($sp)\n"
                "addu $5,%1,$0\n"
                "addiu $6,$0,1\n"
                "jal func_0019554C\n"
                "sw %2,16($sp)\n"
                ".set reorder\n"
                :
                : "r"(record_index), "r"(source_reg), "r"(saved_s7)
                : "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9", "$10", "$11",
                  "$12", "$13", "$14", "$15", "$24", "$25", "$31", "memory");
            {
                register u8 *member_entry asm("$3");

                member_entry = (u8 *)source_record + member_index;
                asm volatile(
                    ".set noreorder\n"
                    "addiu %0,%2,1\n"
                    "sb %4,2(%5)\n"
                    "lbu $2,13(%6)\n"
                    "addiu %1,%3,1\n"
                    "addiu $2,$2,-1\n"
                    "sb $2,7(%5)\n"
                    ".set reorder\n"
                    : "=r"(member_index), "=r"(source_offset)
                    : "0"(member_index), "1"(source_offset), "r"(record_index),
                      "r"(member_entry), "r"(source_work)
                    : "$2", "memory");
            }
            source_work++;
            if (source_offset < 3) {
                goto field_07_record_outer;
            }
        }
    }

    if (source_reg->field_10 == 1) {
        register int slot_compare asm("$2");
        register int slot_special asm("$19");
        register u32 normal_slot_base asm("$20");

        slot_compare = masked_source_index < 30;
        asm volatile(
            ".set noreorder\n"
            "xori %0,%0,1\n"
            "lbu $8,31($sp)\n"
            "lui %1,%%hi(g_func_001957D0_special_slots)\n"
            "addiu %1,%1,%%lo(g_func_001957D0_special_slots)\n"
            "lui %2,%%hi(g_func_001957D0_normal_slots)\n"
            "addiu %2,%2,%%lo(g_func_001957D0_normal_slots)\n"
            "addu %3,%6,$0\n"
            "or %4,$8,%0\n"
            ".set reorder\n"
            : "=r"(slot_compare), "=r"(saved_s7), "=r"(normal_slot_base),
              "=r"(source_work), "=r"(slot_special)
            : "0"(slot_compare), "r"(source_reg)
            : "$8");
field_10_slot_outer:
        if (((const Func001957D0Template *)source_work)->field_16[0] != 0) {
            scan_index = 0;
            if (slot_special != 0) {
                slot_cursor = (u16 *)saved_s7;
field_10_special_slot_scan:
                record_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_10_slot_scan_done;
                }
                scan_index++;
                if (scan_index < 120) {
                    slot_cursor++;
                    goto field_10_special_slot_scan;
                }
                asm("");
                record_index = -1;
                goto field_10_slot_scan_done;
            } else {
                slot_cursor = (u16 *)normal_slot_base;
field_10_normal_slot_scan:
                record_index = scan_index;
                if (*slot_cursor == 0) {
                    goto field_10_slot_scan_done;
                }
                scan_index++;
                if (scan_index < 120) {
                    slot_cursor++;
                    goto field_10_normal_slot_scan;
                }
                record_index = -1;
            }
field_10_slot_scan_done:
            asm volatile(
                ".set noreorder\n"
                "bgez %0,1f\n"
                "nop\n"
                "lui $4,%%hi(g_func_001957D0_slot_error)\n"
                "jal func_00023940\n"
                "addiu $4,$4,%%lo(g_func_001957D0_slot_error)\n"
                "1:\n"
                ".set reorder\n"
                :
                : "r"(record_index)
                : "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9", "$10", "$11",
                  "$12", "$13", "$14", "$15", "$24", "$25", "$31", "memory");
            if (slot_special != 0) {
                ((u16 *)saved_s7)[record_index] = g_func_001957D0_special_slot_seed;
                g_func_001957D0_special_slot_state[record_index] = 0;
            } else {
                ((u16 *)normal_slot_base)[record_index] = g_func_001957D0_normal_slot_seed;
                g_func_001957D0_normal_slot_state[record_index] = 0;
            }
            {
                register u8 *member_entry asm("$3");

                member_entry = (u8 *)source_record + member_index;
                asm volatile(
                    ".set noreorder\n"
                    "addiu $2,%2,100\n"
                    "sb $2,2(%3)\n"
                    "lbu $2,22(%1)\n"
                    "addiu %0,%1,1\n"
                    "addiu $2,$2,-1\n"
                    "sb $2,7(%3)\n"
                    ".set reorder\n"
                    : "=r"(source_work)
                    : "0"(source_work), "r"(record_index), "r"(member_entry)
                    : "$2", "memory");
            }
            member_index++;
            if ((int)source_work < (int)((u32)source_reg + 3)) {
                goto field_10_slot_outer;
            }
        }
    } else if (source_reg->field_10 != 0) {
        register u32 second_source_index asm("$19");
        register int record_special asm("$20");

        asm volatile(
            ".set noreorder\n"
            "andi %0,%3,0x00ff\n"
            "sltiu $2,%0,30\n"
            "lbu $8,31($sp)\n"
            "xori $2,$2,1\n"
            "addu %1,%4,$0\n"
            "or %2,$8,$2\n"
            ".set reorder\n"
            : "=r"(second_source_index), "=r"(source_work), "=r"(record_special)
            : "r"(masked_source_index), "r"(source_reg)
            : "$2", "$8");
field_10_record_outer:
        if (((const Func001957D0Template *)source_work)->field_16[0] != 0) {
            scan_index = 1;
            if (record_special != 0) {
                record_offset = 52;
field_10_records_52:
                record_index = scan_index;
                if (((u8 *)g_func_0019554C_records_52)[record_offset + 0x12] == 0) {
                    goto field_10_record_scan_done;
                }
                scan_index++;
                if (scan_index < 100) {
                    record_offset += 52;
                    goto field_10_records_52;
                }
                asm("");
                record_index = -1;
                goto field_10_record_scan_done;
            } else {
                record_offset = 56;
field_10_records_56:
                record_index = scan_index;
                if (((u8 *)g_func_0019554C_records_56)[record_offset + 0x12] == 0) {
                    goto field_10_record_scan_done;
                }
                scan_index++;
                if (scan_index < 100) {
                    record_offset += 56;
                    goto field_10_records_56;
                }
                record_index = -1;
            }
field_10_record_scan_done:
            asm volatile(
                ".set noreorder\n"
                "bgez %0,1f\n"
                "addu $4,%0,$0\n"
                "lui $4,%%hi(g_func_001957D0_record_error)\n"
                "jal func_00023940\n"
                "addiu $4,$4,%%lo(g_func_001957D0_record_error)\n"
                "addu $4,%0,$0\n"
                "1:\n"
                "lbu $7,31($sp)\n"
                "addu $5,%1,$0\n"
                "addiu $6,$0,2\n"
                "jal func_0019554C\n"
                "sw %2,16($sp)\n"
                ".set reorder\n"
                :
                : "r"(record_index), "r"(source_reg), "r"(second_source_index)
                : "$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9", "$10", "$11",
                  "$12", "$13", "$14", "$15", "$24", "$25", "$31", "memory");
            {
                register u8 *member_entry asm("$3");

                member_entry = (u8 *)source_record + member_index;
                asm volatile(
                    ".set noreorder\n"
                    "sb %2,2(%3)\n"
                    "lbu $2,22(%1)\n"
                    "addiu %0,%1,1\n"
                    "addiu $2,$2,-1\n"
                    "sb $2,7(%3)\n"
                    ".set reorder\n"
                    : "=r"(source_work)
                    : "0"(source_work), "r"(record_index), "r"(member_entry)
                    : "$2", "memory");
            }
            member_index++;
            if ((int)source_work < (int)((u32)source_reg + 3)) {
                goto field_10_record_outer;
            }
        }
    }

    source_record->field_18 = func_001957D0_finalize(source_record);
    func_00023780(source_record->field_0D, 10);
}
