typedef unsigned char u8;
typedef unsigned int u32;
typedef int s32;
typedef float f32;

/* This partial record view preserves numeric fields and observed masks. */
typedef struct RuntimeUnit {
    u32 flags;
    u8 pad_04[4];
    f32 field_08, field_0C, field_10;
    u32 field_14;
    f32 field_18;
    u8 pad_1C[0x54];
    s32 field_70, field_74;
    u32 field_78;
    s32 field_7C;
    u8 pad_80[0x28];
    s32 *field_A8;
} RuntimeUnit;

extern RuntimeUnit *D_801F0CB0[];
extern s32 D_801F0DE0;
extern u8 D_8018F481;
extern u8 *D_801F361C;
extern f32 D_801F3A38;
extern f32 D_801EB2F0[];
extern void *resource_alloc(u32);
extern void resource_free(void *);
/* The existing memory interface takes source, destination, then byte count. */
extern void *memcpy(void *, void *, u32);
extern f32 func_00020bf0(f32);
extern f32 sinf(f32);
extern void func_00109C3C(RuntimeUnit *);
extern void func_0013A558(s32, s32, u8 *, u8 *);
extern void func_0013AA40(s32, s32, u8 *, u8 *);
extern void func_0013B350(s32, s32, u8 *, u8 *);

s32 func_0010A128(RuntimeUnit *unit)
{
    s32 members[51];
    u8 first, second;
    s32 result = 0;
    s32 count;
    s32 lower;
    s32 index;
    s32 initial_index;
    f32 center_x, center_z, radius;
    f32 small_radius;
    f32 unit_x, unit_z;
    f32 min_x, min_z, max_x, max_z;
    f32 small_min_x, small_min_z, small_max_x, small_max_z;

    if (unit->field_A8 != 0) {
        resource_free(unit->field_A8);
        unit->field_A8 = 0;
    }
    unit->field_74 = -1;
    if (!(unit->flags & 1)) return 0;
    if (!(unit->flags & 0x10)) return 0;
    if ((unit->flags & 0x28) == 8) return 0;
    func_00109C3C(unit);
    members[0] = -1;
    count = 0;

    if (!(unit->flags & 0x00020000)) {
        f32 shift_x, shift_z;
        shift_x = D_801F3A38 * 1.5f;
        shift_x *= func_00020bf0(unit->field_18 * 6.2831855f);
        shift_z = D_801F3A38 * 1.5f;
        center_x = unit->field_08 + shift_x;
        shift_z *= sinf(unit->field_18 * 6.2831855f);
        radius = D_801F3A38 * D_801EB2F0[unit->field_70];
        center_z = unit->field_10 - shift_z;
    } else {
        center_x = unit->field_08;
        center_z = unit->field_10;
        radius = D_801F3A38 * 1.2f;
    }
    small_radius = D_801F3A38 / 2.0f;
    min_x = center_x - radius;
    max_x = center_x + radius;
    min_z = center_z - radius;
    max_z = center_z + radius;
    unit_x = unit->field_08;
    small_min_x = unit_x - small_radius;
    small_max_x = unit_x + small_radius;
    unit_z = unit->field_10;
    small_min_z = unit_z - small_radius;
    small_max_z = unit_z + small_radius;
    /* Pair the starting values to retain the original scan prologue. */
    if (unit->flags & 8) {
        lower = 30;
        initial_index = 50;
    } else {
        lower = 0;
        initial_index = 50;
    }

    for (index = initial_index - 1; index >= lower; index--) {
        RuntimeUnit *other = D_801F0CB0[index];
        s32 blocked = 0;
        f32 x, z, dx, dz;
        u32 flags, other_flags;

        if (lower != 0) {
            if (other->flags & 8) continue;
        } else {
            if (!(other->flags & 8)) continue;
        }
        if (D_801F361C != 0) {
            s32 stage = D_8018F481;
            if ((u8)stage == 0x27) {
                func_0013A558(D_801F361C[unit->field_14], D_801F361C[other->field_14], &first, &second);
                if (!first) blocked = 1;
            } else if ((u32)(stage - 0x2F) < 2 || (u32)(stage - 0x3C) < 2) {
                func_0013AA40(D_801F361C[unit->field_14], D_801F361C[other->field_14], &first, &second);
                if (!first) blocked = 1;
            } else if ((u8)stage == 0x33) {
                func_0013B350(D_801F361C[unit->field_14], D_801F361C[other->field_14], &first, &second);
                if (!first) blocked = 1;
            }
        }
        x = other->field_08;
        if (!(min_x < x)) continue;
        if (!(x < max_x)) continue;
        z = other->field_10;
        if (!(min_z < z)) continue;
        if (!(z < max_z)) continue;
        dx = x - center_x;
        dz = z - center_z;
        if (!(dx * dx + dz * dz < radius * radius)) continue;

        flags = unit->flags;
        if (flags & 8) {
            other_flags = other->flags;
            if (other_flags & 1) {
                if (other_flags & 0x10) {
                    /* Keep the guarded mask as a user scalar: this compiler
                     * hoists bare masks and changes the scan register layout. */
                    u32 mask_00200000 = 0x00200000;
                    if (!(flags & mask_00200000)) {
                        if (!(other_flags & mask_00200000)) {
                            if (small_min_x < x) {
                                if (x < small_max_x) {
                                    if (small_min_z < z) {
                                        if (z < small_max_z) {
                                            dx = x - unit_x;
                                            dz = z - unit_z;
                                            if (dx * dx + dz * dz < small_radius * small_radius) {
                                                if (!(flags & 0x1000)) {
                                                    if (!(other_flags & 0x1000)) {
                                                        if (unit->field_78 == 0 && D_801F0DE0 == 0) {
                                                            if (other->field_78 & 0x10) {
                                                                s32 owner;
                                                                for (owner = 0; owner < 50; owner++) {
                                                                    RuntimeUnit *candidate = D_801F0CB0[owner];
                                                                    if ((candidate->flags & 0x39) == 0x39) {
                                                                        if (candidate->field_78 & 0x10) {
                                                                            if (candidate->field_7C == index) break;
                                                                        }
                                                                    }
                                                                }
                                                                if (owner >= 50) other->field_78 &= ~0x10;
                                                                if (other->field_78 & 0x10) goto membership;
                                                            }
                                                            unit->field_7C = index;
                                                            unit->field_78 |= 0x10;
                                                            other->field_78 |= 0x10;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
membership:
        if (blocked) {
            if (!(unit->flags & 8)) continue;
            if (!(unit->field_78 & 0x10)) continue;
            if (unit->field_7C != index) continue;
        }
        members[count++] = index;
        members[count] = -1;
    }
    if (count != 0) {
        u32 size = (count + 1) * sizeof(s32);
        unit->field_A8 = resource_alloc(size);
        memcpy(members, unit->field_A8, size);
        result = 1;
    }
    return result;
}
