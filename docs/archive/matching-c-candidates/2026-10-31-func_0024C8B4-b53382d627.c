extern float sqrtf(float);
extern float func_0002d300(float);

/* Descriptor 11 maps these double loads to ROM 0x25EDC0 and 0x25EDC8. */
extern const double D_8020A200;
extern const double D_8020A208;

float func_0024C8B4(float *vector)
{
    float angle;

    angle = (double)func_0002d300(vector[2] /
                __builtin_sqrtf(vector[0] * vector[0] + vector[2] * vector[2]))
                * D_8020A200 / D_8020A208;
    if (vector[0] < 0.0f) {
        angle = 360.0f - angle;
    }
    return angle;
}
