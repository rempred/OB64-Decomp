typedef float f32;
typedef double f64;

extern f64 D_801EE090;

void func_00106CE0(f32 *current, f32 *desired, f32 step)
{
    f32 center = *desired;
    f32 lower = (f32)((f64)center - D_801EE090);
    f32 upper = (f32)((f64)center + D_801EE090);

    /* The original single-precision coefficient is 0x3D088889. */
    if (lower < *current) {
        if (*current < center) {
            f32 value = *current;
        if (center - value < value - lower) {
            f32 next = value + step * 0.033333335f;

            *current = next;
            if (center <= next)
                *current = *desired;
        } else {
            f32 next = value - step * 0.033333335f;

            *current = next;
            if (next < 0.0f) {
                next += 1.0f;
                *current = next;
                if (next <= center)
                    *current = *desired;
            }
        }
            return;
        }
    }
    {
        f32 value = *current;
        if (upper - value < value - center) {
            f32 next = value + step * 0.033333335f;

            *current = next;
            if (1.0f <= next) {
                next -= 1.0f;
                *current = next;
                if (center <= next)
                    *current = *desired;
            }
        } else {
            f32 next = value - step * 0.033333335f;

            *current = next;
            if (next <= center)
                *current = *desired;
        }
    }
}
