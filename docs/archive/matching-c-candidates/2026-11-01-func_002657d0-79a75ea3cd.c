#include "common/types.h"

typedef struct E05Point { s16 x, y, value_04, value_06; } E05Point;
typedef struct E05Geometry {
    u8 unknown_00[0x42];
    s16 value_42, value_44;
    u8 unknown_46[4];
    s16 value_4A, value_4C;
} E05Geometry;
extern double D_80220B70, D_80220B78;
extern float func_800907F0(float);
extern float func_80092DB0(float);

void func_002657d0(E05Geometry *geometry, float angle, s32 step, E05Point *points)
{
    float radians = (double)angle * D_80220B70 / D_80220B78;
    E05Point *cursor = points;
    s16 i = 0, done = 0;

    do {
        s16 distance = step * i;
        float value;
        if (distance >= geometry->value_44) {
            done = 1;
            distance = geometry->value_44;
        }
        value = distance;
        (*cursor).x = (s32)(value * func_800907F0(radians));
        (*cursor).y = (s32)(value * func_80092DB0(radians));
        (*cursor).value_04 = (*cursor).x + geometry->value_4A;
        {
            s16 y = (*cursor).y;
            (*cursor).value_06 = geometry->value_4C - y;
        }
        cursor++;
        i++;
    } while (!done);
    {
        float scale = (float)(geometry->value_44 - geometry->value_42) /
                      (float)geometry->value_44;
        s16 count = i - 1;
        s16 x = points[count].x;
        s16 y = points[count].y;

        cursor = points;
        for (done = 0; done < count; done++, cursor++) {
            (*cursor).x = (s32)(((*cursor).x - x) * scale + (float)x);
            (*cursor).y = (s32)(((*cursor).y - y) * scale + (float)y);
        }
    }
}
