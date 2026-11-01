#include "common/types.h"
#include "game/effect_math_e04.h"

typedef struct P01Vec3 {
    float x;
    float y;
    float z;
} P01Vec3;

typedef s32 (*E08ScalarCallback)(u8 value);
extern E08ScalarCallback g_func_0024BCE8_callbacks[];
extern E08ScalarCallback g_func_0024BF04_callbacks_08[];

struct SupplementBoundsRecord;
extern void *func_0020C478(u32 index);
extern s32 func_0020D590(struct SupplementBoundsRecord *record);
extern float func_001FF7EC(s16 first, s16 second);

void func_0024BF04(u8 value, P01Vec3 *output, s32 flags)
{
    s32 index;
    float third;
    u8 flagBits = (u8)flags;

    if (value < 20) {
        index = 0;
    } else if ((u8)(value - 20) >= 27) {
        /* Preserve the range branch through KMC's early selector pass. */
        s32 valid = (u8)(value - 47) < 40;

        if (valid == 0) {
            index = (u16)(valid | 255);
        } else {
            index = 2;
        }
    } else {
        index = 1;
    }

    output->x = (float)g_func_0024BCE8_callbacks[index](value);
    third = (float)g_func_0024BF04_callbacks_08[index](value);
    output->z = third;

    if (index == 0) {
        output->y = (float)func_0025F7A0(value);
        if (flagBits & 0x20) {
            output->y += (float)func_0020D590(func_0020C478(value));
        } else if (flagBits & 0x10) {
            output->y += (float)(func_0020D590(func_0020C478(value)) / 2);
        }
    } else {
        float second = func_001FF7EC((s16)(s32)output->x, (s16)(s32)third);

        output->y = second;
        if (flagBits & 0x20) {
            output->y = second + 38.0f;
        } else if (flagBits & 0x10) {
            output->y = second + 19.0f;
        }
    }
}
