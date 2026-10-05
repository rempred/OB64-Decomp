typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef float f32;

typedef struct RuntimeUnit {
    u32 flags;
    u8 source_index;
    u8 pad_05[3];
    f32 field_08, field_0C, field_10;
    u8 pad_14[0x60];
    s32 field_74;
} RuntimeUnit;

typedef struct Bounds {
    f32 field_00, field_04, field_08, field_0C;
} Bounds;

/* The loader and consumer both use ten-byte records. */
typedef struct Record10 {
    u8 bytes[10];
} Record10;

extern u8 D_801F0E18[];
/* Accepted loader001960A8 uses this existing record-base alias separately
 * from the byte count header. Both aliases retain their current data owner. */
extern Record10 D_801F0E19[];
extern RuntimeUnit *D_801F0CB0[];
extern Bounds D_801F0D98;
extern f32 D_801F3A38;
extern u16 D_801F0EBC;
extern u16 D_801951CC[][18];
extern void func_0012EA80(s32, f32 *);
extern f32 hypotf(f32, f32);
extern s32 func_0005c110(s32);
extern s32 func_0012DA10(RuntimeUnit *);

/* The loader copies ten bytes per record. A separate 76-byte assembly
 * switch table remains the production owner during this source research. */
void func_0010A718(RuntimeUnit *unit)
{
    f32 point[3];
    s32 index;

    for (index = 0; index < D_801F0E18[0]; index++) {
            u8 *record = D_801F0E19[index].bytes;
            /* The four-float bounds owner begins128 bytes before the
             * bank header. The original keeps its second float as the
             * address base; these are the same four genuine reads. */
            f32 *bounds_z = (f32 *)(D_801F0E18 - 124);
            s32 selected = 0;
            switch (record[1]) {
            case 3:
            case 7:
                if ((unit->flags & 0x11) == 0x11) {
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
                    if ((flags & 0x11) == 0x11) {
                        f32 z = unit->field_10;
                        f32 base_z = bounds_z[0];
                        f32 base_x, width_x;
                        f32 x;
                        s32 byte_z, byte_x;
                        s32 min_byte_z, max_byte_x, max_byte_z;
                        s32 kind;

                        z -= base_z;
                        z *= 256.0f;
                        z /= bounds_z[2] - base_z;
                        base_x = bounds_z[-1];
                        x = unit->field_08;
                        x -= base_x;
                        width_x = bounds_z[1] - base_x;
                        x *= 256.0f;
                        x /= width_x;
                        min_byte_z = record[3];
                        max_byte_x = record[4];
                        max_byte_z = record[5];
                        byte_z = (s32)z;
                        byte_x = (s32)x;
                        if ((max_byte_x >= byte_x) & (byte_x >= record[2])) {
                            if ((byte_z >= min_byte_z) & (max_byte_z >= byte_z)) {
                                kind = record[1];
                                if (kind == 1 && (flags & 8)) goto selected_record;
                                if (kind == 2 && !(flags & 8)) goto selected_record;
                                if (kind == 5 && unit->source_index == record[6]) goto selected_record;
                                if (kind == 8 && unit->source_index == record[6]) goto selected_record;
                            }
                        }
                    }
                }
                break;
            case 4:
                if ((unit->flags & 0x11) == 0x11) {
                    if (unit->flags & 8) {
                        if (unit->field_74 == record[6] - 1) selected = 1;
                    }
                }
                break;
            case 11:
                if ((unit->flags & 0x11) == 0x11) {
                    if (!(unit->flags & 8)) {
                        if (unit->field_74 == record[6] - 1) {
                            if (unit->source_index != 30) selected = 1;
                        }
                    }
                }
                break;
            case 6:
                if ((unit->flags & 0x11) != 0x11) break;
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
                if ((unit->flags & 0x11) == 0x11) {
                    if (D_801951CC[record[6] - 1][0] & 4) selected = 1;
                }
                break;
            case 13:
                if ((unit->flags & 0x11) == 0x11) {
                    if (unit->flags & 8) {
                        if (unit->field_74 == record[6] - 1) selected = 1;
                        else if (unit->field_74 == record[7] - 1) selected = 1;
                    }
                }
                break;
            case 15:
                if ((unit->flags & 0x11) == 0x11) {
                    if (unit->flags & 8) {
                        u8 *entry = record + 2;
                        do {
                            if (*entry != 0) {
                                if (unit->field_74 == *entry - 1) goto selected_record;
                            }
                            entry++;
                        } while (entry < record + 10);
                    }
                }
                break;
            case 14:
                if ((unit->flags & 0x11) == 0x11) {
                    if (unit->flags & 8) {
                        s32 value = unit->field_74;
                        if ((u32)value - 1 < 2) selected = 1;
                        else if ((value == 3) | (value == 6)) selected = 1;
                    }
                }
                break;
            case 19:
                if ((unit->flags & 0x11) == 0x11) {
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
