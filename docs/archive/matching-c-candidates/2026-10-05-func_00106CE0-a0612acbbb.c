typedef float f32;
typedef double f64;

extern f64 D_801EE090;

void func_00106CE0(f32 *current, f32 *desired, f32 step)
{
    f32 center = *desired;
    f32 lower = (f32)((f64)center - D_801EE090);
    f32 upper = (f32)((f64)center + D_801EE090);
    f32 next;

    if (lower < *current) {
        if (*current < center) {
            f32 value = *current;

            if (center - value < value - lower) {
                next = value + step * 0.033333335f;
                if (center <= next)
                    goto store_and_copy;
                goto store_only;
            } else {
                f32 decreased = value - step * 0.033333335f;

                *current = decreased;
                if (decreased < 0.0f) {
                    next = decreased + 1.0f;
                    goto finish_decreasing;
                }
                return;
            }
        }
    }
    {
        f32 value = *current;

        if (upper - value < value - center) {
            f32 increased = value + step * 0.033333335f;

            *current = increased;
            if (1.0f <= increased) {
                next = increased - 1.0f;
                goto finish_increasing;
            }
            return;
        } else {
            next = value - step * 0.033333335f;
            goto finish_decreasing;
        }
    }

    /* The final desired read follows the store even when the pointers alias. */
finish_increasing:
    if (center <= next)
        goto store_and_copy;
    goto store_only;

finish_decreasing:
    if (next <= center)
        goto store_and_copy;

store_only:
    *current = next;
    return;

store_and_copy:
    *current = next;
    *current = *desired;
}
