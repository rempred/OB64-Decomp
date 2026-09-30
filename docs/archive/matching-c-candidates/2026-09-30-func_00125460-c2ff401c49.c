typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit RuntimeUnit;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))
extern RuntimeUnit *D_801F0CB0[];
extern f32 D_801F0D98, D_801F0D9C, D_801F0DA0, D_801F0DA4;
extern f64 D_801EE730, D_801EE738;
extern void resource_free(void *object);
extern f32 func_0002CB80(f32 first, f32 second);
extern f32 func_8009CFE0(f32 first, f32 second);
extern f32 func_801A63FC(s32 selector, f32 first, f32 second);
extern f32 func_801A66C8(s32 selector, f32 first, f32 second);
extern void func_0011AB74(f32 value, RuntimeUnit *unit, f32 *firstOut, f32 *secondOut);
extern f32 func_801B2708(RuntimeUnit *unit, f32 first, f32 second);
extern void func_00106CE0(f32 *first, f32 *second, f32 step);
extern void func_0011B344(RuntimeUnit *unit);
extern void func_801D376C(RuntimeUnit *unit);
extern void func_801B27F4(RuntimeUnit *unit, RuntimeUnit *record, RuntimeUnit *other, s32 value);
extern s32 func_801E5730(RuntimeUnit *unit);
extern s32 func_801D92D0(RuntimeUnit *unit);
extern s32 func_801D935C(RuntimeUnit *unit);
extern void func_801DD0E8(RuntimeUnit *unit);
extern void func_801B2B78(RuntimeUnit *unit);
extern s32 func_801DB424(RuntimeUnit *unit, s32 index);

static inline u32 clear_flags(u32 value, u32 mask)
{
    return value & ~mask;
}

static inline s32 keeps_endpoint_snapshot(RuntimeUnit *unit)
{
    return FIELD(unit, u8, 0x04) < 30 && (u32)(FIELD(unit, u8, 0x92) - 1) < 2;
}

static inline void publish_point(RuntimeUnit *unit, f32 x, f32 y, f32 z)
{
    FIELD(unit, f32, 0x0C) = y;
    FIELD(unit, f32, 0x08) = x;
    FIELD(unit, f32, 0x10) = z;
}

/* The current direct caller ignores the result. No float return is inferred
 * from the unrelated value left in f0 on several exits. */
void func_00125460(s32 selector, RuntimeUnit *unit)
{
    u8 *record = FIELD(unit, u8 *, 0xA4);
    f32 oldX = FIELD(unit, f32, 0x08);
    f32 oldZ = FIELD(unit, f32, 0x10);
    f32 oldY = FIELD(unit, f32, 0x0C);
    f32 previous = 0.0f;
    f32 outX, outZ;
    f32 dx, dz;
    s32 completed = 0;

    if (record != 0) {
        f32 height, value;
        previous = FIELD(record, f32, 0x1C);
        func_0011AB74(previous, unit, &outX, &outZ);
        if (FIELD(unit, s32, 0x70) == 1)
            height = func_801A66C8(selector, outX, outZ);
        else
            height = func_801A63FC(selector, outX, outZ);
        publish_point(unit, outX, height, outZ);
        value = func_801B2708(unit, outX, outZ);
        value = FIELD(record, f32, 0x1C) + FIELD(record, f32, 0x18) * (35.0f - value) / 100.0f;
        FIELD(record, f32, 0x1C) = value;
        if (1.0f <= value)
            completed = 1;
    } else {
        f32 distance, value, step;
        if (!(((FIELD(unit, u32, 0x00) & 0x2000) == 0 && FIELD(unit, u8, 0x91) == 1) ||
              ((FIELD(unit, u32, 0x00) & 0x2000) != 0 && FIELD(unit, u8, 0x92) == 1)))
            goto indexed_difference;
        if (FIELD(unit, s32, 0x84) == -1)
            goto indexed_difference;
        dx = FIELD(unit, f32, 0x4C) - FIELD(unit, f32, 0x08);
        dz = FIELD(unit, f32, 0x54) - FIELD(unit, f32, 0x10);
        goto difference_ready;
indexed_difference:
        {
            RuntimeUnit *point = (RuntimeUnit *)((u8 *)unit + (FIELD(unit, s32, 0x24) - 1) * 12);
            dx = FIELD(point, f32, 0x28) - FIELD(unit, f32, 0x08);
            dz = FIELD(point, f32, 0x30) - FIELD(unit, f32, 0x10);
        }
difference_ready:
        distance = func_0002CB80(dx, dz);
        step = 0.01171875f;
        value = func_801B2708(unit, FIELD(unit, f32, 0x08), FIELD(unit, f32, 0x10));
        if (step < distance) {
            f32 factor;
            f32 newZ;
            factor = ((step / distance) * (35.0f - value)) / 100.0f;
            dx *= factor;
            dz *= factor;
            FIELD(unit, f32, 0x08) += dx;
            newZ = FIELD(unit, f32, 0x10) + dz;
            FIELD(unit, f32, 0x10) = newZ;
            if (FIELD(unit, s32, 0x70) == 1)
                FIELD(unit, f32, 0x0C) = func_801A66C8(selector, FIELD(unit, f32, 0x08), newZ);
            else
                FIELD(unit, f32, 0x0C) = func_801A63FC(selector, FIELD(unit, f32, 0x08), newZ);
        } else {
            if (!(((FIELD(unit, u32, 0x00) & 0x2000) == 0 && FIELD(unit, u8, 0x91) == 1) ||
                  ((FIELD(unit, u32, 0x00) & 0x2000) != 0 && FIELD(unit, u8, 0x92) == 1)))
                goto indexed_endpoint;
            if (FIELD(unit, s32, 0x84) == -1)
                goto indexed_endpoint;
            FIELD(unit, f32, 0x08) = FIELD(unit, f32, 0x4C);
            FIELD(unit, f32, 0x10) = FIELD(unit, f32, 0x54);
            goto endpoint_ready;
indexed_endpoint:
            {
                RuntimeUnit *point = (RuntimeUnit *)((u8 *)unit + (FIELD(unit, s32, 0x24) - 1) * 12);
                FIELD(unit, f32, 0x08) = FIELD(point, f32, 0x28);
                point = (RuntimeUnit *)((u8 *)unit + (FIELD(unit, s32, 0x24) - 1) * 12);
                FIELD(unit, f32, 0x10) = FIELD(point, f32, 0x30);
            }
endpoint_ready:
            if (FIELD(unit, s32, 0x70) == 1)
                FIELD(unit, f32, 0x0C) = func_801A66C8(selector, FIELD(unit, f32, 0x08), FIELD(unit, f32, 0x10));
            else
                FIELD(unit, f32, 0x0C) = func_801A63FC(selector, FIELD(unit, f32, 0x08), FIELD(unit, f32, 0x10));
            completed = 1;
        }
    }

    dx = FIELD(unit, f32, 0x08) - oldX;
    dz = FIELD(unit, f32, 0x10) - oldZ;
    if (dx == 0.0f) {
        if (dz > 0.0f)
            FIELD(unit, f32, 0x1C) = 0.75f;
        else if (dz < 0.0f)
            FIELD(unit, f32, 0x1C) = 0.25f;
    } else if (dz == 0.0f) {
        if (dx > 0.0f)
            FIELD(unit, f32, 0x1C) = 0.0f;
        else if (dx < 0.0f)
            FIELD(unit, f32, 0x1C) = 0.5f;
    } else {
        f32 value = (f32)(D_801EE738 - (f64)func_8009CFE0(dz, dx) / D_801EE730);
        FIELD(unit, f32, 0x1C) = value;
        if (value < 0.0f) {
            do {
                FIELD(unit, f32, 0x1C) += 1.0f;
            } while (FIELD(unit, f32, 0x1C) < 0.0f);
        }
        {
            f32 value = FIELD(unit, f32, 0x1C);
            if (1.0f <= value) {
                do {
                    value -= 1.0f;
                    FIELD(unit, f32, 0x1C) = value;
                } while (1.0f <= value);
            }
        }
    }
    func_00106CE0(&FIELD(unit, f32, 0x18), &FIELD(unit, f32, 0x1C), 1.0f);
    if (FIELD(unit, f32, 0x18) != FIELD(unit, f32, 0x1C)) {
        FIELD(unit, f32, 0x08) = oldX;
        FIELD(unit, f32, 0x10) = oldZ;
        FIELD(unit, f32, 0x0C) = oldY;
        if (record != 0)
            FIELD(record, f32, 0x1C) = previous;
        completed = 0;
    }

    if (completed != 0) {
        s32 stopped = 0;
        resource_free(FIELD(unit, void *, 0x68));
        FIELD(unit, void *, 0x68) = 0;
        resource_free(FIELD(unit, void *, 0xA0));
        FIELD(unit, void *, 0xA0) = 0;
        func_0011B344(unit);
        if (!(((FIELD(unit, u32, 0x00) & 0x2000) == 0 && FIELD(unit, u8, 0x91) == 1) ||
              ((FIELD(unit, u32, 0x00) & 0x2000) != 0 && FIELD(unit, u8, 0x92) == 1)))
            goto completion_records;
        if (FIELD(unit, s32, 0x84) != -1) {
            FIELD(unit, s32, 0x84) = -1;
            func_801D376C(unit);
            stopped = 1;
            if (FIELD(unit, s32, 0x84) != -1)
                return;
        }
completion_records:
        if ((FIELD(unit, u32, 0x00) & 0x204) == 4) {
            s32 *list = FIELD(unit, s32 *, 0xA8);
            RuntimeUnit *other = D_801F0CB0[FIELD(unit, s32, 0x80)];
            if (list != 0 && *list != -1) {
                s32 offset = 0;
                do {
                    if (*(s32 *)((u8 *)list + offset) == FIELD(unit, s32, 0x80) &&
                        (FIELD(other, u32, 0x00) & 0x31) == 0x31) {
                        s32 count;
                        f32 lowZ, lowX;
                        f32 z, x;
                        RuntimeUnit *point;
                        RuntimeUnit *slot;
                        point = (RuntimeUnit *)((u8 *)unit + (FIELD(unit, u8, 0x20) - 1) * 12);
                        FIELD(point, f32, 0x28) = FIELD(other, f32, 0x08);
                        point = (RuntimeUnit *)((u8 *)unit + (FIELD(unit, u8, 0x20) - 1) * 12);
                        FIELD(point, f32, 0x30) = FIELD(other, f32, 0x10);
                        point = (RuntimeUnit *)((u8 *)unit + (FIELD(unit, u8, 0x20) - 1) * 12);
                        FIELD(point, f32, 0x2C) = FIELD(other, f32, 0x0C);
                        count = FIELD(unit, u8, 0x20);
                        point = (RuntimeUnit *)((u8 *)unit + (count - 1) * 12);
                        lowZ = D_801F0D9C;
                        z = (FIELD(point, f32, 0x30) - lowZ) * 64.0f / (D_801F0DA4 - lowZ);
                        lowX = D_801F0D98;
                        x = (FIELD(point, f32, 0x28) - lowX) * 64.0f / (D_801F0DA0 - lowX);
                        slot = (RuntimeUnit *)((u8 *)unit + count * 4);
                        FIELD(slot, s32, 0x54) = ((s32)z << 6) + (s32)x;
                        func_801B27F4(unit, slot, other, 0);
                        {
                            u8 limit = FIELD(unit, u8, 0x20);
                            s32 current = FIELD(unit, s32, 0x24);
                            if ((current != limit) & (stopped == 0))
                                FIELD(unit, s32, 0x24) = current + 1;
                        }
                        return;
                    }
                    list = FIELD(unit, s32 *, 0xA8);
                    offset += 4;
                } while (*(s32 *)((u8 *)list + offset) != -1);
            }
            if ((FIELD(unit, u32, 0x00) & 8) && FIELD(unit, u8, 0x04) < 30)
                FIELD(unit, u32, 0x78) |= 2;
            {
                u32 flags = clear_flags(clear_flags(FIELD(unit, u32, 0x00), 4), 0x200);
                u8 count = FIELD(unit, u8, 0x20);
                FIELD(unit, u32, 0x00) = flags;
                if (FIELD(unit, s32, 0x24) == count) {
                    FIELD(unit, u32, 0x00) = flags & ~2U;
                    FIELD(unit, u8, 0x20) = 0;
                    FIELD(unit, s32, 0x6C) = 0;
                    return;
                }
                FIELD(unit, u8, 0x20) = count - 1;
            }
        }
        if (stopped != 0)
            return;
        if (FIELD(unit, s32, 0x24) != FIELD(unit, u8, 0x20)) {
            FIELD(unit, s32, 0x24) += 1;
            FIELD(unit, s32, 0x6C) = 1;
            return;
        }
        {
            u32 flags = FIELD(unit, u32, 0x00);
            u32 cleared = clear_flags(clear_flags(clear_flags(flags, 4), 0x200), 2);
            FIELD(unit, u8, 0x20) = 0;
            FIELD(unit, s32, 0x6C) = 0;
            FIELD(unit, u32, 0x00) = cleared;
            if (flags & 0x2000) {
                FIELD(unit, u32, 0x00) = cleared & ~0x2000U;
            } else if ((flags & 8) && !(FIELD(unit, u32, 0x78) & 2)) {
                if (FIELD(unit, u8, 0x04) < 30) {
                    s32 value = func_801E5730(unit) & 0xFF;
                    if (value != 0) {
                        FIELD(unit, s32, 0x7C) = value;
                        FIELD(unit, u32, 0x78) |= 0x200000;
                    } else {
                        FIELD(unit, u32, 0x78) |= 1;
                    }
                }
                if ((FIELD(unit, u32, 0x78) & 0x200001) &&
                    (func_801D92D0(unit) == 0 || func_801D935C(unit) != 0))
                    FIELD(unit, u32, 0x78) = clear_flags(clear_flags(FIELD(unit, u32, 0x78), 1), 0x200000) | 0x100000;
            }
        }
        if (FIELD(unit, u32, 0x00) & 0x800000)
            FIELD(unit, u32, 0x78) &= ~1U;
        if (!keeps_endpoint_snapshot(unit)) {
            u32 flags = FIELD(unit, u32, 0x00);
            if (!(flags & 0x800000)) {
                if (FIELD(unit, u8, 0x04) < 30) {
                    if (FIELD(unit, s32, 0x74) != -1 && FIELD(unit, u8, 0x92) == 0) {
                        f32 x = FIELD(unit, f32, 0x08);
                        f32 y = FIELD(unit, f32, 0x0C);
                        f32 z = FIELD(unit, f32, 0x10);
                        s32 index = FIELD(unit, s32, 0x14);
                        FIELD(unit, u32, 0x00) = flags | 0x800000;
                        FIELD(unit, f32, 0x4C) = x;
                        FIELD(unit, f32, 0x50) = y;
                        FIELD(unit, f32, 0x54) = z;
                        FIELD(unit, s32, 0x64) = index;
                    } else {
                        FIELD(unit, u32, 0x00) &= ~0x800000U;
                    }
                } else {
                    f32 x = FIELD(unit, f32, 0x08);
                    f32 y = FIELD(unit, f32, 0x0C);
                    f32 z = FIELD(unit, f32, 0x10);
                    s32 index = FIELD(unit, s32, 0x14);
                    FIELD(unit, u32, 0x00) = flags & ~0x800000U;
                    FIELD(unit, f32, 0x4C) = x;
                    FIELD(unit, f32, 0x50) = y;
                    FIELD(unit, f32, 0x54) = z;
                    FIELD(unit, s32, 0x64) = index;
                }
            }
        }
        func_801DD0E8(unit);
        return;
    }

    if ((FIELD(unit, u32, 0x00) & 0x204) != 4 || FIELD(unit, s32, 0x24) != FIELD(unit, u8, 0x20)) {
        if (!(((FIELD(unit, u32, 0x00) & 0x2000) == 0 && FIELD(unit, u8, 0x91) == 1 && FIELD(unit, s32, 0x84) != -1) ||
              ((FIELD(unit, u32, 0x00) & 0x2000) != 0 && FIELD(unit, u8, 0x92) == 1 && FIELD(unit, s32, 0x84) != -1)))
            return;
    }
    {
        u32 timer = FIELD(unit, u32, 0x8C);
        s32 next = timer - 1;
        s32 index, position = 3;
        if (timer >= 91) {
            FIELD(unit, u32, 0x8C) = 90;
            return;
        }
        FIELD(unit, s32, 0x8C) = next;
        if (next >= 0)
            return;
        FIELD(unit, s32, 0x8C) = 90;
        func_801B2B78(unit);
        if ((FIELD(unit, u32, 0x00) & 0x204) == 4 && FIELD(unit, s32, 0x24) == FIELD(unit, u8, 0x20)) {
            index = FIELD(unit, s32, 0x80);
            position = FIELD(unit, s32, 0x24) - 1;
        } else {
            index = FIELD(unit, s32, 0x84);
        }
        if (func_801DB424(unit, index) != 0) {
            RuntimeUnit *point = (RuntimeUnit *)((u8 *)unit + position * 12);
            FIELD(point, f32, 0x28) = FIELD(D_801F0CB0[index], f32, 0x08);
            FIELD(point, f32, 0x2C) = FIELD(D_801F0CB0[index], f32, 0x0C);
            FIELD(point, f32, 0x30) = FIELD(D_801F0CB0[index], f32, 0x10);
            FIELD(unit, s32, 0x58 + position * 4) = FIELD(D_801F0CB0[index], s32, 0x14);
            return;
        }
        if ((FIELD(unit, u32, 0x00) & 0x204) != 4 || FIELD(unit, s32, 0x24) != FIELD(unit, u8, 0x20))
            FIELD(unit, s32, 0x84) = -1;
    }
}
