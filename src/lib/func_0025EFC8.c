typedef struct {
    float x;
    float y;
    float z;
} Func0025EFC8Vec3;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

void func_0025EFC8(Func0025EFC8Vec3 *vector)
{
    float magnitude;
    register float inverse asm("$f2");

    magnitude = __builtin_sqrtf(
        vector->x * vector->x
        + vector->y * vector->y
        + vector->z * vector->z);
    inverse = 1.0f;
    asm("nop");
    inverse = inverse / magnitude;

    vector->x = vector->x * inverse;
    vector->y = vector->y * inverse;
    vector->z = vector->z * inverse;
}
