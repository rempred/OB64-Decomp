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
    u8 pad_14[12];
    u8 field_20;
    u8 pad_21[0x53];
    s32 field_74;
    u32 field_78;
    s32 field_7C;
} RuntimeUnit;

typedef struct ResourceRecord {
    u8 pad_00[24];
    s32 field_18;
    u16 field_1C;
    u8 pad_1E[6];
} ResourceRecord;

typedef struct Bounds {
    f32 field_00, field_04, field_08, field_0C;
} Bounds;

extern ResourceRecord D_801951B0[];
extern s32 D_801F1070;
extern f32 D_801F3A38;
extern f64 D_801EE110;
extern Bounds D_801F0D98;
extern u8 D_801F0FE2;
extern u8 D_801F1004[], D_801F1014[], D_801F1024[];
extern u8 D_80196A38[];

extern void func_0012EA80(s32, f32 *);
extern void func_00118644(u8, s32);
extern s32 func_0012DA9C(RuntimeUnit *);
extern s32 func_0012DA10(RuntimeUnit *);
extern s32 func_0004813c(s32);
/* These two live addresses are unresolved edge-only interfaces. The ROM
 * sets no argument for DD244 and only the unit pointer for DD2B0. */
extern s32 func_801DD244(void);
extern s32 func_801DD2B0(RuntimeUnit *);

void func_00109C3C(RuntimeUnit *unit)
{
    f32 point[3];
    s32 index;
    f32 min_z, max_z;

    unit->field_74 = -1;
    if ((unit->flags & 0x00201011) != 0x11) return;

    for (index = 0; index < D_801F1070; index++) {
            ResourceRecord *record = &D_801951B0[index];
            if (record->field_1C & 8) {
                f64 radius, center_x, center_z;
                f32 min_x, max_x;
                f32 x, z, dx, dz;

                func_0012EA80(index, point);
                radius = (f64)D_801F3A38 * D_801EE110;
                center_x = (f64)point[0];
                min_x = (f32)(center_x - radius);
                center_z = (f64)point[2];
                max_x = (f32)(center_x + radius);
                min_z = (f32)(center_z - radius);
                max_z = (f32)(center_z + radius);
                x = unit->field_08;
                if (!(min_x < x)) goto next_record;
                if (!(x < max_x)) goto next_record;
                z = unit->field_10;
                if (!(min_z < z)) goto next_record;
                if (!(z < max_z)) goto next_record;
                dx = x - point[0];
                dz = z - point[2];
                if (!((f64)(dx * dx + dz * dz) < radius * radius)) goto next_record;

                if (unit->flags & 8) {
                    if (record->field_1C & 2) unit->field_74 = index;
                    else goto query_record;
                } else if (record->field_1C & 4) {
                    unit->field_74 = index;
                } else {
query_record:
                    if (func_801DD244()) unit->field_74 = index;
                }

                if (unit->field_78 != 0) goto next_record;
                func_00118644(unit->source_index, index);
                if (func_801DD244() == 0) {
                    if (unit->flags & 8) {
                        if (!(record->field_1C & 2)) {
                            if (record->field_18 != 0) goto next_record;
                            if (func_0012DA9C(unit)) goto next_record;
                            if (!func_0012DA10(unit)) goto next_record;
                            if ((unit->flags & 0x00040000) || unit->field_20 != 0) {
                                if (unit->source_index < 30) goto next_record;
                            }
                            unit->field_7C = index;
                            unit->field_78 |= 0x40;
                            goto next_record;
                        }
                    } else {
                        goto other_record;
                    }
                }

                if ((unit->flags & 8) && func_0004813c(2)) {
                    u32 flags = unit->flags;
                    if (flags & 0x10000000) goto next_record;
                    if ((flags & 0x00040000) && unit->source_index < 30) goto next_record;
                    unit->field_7C = index;
                    unit->field_78 |= 0x00020000;
                } else {
other_record:
                    if (func_801DD244()) {
                        if (!(record->field_1C & 2)) goto next_record;
                    }
                    if (unit->flags & 8) goto next_record;
                    if (record->field_1C & 4) goto next_record;
                    if (record->field_18 != 0) goto next_record;
                    unit->field_7C = index;
                    unit->field_78 |= 0x00010000;
                }
            }
next_record:
            ;
    }

    if (unit->flags & 8) {
        if (func_801DD2B0(unit) == 0) {
            if (unit->field_78 == 0) {
                for (index = 0; index < D_801F0FE2; index++) {
                        s32 value = D_801F1024[index];
                        s32 group = value / 8;
                        s32 bit = value - group * 8;
                        if (!((D_80196A38[group] >> bit) & 1)) {
                            f32 x, z, radius;
                            f32 min_x, max_x;
                            f32 unit_x, unit_z;

                            x = D_801F0D98.field_00 + ((D_801F0D98.field_08 - D_801F0D98.field_00) * D_801F1004[index]) / 256.0f;
                            z = D_801F0D98.field_04 + ((D_801F0D98.field_0C - D_801F0D98.field_04) * D_801F1014[index]) / 256.0f;
                            radius = D_801F3A38 / 2.0f;
                            min_x = x - radius;
                            max_x = x + radius;
                            min_z = z - radius;
                            max_z = z + radius;
                            unit_x = unit->field_08;
                            if (!(min_x < unit_x)) goto next_point;
                            if (!(unit_x < max_x)) goto next_point;
                            unit_z = unit->field_10;
                            if (!(min_z < unit_z)) goto next_point;
                            if (!(unit_z < max_z)) goto next_point;
                            unit->field_7C = index;
                            unit->field_78 |= 0x00400000;
                            D_80196A38[group] |= 1U << bit;
                            break;
                        }
next_point:
                        ;
                }
            }
        }
    }
    if (unit->field_74 == -1) unit->flags &= ~0x10000000;
}
