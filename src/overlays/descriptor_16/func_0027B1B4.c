typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_8022C5C0;
s32 func_0027B1B4(void) {
    s16 *cur = (*(s16 * *)((u8 *)(D_8022C5C0) + (0xC)));
    s16 target = (*(s16 *)((u8 *)(D_8022C5C0) + (0x10)));
    s16 step = (*(s16 *)((u8 *)(D_8022C5C0) + (0x12)));
    s16 delta;
    if (cur != ((void *)0)) {
        s16 d = target - *cur;
        if (d == 0) {
            return 1;
        }
        if (d > 0) {
            delta = target / step;
        } else {
            delta = -((0xFF - target) / step);
        }
        *cur += delta;
        if (delta < 0) {
            if (*cur <= target) {
                *cur = target;
                return 1;
            }
        } else if (*cur >= target) {
            *cur = target;
            return 1;
        }
    }
    return 0;
}
