typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit RuntimeUnit;
typedef struct {
    u8 field00;
    u8 unused01[3];
    f32 field04;
    f32 field08;
} FormationEntry;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))

extern RuntimeUnit *D_801F0CB0[];
extern s32 D_801EB118[][5];
extern FormationEntry D_801EACE0[][5], D_801EAEFC[][5];
extern u8 D_801F0D9C[], D_801F0EBF[], D_801F0ECF[], D_800E7AB9;
extern f64 D_801EE858, D_801EE860;
extern s32 func_0012E950(s32 value);
extern f32 func_0011AE34(void *record);
extern void func_00126D24(RuntimeUnit *unit);
extern void func_00129948(RuntimeUnit *unit);
extern void func_0012D6FC(RuntimeUnit *unit, u8 selector, s32 *state);
extern void func_0012B1C4(RuntimeUnit *owner, void *unused, RuntimeUnit *unit, f32 *point);
extern s32 func_0012B440(RuntimeUnit *first, RuntimeUnit *second, s32 selector,
                      f32 *current, f32 *requested, s32 bypass);
extern void func_0011A9B8(f32 value, f32 *firstOut, f32 *secondOut, f32 *third,
    f32 *first, f32 *second, f32 *fourth, f32 *fifth, s32 count);
extern f32 func_0002CB80(f32 dx, f32 dz);
extern f32 func_800907F0(f32 angle);
extern f32 func_80092DB0(f32 angle);
extern f32 func_801A63FC(s32 selector, f32 x, f32 z);

static inline f32 member_angle(RuntimeUnit *unit, f64 factor)
{
    f32 value = FIELD(unit, f32, 0x18);
    return (f32)((f64)(value + value) * factor);
}

/* Both passes retain four separate trig calls and the real record reload
 * between the two weights. The later pass's point is still published to
 * its local buffer and its height callback remains observable. */
static inline void formation_point(RuntimeUnit *unit, FormationEntry *entry,
                                  f64 factor, f32 scale, f32 *point)
{
    f32 firstWeight = entry->field04 * scale;
    f32 x = func_800907F0(member_angle(unit, factor)) * firstWeight + 0.0f;
    f32 firstSine = func_80092DB0(member_angle(unit, factor)) * firstWeight;
    f32 secondWeight = entry->field08 * scale;
    f32 z = 0.0f - firstSine;
    f32 last;
    x -= func_80092DB0(member_angle(unit, factor)) * secondWeight;
    last = func_800907F0(member_angle(unit, factor)) * secondWeight;
    point[0] = FIELD(unit, f32, 0x08) + x;
    point[2] = FIELD(unit, f32, 0x10) + (z - last);
    point[1] = func_801A63FC(D_800E7AB9, point[0], point[2]);
}

static inline s32 point_index(f32 x, f32 z)
{
    f32 lowZ = FIELD(D_801F0D9C, f32, 0);
    f32 gridZ = (z - lowZ) * 64.0f / (FIELD(D_801F0D9C, f32, 8) - lowZ);
    f32 lowX = FIELD(D_801F0D9C, f32, -4);
    f32 gridX = (x - lowX) * 64.0f / (FIELD(D_801F0D9C, f32, 4) - lowX);
    return ((s32)gridZ << 6) + (s32)gridX;
}

/* The current caller passes a point, an eleven-byte group record, a state
 * pointer and an initialization word. Numeric fields and observed five-
 * entry strides preserve the existing group/formation interfaces. */
void func_0012BC64(f32 *initialPoint, u8 *group, s32 *state, s32 initialized)
{
    s32 indices[5];
    f32 point[3];
    f32 previous[3];
    u8 members[5];
    RuntimeUnit *leader = 0;
    f32 progress = 0.0f;
    f32 step = 0.0f;
    s32 stationary = 0;
    u8 selected = 0;
    s32 special = (FIELD(D_801F0CB0[func_0012E950(group[2])], u32, 0) & 0x4000) != 0;
    s32 *cursor;
    u8 *memberCursor;
    s32 pass;
    f64 factor;
    s32 occupied;

    if (special == 0)
        selected = group[8];
    if (selected == 0) {
        members[0] = group[2];
        members[2] = group[4];
        if (members[2] == 0xFF) {
            members[1] = 0xFF;
            members[2] = group[3];
        } else {
            members[1] = group[3];
        }
        members[3] = group[5];
        if (members[3] == 0xFF) {
            members[3] = group[6];
            members[4] = 0xFF;
        } else {
            members[4] = group[6];
        }
    } else if (selected < 9) {
        members[0] = group[2];
        members[1] = group[3];
        members[2] = group[4];
        members[3] = group[5];
        members[4] = group[6];
    }
    /* The original has no initialization branch for other selector
     * values; no new range guard or default member row is introduced. */
    cursor = indices;
    memberCursor = members;
    do {
        if (*memberCursor == 0xFF) {
            *cursor = -1;
        } else {
            *cursor = func_0012E950(*memberCursor);
            if (initialized == 0) {
                FIELD(D_801F0CB0[*cursor], f32, 0x08) = initialPoint[0];
                FIELD(D_801F0CB0[*cursor], f32, 0x0C) = initialPoint[1];
                FIELD(D_801F0CB0[*cursor], f32, 0x10) = initialPoint[2];
            }
        }
        ++cursor;
        ++memberCursor;
    } while ((s32)cursor < (s32)(indices + 5));

    factor = D_801EE858;
    pass = 0;
    do {
        s32 position = D_801EB118[selected][pass];
        s32 bypass = 0;
        RuntimeUnit *unit;
        RuntimeUnit *other;
        FormationEntry *entry;
        u32 flags;
        if (members[position] == 0xFF)
            goto next_member;
        unit = D_801F0CB0[indices[position]];
        entry = &D_801EACE0[selected][position];
        if (position == 0) {
            void *record;
            leader = unit;
            record = FIELD(leader, void *, 0xA4);
            FIELD(leader, f32, 0x08) = initialPoint[0];
            FIELD(leader, f32, 0x0C) = initialPoint[1];
            FIELD(leader, f32, 0x10) = initialPoint[2];
            if (record != 0)
                step = func_0011AE34(record) * 0.8f;
            goto update_member;
        }
        other = D_801F0CB0[indices[entry->field00]];
        if (FIELD(other, u32, 0) & 0x40000)
            FIELD(unit, u32, 0) |= 0x40000;
        else
            FIELD(unit, u32, 0) &= ~0x40000U;
        flags = FIELD(unit, u32, 0);
        if (flags & 0x1000) {
            FIELD(unit, u32, 0) = flags | 0x40000;
            func_00126D24(unit);
            goto next_member;
        }
        previous[0] = FIELD(unit, f32, 0x08);
        previous[1] = FIELD(unit, f32, 0x0C);
        previous[2] = FIELD(unit, f32, 0x10);
        flags = FIELD(unit, u32, 0);
        if (flags & 2) {
            FIELD(unit, u32, 0) = flags | 0x40000;
            func_0012D6FC(unit, group[9], state);
            goto movement_done;
        }
        if (special != 0 && FIELD(leader, void *, 0xA4) != 0) {
            void *record;
            switch (position) {
            case 1: progress = FIELD(FIELD(leader, void *, 0xA4), f32, 0x1C) + (step + step); break;
            case 2: progress = FIELD(FIELD(leader, void *, 0xA4), f32, 0x1C) + step; break;
            case 3: progress = FIELD(FIELD(leader, void *, 0xA4), f32, 0x1C) - step; break;
            case 4: progress = FIELD(FIELD(leader, void *, 0xA4), f32, 0x1C) - (step + step); break;
            }
            if ((0.0f <= progress) & (progress < 1.0f)) {
                record = FIELD(leader, void *, 0xA4);
                func_0011A9B8(progress, &point[0], &point[2], FIELD(record, f32 *, 8),
                    FIELD(record, f32 *, 0),
                    FIELD(FIELD(leader, void *, 0xA4), f32 *, 4),
                    FIELD(FIELD(leader, void *, 0xA4), f32 *, 12),
                    FIELD(FIELD(leader, void *, 0xA4), f32 *, 16),
                    FIELD(FIELD(leader, void *, 0xA4), s32, 20));
                point[1] = func_801A63FC(D_800E7AB9, point[0], point[2]);
                if ((FIELD(leader, u32, 0) & 0xC000) == 0xC000) {
                    if (FIELD(unit, f32, 0x28) != FIELD(unit, f32, 0x08) ||
                        FIELD(unit, f32, 0x2C) != FIELD(unit, f32, 0x0C) ||
                        FIELD(unit, f32, 0x30) != FIELD(unit, f32, 0x10)) {
                        FIELD(unit, u8, 0x20) = 1;
                        FIELD(unit, s32, 0x24) = 1;
                        FIELD(unit, u32, 0) |= 2;
                        FIELD(unit, f32, 0x28) = point[0];
                        FIELD(unit, f32, 0x2C) = point[1];
                        FIELD(unit, f32, 0x30) = point[2];
                        FIELD(unit, s32, 0x58) = point_index(point[0], point[2]);
                        goto next_member;
                    }
                } else {
                    bypass = 1;
                }
                goto apply_point;
            }
        }
        formation_point(other, entry, factor, 0.8f, point);
apply_point:
        {
            s32 result = func_0012B440(D_801F0CB0[indices[0]], other, group[9],
                                      &FIELD(unit, f32, 0x08), point, bypass);
            if (result > 0) {
                if (result == 1)
                    FIELD(unit, u32, 0) |= 0x40000;
                else if (result == 2)
                    FIELD(unit, u32, 0) &= ~0x10000U;
            } else if (result == -1) {
                FIELD(unit, u32, 0) |= 0x40000;
            } else {
                FIELD(unit, u32, 0) &= ~0x40000U;
            }
        }
        func_0012B1C4(leader, other, unit, previous);
movement_done:
        if ((FIELD(leader, u32, 0) & 0x8000) && !(FIELD(unit, u32, 0) & 2)) {
            if (func_0002CB80(FIELD(unit, f32, 0x08) - previous[0],
                              FIELD(unit, f32, 0x10) - previous[2]) < 0.010986328125f)
                ++stationary;
        }
update_member:
        FIELD(unit, s32, 0x14) = point_index(FIELD(unit, f32, 0x08), FIELD(unit, f32, 0x10));
        if (!(FIELD(unit, u32, 0) & 0x81)) {
            s32 value = FIELD(unit, u8, 0xBA);
            if (value >= 20 || D_801F0EBF[(value - 4) * 18] == 2)
                FIELD(unit, u8, 0xBA) = D_801F0ECF[(value - 4) * 18];
        }
        FIELD(unit, u32, 0) |= 1;
        func_00129948(unit);
        group[1] |= 4;
next_member:
        ++pass;
    } while (pass < 5);

    occupied = 0;
    pass = 0;
    factor = D_801EE860;
    do {
        u8 mode = group[8];
        s32 position = D_801EB118[mode][pass];
        FormationEntry *entry = &D_801EAEFC[mode][position];
        if (members[position] != 0xFF) {
            ++occupied;
            if (position == 0) {
                leader = D_801F0CB0[indices[0]];
            } else {
                RuntimeUnit *other = D_801F0CB0[indices[entry->field00]];
                formation_point(other, entry, factor, 0.8f, point);
            }
        }
        ++pass;
    } while (pass < 5);
    {
        u32 flags = FIELD(leader, u32, 0);
        if (flags & 0x8000) {
            if (stationary == occupied - 1)
                FIELD(leader, u32, 0) = flags & ~0x8000U;
        } else if (!(flags & 0x1000)) {
            s32 remaining = FIELD(leader, s32, 0x88) - 1;
            FIELD(leader, s32, 0x88) = remaining;
            if (remaining < 0)
                FIELD(leader, s32, 0x88) = 0;
        }
    }
}
