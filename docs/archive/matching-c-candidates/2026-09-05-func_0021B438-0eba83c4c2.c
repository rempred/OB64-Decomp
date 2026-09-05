typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned char u8;
typedef float f32;

extern void *func_0020C478(s32 index);
extern s32 func_0020C2C0(void *record);

void func_0021B438(void)
{
    s32 owner_index;
    s32 owner_slot;
    s32 other_index;
    s32 other_slot;
    u8 *owner;
    u8 *owner_cursor;
    u8 *other;
    u8 *actor;
    u8 *other_actor;
    s32 owner_value;
    s32 other_value;
    s32 strongest_adjustment;
    s32 adjustment;
    s32 distance;
    s32 dx;
    s32 dy;
    s32 abs_strongest;
    s32 abs_adjustment;
    s16 current;

    for (owner_index = 0; owner_index < 20; owner_index++) {
        owner = (u8 *)func_0020C478(owner_index);
        if (func_0020C2C0(owner) != 0 ||
            (*(s32 *)(owner + 0x40) & 0x800) != 0) {
            continue;
        }

        switch (*(s32 *)(owner + 0x74)) {
        case 2:
        case 8:
            owner_value = 10;
            break;
        case 60:
            owner_value = 0;
            break;
        case 1:
            owner_value = 1;
            break;
        case 6:
        case 7:
        case 12:
        case 14:
        case 19:
        case 33:
        case 45:
        case 48:
        case 50:
            owner_value = 20;
            break;
        default:
            owner_value = 5;
            break;
        }
        owner_cursor = owner;
        for (owner_slot = 0; owner_slot < 3;
             owner_cursor += 4, owner_slot++) {
            actor = *(u8 **)owner_cursor;
            if (actor == 0) {
                continue;
            }

            strongest_adjustment = 0;
            for (other_index = 0; other_index < 20; other_index++) {
                other = (u8 *)func_0020C478(other_index);
                if (func_0020C2C0(other) != 0 || other == owner ||
                    (*(s32 *)(other + 0x40) & 0x800) != 0) {
                    continue;
                }

                switch (*(s32 *)(other + 0x74)) {
                case 2:
                case 8:
                    other_value = 10;
                    break;
                case 60:
                    other_value = 0;
                    break;
                case 1:
                    other_value = 1;
                    break;
                case 6:
                case 7:
                case 12:
                case 14:
                case 19:
                case 33:
                case 45:
                case 48:
                case 50:
                    other_value = 20;
                    break;
                default:
                    other_value = 5;
                    break;
                }
                for (other_slot = 0; other_slot < 3; other_slot++) {
                    other_actor = *(u8 **)(other + other_slot * 4);
                    if (other_actor == 0) {
                        continue;
                    }

                    dx = *(s16 *)(actor + 0x1C) - *(s16 *)(other_actor + 0x1C);
                    if (dx <= 0) {
                        dx = -dx;
                    }
                    dy = *(s16 *)(actor + 0x20) - *(s16 *)(other_actor + 0x20);
                    if (dy <= 0) {
                        dy = -dy;
                    }
                    if (dx < 20 && dy < 20) {
                        distance = (s32)__builtin_sqrtf((f32)(dx * dx + dy * dy));
                        if (owner_value == other_value) {
                            if (*(s16 *)(actor + 0x20) < *(s16 *)(other_actor + 0x20)) {
                                adjustment = distance - 20;
                            } else {
                                adjustment = 20 - distance;
                            }
                            adjustment /= 2;
                        } else if (owner_value < other_value) {
                            if (*(s16 *)(actor + 0x20) < *(s16 *)(other_actor + 0x20)) {
                                adjustment = distance - 20;
                            } else {
                                adjustment = 20 - distance;
                            }
                        } else {
                            adjustment = 0;
                        }

                        abs_strongest = strongest_adjustment;
                        if (abs_strongest < 0) {
                            abs_strongest = -abs_strongest;
                        }
                        abs_adjustment = adjustment;
                        if (abs_adjustment < 0) {
                            abs_adjustment = -abs_adjustment;
                        }
                        if (abs_strongest < abs_adjustment) {
                            strongest_adjustment = adjustment;
                        }
                    }
                }
            }

            current = *(s16 *)(actor + 0x26);
            if (current < strongest_adjustment) {
                if (strongest_adjustment - current < 3) {
                    *(s16 *)(actor + 0x26) = strongest_adjustment;
                } else {
                    *(s16 *)(actor + 0x26) = current + 3;
                }
            } else if (current - strongest_adjustment < 2) {
                *(s16 *)(actor + 0x26) = strongest_adjustment;
            } else {
                *(s16 *)(actor + 0x26) = current - 2;
            }
        }
    }
}
