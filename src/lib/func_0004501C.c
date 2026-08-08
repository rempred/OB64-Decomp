typedef unsigned char u8;
typedef unsigned short u16;

/*
 * Research reconstruction only. The accepted p0910 owner remains assembly until
 * canonical target verification proves an exact replacement.
 */

typedef struct Func0004501CRecord {
    u8 field_00[0x11];
    u8 field_11;
    u8 field_12;
    u8 field_13;
    u8 field_14;
    u8 field_15;
    u16 field_16;
    u16 field_18;
    u8 field_1A;
    u8 field_1B;
    u16 field_1C;
    u16 field_1E;
    u16 field_20;
    u16 field_22;
    u16 field_24;
    u16 field_26;
    u8 field_28;
} Func0004501CRecord;

typedef struct Func0004501CClassRecord {
    u8 field_00[0x05];
    u8 field_05;
    u8 field_06[0x02];
    u16 field_08;
    u8 field_0A[0x02];
    u16 field_0C;
    u8 field_0E[0x02];
    u16 field_10;
    u8 field_12[0x02];
    u16 field_14;
    u8 field_16[0x02];
    u16 field_18;
    u8 field_1A[0x02];
    u16 field_1C;
    u8 field_1E[0x02];
    u16 field_20;
    u8 field_22;
    u8 field_23;
    u8 field_24;
    u8 field_25[0x1C];
    u8 field_41;
    u8 field_42;
    u8 field_43;
    u8 field_44;
    u8 field_45;
    u8 field_46;
    u8 field_47;
} Func0004501CClassRecord;

extern Func0004501CClassRecord g_func_0019554C_class_records[];
extern int func_0002CBCC(void);
extern void func_00044AA4(Func0004501CRecord *record);

void func_0004501C(Func0004501CRecord *record, u8 level)
{
    u8 original_class;
    u8 alternate_class;
    int class_index;
    int selected_class;
    int counter;
    Func0004501CClassRecord *class_record;

    original_class = record->field_11;
    alternate_class = record->field_12;

    if (g_func_0019554C_class_records[original_class].field_45 == alternate_class) {
        class_index = original_class;
    } else {
        class_index = alternate_class;
    }

    if (g_func_0019554C_class_records[class_index].field_42 != 0xFF &&
        g_func_0019554C_class_records[class_index].field_42 > 1) {
        class_index = g_func_0019554C_class_records[class_index].field_41;
    }
    if (g_func_0019554C_class_records[class_index].field_44 != 0xFF &&
        g_func_0019554C_class_records[class_index].field_44 > 1) {
        class_index = g_func_0019554C_class_records[class_index].field_43;
    }
    selected_class = class_index;

    class_record = &g_func_0019554C_class_records[selected_class];
    if (class_record->field_05 == 3) {
        record->field_14 = 0;
    } else if (class_record->field_05 == 4) {
        record->field_14 = func_0002CBCC() & 1;
    } else {
        record->field_14 = class_record->field_05;
    }

    record->field_16 = class_record->field_08;
    record->field_1C = class_record->field_0C;
    record->field_1E = class_record->field_10;
    record->field_20 = class_record->field_14;
    record->field_22 = class_record->field_18;
    record->field_24 = class_record->field_1C;
    record->field_26 = class_record->field_20;

    if (g_func_0019554C_class_records[original_class].field_45 == alternate_class) {
        class_index = original_class;
    } else {
        class_index = alternate_class;
    }
    if (g_func_0019554C_class_records[class_index].field_46 == 0xFF) {
        record->field_1A = (func_0002CBCC() % 4) + 1;
    } else {
        record->field_1A = g_func_0019554C_class_records[class_index].field_46;
    }

    if (g_func_0019554C_class_records[original_class].field_45 == alternate_class) {
        class_index = original_class;
    } else {
        class_index = alternate_class;
    }
    record->field_1B = g_func_0019554C_class_records[class_index].field_24;
    record->field_13 = 1;

    counter = 1;
    while (counter < level) {
        if (g_func_0019554C_class_records[original_class].field_45 == alternate_class) {
            class_index = original_class;
        } else {
            class_index = alternate_class;
        }

        if (g_func_0019554C_class_records[class_index].field_42 != 0xFF &&
            (u8)counter < g_func_0019554C_class_records[class_index].field_42) {
            class_index = g_func_0019554C_class_records[class_index].field_41;
        }
        if (g_func_0019554C_class_records[class_index].field_44 != 0xFF &&
            (u8)counter < g_func_0019554C_class_records[class_index].field_44) {
            class_index = g_func_0019554C_class_records[class_index].field_43;
        }

        record->field_12 = class_index;
        record->field_11 = class_index;
        func_00044AA4(record);
        counter++;
    }

    record->field_18 = record->field_16;
    record->field_11 = original_class;
    record->field_12 = alternate_class;

    if (g_func_0019554C_class_records[original_class].field_45 == alternate_class) {
        class_index = original_class;
    } else {
        class_index = alternate_class;
    }
    record->field_28 = g_func_0019554C_class_records[class_index].field_23;
}
