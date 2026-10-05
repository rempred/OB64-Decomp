/* Private common declaration study. Numeric fields and existing aliases only.
 * This is neither an admitted native group nor original-TU proof. */
#ifndef SCHEDULER_NINE_CONTEXT_H
#define SCHEDULER_NINE_CONTEXT_H
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit {
    u32 flags;
    u8 source_index;
    u8 pad_05[3];
    f32 field_08, field_0C, field_10;
    u32 field_14;
    f32 field_18;
    u8 pad_1C[4];
    u8 field_20;
    u8 pad_21[7];
    f32 points[3][3];
    u8 pad_4C[0x24];
    s32 field_70, field_74;
    u32 field_78;
    s32 field_7C;
    u8 pad_80[0x28];
    s32 *field_A8;
} RuntimeUnit;
typedef RuntimeUnit UnitFlags;
typedef struct MaskView {
    u8 pad_00[8];
    u16 field_08, field_0A, field_0C, field_0E;
} MaskView;
typedef struct FieldView14 {
    u8 pad_00[0x14];
    f32 field_14, field_18, field_1C;
} FieldView14;
typedef struct ListPointState {
    s32 *members;
    f32 point_x, point_y, point_z;
} ListPointState;
typedef struct ResourceRecord {
    u8 pad_00[24];
    s32 field_18;
    u16 field_1C;
    u8 pad_1E[6];
} ResourceRecord;
typedef struct Bounds { f32 field_00, field_04, field_08, field_0C; } Bounds;
typedef struct Record10 { u8 bytes[10]; } Record10;
/* Existing +0 count, ten-byte records, +A2/+A4 words; no capacity claim. */
typedef struct RecordTable {
    u8 count;
    u8 records[16][10];
    u16 primary, secondary;
} RecordTable;
extern RuntimeUnit *D_801F0D28[];
extern s32 D_801F0DE0;
extern s32 D_801F0DE8;
extern RecordTable D_801F0E18;

extern s32 D_801F36C4, D_801F36C8, D_801F36CC;
extern s32 D_801F3658;
extern RuntimeUnit *D_801F0CB0[];
extern u8 D_800E7AC0;
extern void func_000f6b10(void *, f32 *, f32 *, f32 *);
extern f32 hypotf(f32, f32);
extern s32 D_801F3658, D_801F367C;
extern s32 D_801F0BA8, D_801F0BAC;
extern ListPointState D_801F0BB0;
extern MaskView *D_801F0CA0;
extern u16 *D_800E8108;
extern FieldView14 *D_8018F58C;
extern f32 D_801F0DC8, D_801F0DD0;
extern u8 D_801F105E;
extern u8 D_800E7AC0, D_800E7AB9;
extern void *D_800E7A68[];
extern u16 D_801951CC[][18];
extern char D_801EE0F0[];
extern s32 func_00108500(f32 *, f32 *, s32);
extern s32 func_00108AA0(f32, f32, s32);
extern void func_0012EA80(s32, f32 *);
extern f32 func_000F3428(u8, f32, f32);
extern f32 func_000F315C(u8, f32, f32);
extern void *resource_alloc(u32);
extern void resource_free(void *);
extern void func_00023940(char *, ...);
extern s32 D_801F367C;
extern s32 D_801F1070;
extern u8 D_801F0FDE;
extern u8 D_8018F481;
extern f32 D_801F3A38;
extern f32 D_801EB2F0[];
extern s32 func_0005c110(s32);
extern f32 func_00020bf0(f32);
extern f32 sinf(f32);
extern s32 func_801DD244(void);
extern void func_0010ADB8(s32);
extern u8 D_801969BA[][11];
extern s32 func_0012E968(RuntimeUnit *);
extern ResourceRecord D_801951B0[];
extern f64 D_801EE110;
extern Bounds D_801F0D98;
extern u8 D_801F0FE2;
extern u8 D_801F1004[], D_801F1014[], D_801F1024[];
extern u8 D_80196A38[];
extern void func_00118644(u8, s32);
extern s32 func_0012DA9C(RuntimeUnit *);
extern s32 func_0012DA10(RuntimeUnit *);
extern s32 func_0004813c(s32);
extern s32 func_801DD2B0(RuntimeUnit *);
extern u8 *D_801F361C;
extern void *memcpy(void *, void *, u32);
extern void func_00109C3C(RuntimeUnit *);
extern void func_0013A558(s32, s32, u8 *, u8 *);
extern void func_0013AA40(s32, s32, u8 *, u8 *);
extern void func_0013B350(s32, s32, u8 *, u8 *);
extern Record10 D_801F0E19[];
extern u16 D_801F0EBC;
extern u8 D_801E8680;
extern s32 func_0010A128(RuntimeUnit *unit);
extern void func_0010A718(RuntimeUnit *unit);
#endif

void func_0010A718(RuntimeUnit *unit)
{
    f32 point[3];
    s32 index;

    for (index = 0; index < D_801F0E18.count; index++) {
            u8 *record = D_801F0E19[index].bytes;
            u32 mask_11 = 0x11;
            /* The four-float bounds owner begins128 bytes before the
             * bank header. The original keeps its second float as the
             * address base; these are the same four genuine reads. */
            f32 *bounds_z = (f32 *)((u8 *)&D_801F0E18 - 124);
            s32 selected = 0;
            s32 comparison_index, current_value;
            /* Normalized Z and the case15 record-end address both use a1
             * in the original. One signed word keeps the casts multi-set
             * while the Z predicate remains a separate local result. */
            s32 compare_word;
            switch (record[1]) {
            case 3:
            case 7:
                if ((unit->flags & 0x11) == mask_11) {
                    f32 distance;
                    s32 kind;
                    func_0012EA80(record[6] - 1, point);
                    distance = hypotf(unit->field_08 - point[0], unit->field_10 - point[2]);
                    if (distance < D_801F3A38 / 2.0f) {
                        kind = record[1];
                        if ((u8)kind == 7 && (unit->flags & 8)) goto selected_record;
                        if ((u8)kind == 3 && !(unit->flags & 8)) selected = 1;
                    }
                }
                break;
            case 1:
            case 2:
            case 5:
            case 8:
                {
                    u32 flags = unit->flags;
                    if ((flags & 0x11) == mask_11) {
                        f32 z = unit->field_10;
                        f32 base_z = bounds_z[0];
                        f32 base_x, width_x;
                        /* Single-assignment stages preserve this compiler
                         * scheduler's original X/width allocation. */
                        f32 x_load, x_offset, x_scaled, x;
                        s32 min_byte_z, max_byte_x, max_byte_z;
                        /* The X word also holds the later record selector,
                         * keeping the two conversions at equal birth status. */
                        s32 kind;
                        /* Two named booleans avoid the old frontend's
                         * conditional lowering of comparison & variable. */
                        s32 upper_x, lower_x;

                        z -= base_z;
                        z *= 256.0f;
                        z /= bounds_z[2] - base_z;
                        base_x = bounds_z[-1];
                        x_load = unit->field_08;
                        x_offset = x_load - base_x;
                        width_x = bounds_z[1] - base_x;
                        x_scaled = x_offset * 256.0f;
                        x = x_scaled / width_x;
                        compare_word = (s32)z;
                        kind = (s32)x;
                        min_byte_z = record[3];
                        max_byte_x = record[4];
                        max_byte_z = record[5];
                        upper_x = max_byte_x >= kind;
                        lower_x = kind >= record[2];
                        lower_x &= upper_x;
                        if (lower_x) {
                            if ((compare_word >= min_byte_z) & (max_byte_z >= compare_word)) {
                                kind = record[1];
                                if (kind == 1 && (flags & 8)) goto selected_record;
                                if (kind == 2 && !(flags & 8)) goto selected_record;
                                if (kind == 5 && unit->source_index == record[6]) goto selected_record;
                                if (kind == 8 && unit->source_index == record[6]) selected = 1;
                            }
                        }
                    }
                }
                break;
            case 4:
                if ((unit->flags & 0x11) == mask_11) {
                    if (unit->flags & 8) {
                        comparison_index = record[6] - 1;
                        current_value = unit->field_74;
                        goto compare_record_value;
                    }
                }
                break;
            case 11:
                if ((unit->flags & 0x11) == mask_11) {
                    if (!(unit->flags & 8)) {
                        if (unit->field_74 == record[6] - 1) {
                            if (unit->source_index != 30) selected = 1;
                        }
                    }
                }
                break;
            case 6:
                if ((unit->flags & 0x11) != mask_11) break;
                if (record[6] == 1 && func_0005c110(0)) goto selected_record;
                if (record[6] == 6 && func_0005c110(1)) goto selected_record;
                if (record[6] == 7 && func_0005c110(2)) goto selected_record;
                if (record[6] == 8 && func_0005c110(3)) goto selected_record;
                if (record[6] == 9 && func_0005c110(4)) goto selected_record;
                if (record[6] == 10 && func_0005c110(5)) goto selected_record;
                if (record[6] == 11 && func_0005c110(6)) goto selected_record;
                if (record[6] == 12 && func_0005c110(7)) goto selected_record;
                if (record[6] == 13 && func_0005c110(8)) goto selected_record;
                if (record[6] == 14 && func_0005c110(9)) goto selected_record;
                if (record[6] == 15 && func_0005c110(10)) goto selected_record;
                if (record[6] == 16 && func_0005c110(11)) goto selected_record;
                if (record[6] == 17 && func_0005c110(12)) goto selected_record;
                if (record[6] == 18 && func_0005c110(13)) goto selected_record;
                if (record[6] == 23 && func_0005c110(14)) selected = 1;
                break;
            case 10:
                if (unit->source_index == record[6]) {
                    u32 flags = unit->flags;
                    if (!(flags & 0x10)) selected = 1;
                    else if ((flags & 0x01000008) == 0x01000000) selected = 1;
                }
                break;
            case 12:
                if ((unit->flags & 0x11) == mask_11) {
                    if (D_801951CC[record[6] - 1][0] & 4) selected = 1;
                }
                break;
            case 13:
                if ((unit->flags & 0x11) == mask_11) {
                    if (unit->flags & 8) {
                        comparison_index = record[6] - 1;
                        current_value = unit->field_74;
                        if (current_value == comparison_index) goto selected_record;
                        comparison_index = record[7] - 1;
                        /* Case4 enters this original shared comparison tail. */
compare_record_value:
                        if (current_value == comparison_index) selected = 1;
                    }
                }
                break;
            case 15:
                if ((unit->flags & 0x11) == mask_11) {
                    if (unit->flags & 8) {
                        u8 *entry = record + 2;
                        compare_word = (s32)(record + 10);
                        do {
                            if (*entry != 0) {
                                if (unit->field_74 == *entry - 1) goto selected_record;
                            }
                            entry++;
                        } while ((s32)entry < compare_word);
                    }
                }
                break;
            case 14:
                if ((unit->flags & 0x11) == mask_11) {
                    if (unit->flags & 8) {
                        s32 value = unit->field_74;
                        if ((u32)value - 1 < 2) selected = 1;
                        else if ((value == 3) | (value == 6)) selected = 1;
                    }
                }
                break;
            case 19:
                if ((unit->flags & 0x11) == mask_11) {
                    RuntimeUnit *other = D_801F0CB0[record[6]];
                    if (!(other->flags & 0x10)) selected = 1;
                    else if (func_0012DA10(other) == 0) selected = 1;
                }
                break;
            case 9:
            case 16:
            case 17:
            case 18:
            default:
                break;
selected_record:
                selected = 1;
                break;
            }
            if (selected) {
                u16 *published = &D_801F0EBC;
                /* Under the pinned MIPS compiler this uses the native
                 * variable shift, whose count is the low five bits. This
                 * retains the original modulo32 machine behavior. */
                *published |= 1U << (record[0] - 1);
            }
    }
}
