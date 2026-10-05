typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef float f32;

/* Partial views cover only the observed fields; the full runtime record's
 * extent and the meanings of its flags remain outside this translation. */
typedef struct RuntimeUnit {
    u32 flags;
    u8 source_index;
    u8 pad_05[3];
    f32 field_08;
    f32 field_0C;
    f32 field_10;
    u32 field_14;
    f32 field_18;
    u8 pad_1C[0x54];
    s32 field_70;
    u8 pad_74[0x34];
    s32 *field_A8;
} RuntimeUnit;

extern RuntimeUnit *D_801F0CB0[];
/* Existing opaque bank, viewed only at its first state word. */
extern u8 D_801F0DE0[];
extern s32 D_801F3658;
extern s32 D_801F367C;
extern s32 D_801F1070;
extern u8 D_801F0FDE;
extern u8 D_8018F481;
extern f32 D_801F3A38;
extern f32 D_801EB2F0[];
extern u16 D_801951CC[][18];

extern s32 func_0005c110(s32);
extern f32 func_00020bf0(f32);
extern f32 sinf(f32);
/* This is an unresolved edge-only interface, not a new function owner. */
extern s32 func_801DD244(void);
extern void func_0012EA80(s32, f32 *);
extern void func_0010ADB8(s32);

void func_001094BC(void)
{
    s32 initial_mode = ((s32 *)D_801F0DE0)[0];
    s32 index;
    s32 available;
    f32 point[3];
    f32 range;

    if (initial_mode == 2) return;
    if (initial_mode == 17) return;

    for (index = 0, available = 0; index < D_801F367C; index++) {
            RuntimeUnit *unit = D_801F0CB0[index];
            u32 initial_flags = unit->flags;
            if (!(initial_flags & 8)) {
                if (D_8018F481 != 0x3F || !(initial_flags & 0x01000000)) {
                    if (func_0005c110(28)) unit->flags |= 0x20;
                    else unit->flags &= ~0x20;
                }
                {
                    u32 counted_flags = unit->flags;
                    if (!(counted_flags & 8) && unit->source_index >= 30)
                        available += counted_flags & 1;
                }
            }
            if (D_801F3658 == -1) {
                unit->flags &= ~0x00100000;
            } else if (index == D_801F3658) {
                unit->flags &= ~0x00100000;
            } else {
                u32 marked_flags = unit->flags | 0x00100000;
                unit->flags = marked_flags;
                if (((s32 *)D_801F0DE0)[0] == 1 && !(marked_flags & 8))
                    unit->flags = marked_flags & ~0x00100000;
            }
    }
    D_801F0FDE = available;

    for (index = 0; index < D_801F367C; index++) {
            RuntimeUnit *unit = D_801F0CB0[index];
            u32 flags = unit->flags;
            if (flags & 8) {
            if (flags & 1) {
            if (flags & 0x10) {
                if (func_801DD244()) {
                    s32 *members = unit->field_A8;
                    if (members != 0 && members[0] != -1) {
                        s32 offset = 0;
                        do {
                            RuntimeUnit *member = D_801F0CB0[members[offset]];
                            member->flags |= 0x20;
                            members = unit->field_A8;
                            offset++;
                        } while (members[offset] != -1);
                    }
                } else {
                    f32 center_x;
                    f32 center_z;
                    f32 radius;
                    f32 min_x, max_x, min_z, max_z;
                    s32 other_index;
                    RuntimeUnit **other_cursor;
                    if (!(unit->flags & 0x00020000)) {
                        f32 shift_z;
                        radius = D_801F3A38 * 1.5f;
                        radius *= func_00020bf0(unit->field_18 * 6.2831855f);
                        shift_z = D_801F3A38 * 1.5f;
                        center_x = unit->field_08 + radius;
                        shift_z *= sinf(unit->field_18 * 6.2831855f);
                        radius = D_801F3A38 * D_801EB2F0[unit->field_70];
                        center_z = unit->field_10 - shift_z;
                    } else {
                        center_x = unit->field_08;
                        center_z = unit->field_10;
                        radius = D_801F3A38 * 1.2f;
                    }
                    min_x = center_x - radius;
                    max_x = center_x + radius;
                    min_z = center_z - radius;
                    max_z = center_z + radius;
                    other_index = 30;
                    other_cursor = D_801F0CB0 + 30;
                    do {
                        RuntimeUnit *other = *other_cursor;
                        u32 other_flags = other->flags;
                        if (!(other_flags & 8) && (other_flags & 0x31) == 0x11) {
                            f32 x = other->field_08;
                            if (min_x < x) {
                            if (x < max_x) {
                                f32 z = other->field_10;
                                if (min_z < z) {
                                if (z < max_z) {
                                    f32 dx = x - center_x;
                                    f32 dz = z - center_z;
                                    if (dx * dx + dz * dz < radius * radius)
                                        other->flags = other_flags | 0x20;
                                }
                            }
                                }
                            }
                        }
                        other_index++;
                        other_cursor++;
                    } while (other_index < 50);
                }
            }
            }
            }
    }

    range = D_801F3A38;
    for (index = 0; index < D_801F1070; index++) {
            u16 *record = D_801951CC[index];
            if (*record & 2) {
                f32 min_x, max_x, min_z, max_z;
                s32 other_index;
                RuntimeUnit **other_cursor;
                u8 stage;
                func_0012EA80(index, point);
                min_x = point[0] - range;
                max_x = point[0] + range;
                min_z = point[2] - range;
                max_z = point[2] + range;
                stage = D_8018F481;
                other_index = 30;
                other_cursor = D_801F0CB0 + 30;
                do {
                    RuntimeUnit *other = *other_cursor;
                    u32 flags = other->flags;
                    if (!(flags & 8)) {
                        if ((flags & 0x31) == 0x11) {
                            f32 x = other->field_08;
                            if (min_x < x) {
                            if (x < max_x) {
                                f32 z = other->field_10;
                                if (min_z < z) {
                                if (z < max_z) {
                                    f32 dx = x - point[0];
                                    f32 dz = z - point[2];
                                    if (dx * dx + dz * dz < range * range)
                                        other->flags = flags | 0x20;
                                }
                            }
                                }
                            }
                        } else if (stage == 0x3F &&
                                   (flags & 0x01001000) == 0x01000000) {
                            other->flags = flags & ~0x20;
                        }
                    }
                    other_index++;
                    other_cursor++;
                } while (other_index < 50);
            }
    }
    func_0010ADB8(available);
}
