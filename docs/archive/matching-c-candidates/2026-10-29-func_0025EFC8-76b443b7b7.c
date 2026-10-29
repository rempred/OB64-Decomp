#include "game/effect_math_e04.h"

typedef struct {
    float x;
    float y;
    float z;
} E04Vec3;

extern float sqrtf(float);

void func_0025EFC8(void *vectorView)
{
    E04Vec3 *vector = (E04Vec3 *)vectorView;
    float inverse;

    inverse = 1.0f / __builtin_sqrtf(vector->x * vector->x
                                  + vector->y * vector->y
                                  + vector->z * vector->z);
    vector->x *= inverse;
    vector->y *= inverse;
    vector->z *= inverse;
}
