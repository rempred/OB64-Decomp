typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit RuntimeUnit;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))

extern RuntimeUnit *D_801F0CB0[];
extern u8 D_801F0D9C[];
extern f64 D_801EE868, D_801EE870;
extern void func_0011AB74(f32 value, RuntimeUnit *unit, f32 *x, f32 *z);
extern f32 func_801A63FC(s32 selector, f32 x, f32 z);
extern f32 func_00106E48(RuntimeUnit *unit, f32 x, f32 z);
extern f32 func_0002CB80(f32 x, f32 z);
extern f32 func_8009CFE0(f32 first, f32 second);
extern void func_00106CE0(f32 *current, f32 *target, f32 amount);
extern void func_000016C4(void *pointer);
extern void func_0011B344(RuntimeUnit *unit);
extern void func_00106F34(RuntimeUnit *unit);
extern void func_00131828(RuntimeUnit *unit);
extern void func_001072B8(RuntimeUnit *unit);
extern s32 func_0012FB64(RuntimeUnit *unit, s32 index);

static inline RuntimeUnit *goal_view(RuntimeUnit *unit, s32 index)
{
    return (RuntimeUnit *)((u8 *)unit + index * 12);
}

static inline s32 point_index(f32 x, f32 z)
{
    f32 lowZ = FIELD(D_801F0D9C, f32, 0);
    f32 gridZ = (z - lowZ) * 64.0f / (FIELD(D_801F0D9C, f32, 8) - lowZ);
    f32 lowX = FIELD(D_801F0D9C, f32, -4);
    f32 gridX = (x - lowX) * 64.0f / (FIELD(D_801F0D9C, f32, 4) - lowX);
    return ((s32)gridZ << 6) + (s32)gridX;
}

/* D6FC and D170 supply four words. The first word goes directly to the
 * height callback; its byte-valued current callers do not prove a narrow
 * formal parameter. No residual interpolation/cleanup registers are inputs. */
void func_0012C788(s32 selector, RuntimeUnit *unit, s32 context, s32 mode)
{
    f32 point[2];
    void *record = FIELD(unit, void *, 0xA4);
    f32 oldX = FIELD(unit, f32, 8);
    f32 oldZ = FIELD(unit, f32, 16);
    u32 oldY = FIELD(unit, u32, 12);
    u32 oldProgress = 0;
    s32 finished = 0;
    f32 dx, dz;
    f32 amount;

    if (record != 0) {
        oldProgress = FIELD(record, u32, 0x1C);
        func_0011AB74(FIELD(record, f32, 0x1C), unit, &point[0], &point[1]);
        FIELD(unit, f32, 12) = func_801A63FC(selector, point[0], point[1]);
        amount = func_00106E48(unit,
            FIELD(unit, f32, 8) = point[0],
            FIELD(unit, f32, 16) = point[1]);
        if (mode == 0)
            amount *= 10.0f / (11.0f - (f32)context);
        else
            amount = 0.9f;
        if (30.0f < amount)
            amount = 30.0f;
        FIELD(record, f32, 0x1C) += FIELD(record, f32, 0x18) * (35.0f - amount) / 100.0f;
        if (1.0f <= FIELD(record, f32, 0x1C))
            finished = 1;
    } else {
        f32 distance;
        f32 minimumStep;
        f32 nextZ;
        dx = FIELD(goal_view(unit, FIELD(unit, s32, 0x24) - 1), f32, 0x28) - oldX;
        dz = FIELD(goal_view(unit, FIELD(unit, s32, 0x24) - 1), f32, 0x30) - oldZ;
        distance = func_0002CB80(dx, dz);
        minimumStep = 0.01171875f;
        amount = func_00106E48(unit, FIELD(unit, f32, 8), FIELD(unit, f32, 16));
        if (mode == 0)
            amount *= 10.0f / (11.0f - (f32)context);
        else
            amount = 0.7f;
        if (30.0f < amount)
            amount = 30.0f;
        if (minimumStep < distance) {
            f32 step = (minimumStep / distance) * (35.0f - amount) / 100.0f;
            dx *= step;
            dz *= step;
            FIELD(unit, f32, 8) += dx;
            nextZ = FIELD(unit, f32, 16) + dz;
        } else {
            FIELD(unit, f32, 8) = FIELD(goal_view(unit, FIELD(unit, s32, 0x24) - 1), f32, 0x28);
            nextZ = FIELD(goal_view(unit, FIELD(unit, s32, 0x24) - 1), f32, 0x30);
            finished = 1;
        }
        FIELD(unit, f32, 16) = nextZ;
        FIELD(unit, f32, 12) = func_801A63FC(selector, FIELD(unit, f32, 8), nextZ);
    }
    dx = FIELD(unit, f32, 8) - oldX;
    dz = FIELD(unit, f32, 16) - oldZ;
    if (dx == 0.0f) {
        if (0.0f < dz)
            FIELD(unit, f32, 0x1C) = 0.75f;
        else if (dz < 0.0f)
            FIELD(unit, f32, 0x1C) = 0.25f;
    } else if (dz == 0.0f) {
        if (0.0f < dx)
            FIELD(unit, f32, 0x1C) = 0.0f;
        else if (dx < 0.0f)
            FIELD(unit, f32, 0x1C) = 0.5f;
    } else {
        FIELD(unit, f32, 0x1C) = (f32)(D_801EE870 - (f64)func_8009CFE0(dz, dx) / D_801EE868);
        while (FIELD(unit, f32, 0x1C) < 0.0f)
            FIELD(unit, f32, 0x1C) += 1.0f;
        while (1.0f <= FIELD(unit, f32, 0x1C))
            FIELD(unit, f32, 0x1C) -= 1.0f;
    }
    if (mode == 0)
        amount = (f32)(6 - context) * 0.1f;
    else
        amount = 0.5f;
    func_00106CE0(&FIELD(unit, f32, 0x18), &FIELD(unit, f32, 0x1C), amount);
    if (FIELD(unit, f32, 0x18) != FIELD(unit, f32, 0x1C)) {
        FIELD(unit, f32, 8) = oldX;
        FIELD(unit, f32, 16) = oldZ;
        FIELD(unit, u32, 12) = oldY;
        if (record != 0)
            FIELD(record, u32, 0x1C) = oldProgress;
        finished = 0;
    }
    if (finished != 0) {
        func_000016C4(FIELD(unit, void *, 0x68));
        FIELD(unit, void *, 0x68) = 0;
        func_000016C4(FIELD(unit, void *, 0xA0));
        FIELD(unit, void *, 0xA0) = 0;
        func_0011B344(unit);
        if ((FIELD(unit, u32, 0) & 0x204) == 4) {
            s32 *list = FIELD(unit, s32 *, 0xA8);
            RuntimeUnit *target = D_801F0CB0[FIELD(unit, s32, 0x80)];
            if (list != 0 && *list != -1) {
                s32 offset = 0;
                do {
                    if (*(s32 *)((u8 *)list + offset) == FIELD(unit, s32, 0x80) &&
                        (FIELD(target, u32, 0) & 0x31) == 0x31) {
                        s32 last;
                        RuntimeUnit *goal;
                        FIELD(goal_view(unit, FIELD(unit, u8, 0x20) - 1), f32, 0x28) = FIELD(target, f32, 8);
                        FIELD(goal_view(unit, FIELD(unit, u8, 0x20) - 1), f32, 0x30) = FIELD(target, f32, 16);
                        FIELD(goal_view(unit, FIELD(unit, u8, 0x20) - 1), f32, 0x2C) = FIELD(target, f32, 12);
                        last = FIELD(unit, u8, 0x20);
                        goal = goal_view(unit, last - 1);
                        FIELD(unit, s32, 0x54 + last * 4) = point_index(FIELD(goal, f32, 0x28), FIELD(goal, f32, 0x30));
                        func_00106F34(unit);
                        if (FIELD(unit, s32, 0x24) != FIELD(unit, u8, 0x20))
                            ++FIELD(unit, s32, 0x24);
                        return;
                    }
                    offset += 4;
                    list = FIELD(unit, s32 *, 0xA8);
                } while (*(s32 *)((u8 *)list + offset) != -1);
            }
            if (FIELD(unit, u32, 0) & 8)
                FIELD(unit, u32, 0x78) |= 2;
            FIELD(unit, u32, 0) &= ~4U;
            FIELD(unit, u32, 0) &= ~0x200U;
            if (FIELD(unit, s32, 0x24) == FIELD(unit, u8, 0x20)) {
                FIELD(unit, u32, 0) &= ~2U;
                FIELD(unit, u8, 0x20) = 0;
                FIELD(unit, s32, 0x6C) = 0;
                if (!(FIELD(unit, u32, 0) & 8) && !(FIELD(unit, u32, 0x90) & 0x00FFFF00)) {
                    FIELD(unit, u32, 0) |= 0x800000;
                    FIELD(unit, f32, 0x4C) = FIELD(unit, f32, 8);
                    FIELD(unit, f32, 0x50) = FIELD(unit, f32, 12);
                    FIELD(unit, f32, 0x54) = FIELD(unit, f32, 16);
                    FIELD(unit, s32, 0x64) = FIELD(unit, s32, 0x14);
                }
                return;
            }
            --FIELD(unit, u8, 0x20);
        }
        if (FIELD(unit, s32, 0x24) != FIELD(unit, u8, 0x20)) {
            ++FIELD(unit, s32, 0x24);
            FIELD(unit, s32, 0x6C) = 1;
            return;
        }
        {
            u32 flags = FIELD(unit, u32, 0);
            u32 cleared = flags;
            FIELD(unit, u8, 0x20) = 0;
            FIELD(unit, s32, 0x6C) = 0;
            cleared &= ~4U;
            cleared &= ~0x200U;
            cleared &= ~2U;
            cleared &= ~0x40000U;
            FIELD(unit, u32, 0) = cleared;
            if (mode == 0 && (flags & 8) && !(FIELD(unit, u32, 0x78) & 2)) {
                u8 value = FIELD(unit, u8, 0xB5);
                if (value != 0xFF) {
                    FIELD(unit, u8, 0xB5) = 0xFF;
                    FIELD(unit, u32, 0) |= 2;
                    FIELD(unit, f32, 0x1C) = (f32)value / 8.0f;
                }
                FIELD(unit, u32, 0x78) |= 1;
                if (FIELD(unit, u32, 0) & 0x800000)
                    FIELD(unit, u32, 0x78) &= ~1U;
            } else if (!(FIELD(unit, u32, 0) & 8)) {
                if (FIELD(unit, u8, 0x91) != 0)
                    FIELD(unit, u8, 0x91) = 0;
                if (!(FIELD(unit, u32, 0x90) & 0x00FFFF00)) {
                    FIELD(unit, u32, 0) |= 0x800000;
                    FIELD(unit, f32, 0x4C) = FIELD(unit, f32, 8);
                    FIELD(unit, f32, 0x50) = FIELD(unit, f32, 12);
                    FIELD(unit, f32, 0x54) = FIELD(unit, f32, 16);
                    FIELD(unit, s32, 0x64) = FIELD(unit, s32, 0x14);
                }
            }
        }
        func_00131828(unit);
    } else if (((FIELD(unit, u32, 0) & 0x204) == 4 && FIELD(unit, s32, 0x24) == FIELD(unit, u8, 0x20)) ||
               (FIELD(unit, u8, 0x91) == 1 && FIELD(unit, s32, 0x84) != -1)) {
        u32 value = FIELD(unit, u32, 0x8C);
        s32 remaining = value - 1;
        if (value >= 0x5B) {
            FIELD(unit, s32, 0x8C) = 0x5A;
        } else {
            FIELD(unit, s32, 0x8C) = remaining;
            if (remaining < 0) {
                s32 index, slot = 3;
                FIELD(unit, s32, 0x8C) = 0x5A;
                func_001072B8(unit);
                if ((FIELD(unit, u32, 0) & 0x204) == 4 && FIELD(unit, s32, 0x24) == FIELD(unit, u8, 0x20)) {
                    index = FIELD(unit, s32, 0x80);
                    slot = FIELD(unit, s32, 0x24) - 1;
                } else {
                    index = FIELD(unit, s32, 0x84);
                }
                if (func_0012FB64(unit, index)) {
                    RuntimeUnit *goal = goal_view(unit, slot);
                    FIELD(goal, f32, 0x28) = FIELD(D_801F0CB0[index], f32, 8);
                    FIELD(goal, f32, 0x2C) = FIELD(D_801F0CB0[index], f32, 12);
                    FIELD(goal, f32, 0x30) = FIELD(D_801F0CB0[index], f32, 16);
                    FIELD(unit, s32, 0x58 + slot * 4) = FIELD(D_801F0CB0[index], s32, 0x14);
                } else if ((FIELD(unit, u32, 0) & 0x204) != 4 || FIELD(unit, s32, 0x24) != FIELD(unit, u8, 0x20)) {
                    FIELD(unit, s32, 0x84) = -1;
                }
            }
        }
    }
}
