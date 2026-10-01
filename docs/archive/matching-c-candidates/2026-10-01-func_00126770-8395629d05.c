typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef struct RuntimeUnit RuntimeUnit;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))
extern u8 D_801969B8[];
extern RuntimeUnit *D_801F0CB0[];
extern s32 func_0012E968(RuntimeUnit *unit);
extern s32 func_0012E9F4(RuntimeUnit *unit);
extern s32 func_0012E950(s32 index);

static inline f32 reflected_heading(RuntimeUnit *unit, RuntimeUnit *leader,
                                    f32 displacement, f32 adjustment,
                                    f32 origin, s32 halfTurn)
{
    f32 base, leaderHeading, difference, result;
    if (FIELD(unit, u32, 0) & 2)
        base = FIELD(unit, f32, 0x18);
    else
        base = FIELD(leader, f32, 0x18) - displacement;
    if (base < 0.0f)
        base += 1.0f;
    leaderHeading = FIELD(leader, f32, 0x18);
    difference = base - leaderHeading;
    if (difference < 0.0f)
        difference += 1.0f;
    if (halfTurn) {
        difference -= 0.5f;
        if (difference < 0.0f)
            difference += 1.0f;
    }
    /* Keep the actual signed adjustment operations. A zero adjustment is
     * omitted, preserving the first and fourth cases' float sequence. */
    if (adjustment < 0.0f)
        difference -= -adjustment;
    else if (adjustment > 0.0f)
        difference += adjustment;
    result = origin - difference + leaderHeading;
    while (result < 0.0f)
        result += 1.0f;
    while (1.0f <= result)
        result -= 1.0f;
    return result;
}

/* The original separate eight-word switch table covers all selectors1..8.
 * Its original data owner remains production during this research. The
 * eleven-byte group stride and unchecked row/member results are retained. */
f32 func_00126770(RuntimeUnit *first, RuntimeUnit *unit)
{
    s32 row = func_0012E968(first);
    s32 member = func_0012E9F4(first);
    u8 *group = D_801969B8 + row * 11;
    RuntimeUnit *leader = D_801F0CB0[func_0012E950(group[2])];
    if (FIELD(leader, u32, 0) & 0xC000)
        return FIELD(unit, f32, 0xAC);
    switch (group[8]) {
    case 1:
    case 7:
    case 8:
        return reflected_heading(unit, leader, 0.5f, 0.0f, 1.0f, 1);
    case 2:
left:
        return reflected_heading(unit, leader, 0.5f, -0.125f, 1.125f, 1);
    case 3:
right:
        return reflected_heading(unit, leader, 0.5f, 0.125f, 0.875f, 1);
    case 4:
        return reflected_heading(unit, leader, 0.25f, 0.0f, 1.0f, 0);
    case 5:
    case 6:
        if ((member == 1) | (member == 3))
            goto left;
        goto right;
    default:
        if ((member == 1) | (member == 3))
            goto right;
        goto left;
    }
}
