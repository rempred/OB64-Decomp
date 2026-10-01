typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;

s32 func_00124520(void *unit, s32 selector, s32 member)
{
    s32 result = 0;
    s32 threshold;
    f32 ratio;

    if (member >= 100 || selector == 4)
        return 0;

    switch (selector) {
    case 1:
        ratio = 0.75f;
        threshold = 75;
        break;
    case 2:
        ratio = 0.5f;
        threshold = 75;
        break;
    case 3:
        ratio = 0.25f;
        threshold = 100;
        break;
    default:
        ratio = 0.0f;
        threshold = 100;
        break;
    }

    if ((*(u32 *)unit & 0x08000000) != 0) {
        u8 *row = (u8 *)0x80190000 + member * 52;
        u32 current = *(u16 *)(row + 0x5578);
        if (current != 0) {
            if (current != *(u16 *)(row + 0x5576))
                result = 1;
            else if (row[0x5592] != 0)
                result = 1;
        }
    } else {
        u8 *row = (u8 *)0x80190000 + member * 52;
        u32 current = *(u16 *)(row + 0x5578);
        if (current != 0) {
            f32 reference = (f32)*(u16 *)(row + 0x5576);
            if ((f32)current < ratio * reference)
                result = 1;
            if (threshold < row[0x5592])
                result = 1;
        }
    }
    return result;
}
