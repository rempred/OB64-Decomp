#ifndef OB64_COMMON_MATRIX_FLOAT_H
#define OB64_COMMON_MATRIX_FLOAT_H

/* Four rows of four floats, as consumed by the retail matrix routines. */
void mtx_apply_vec3(float matrix[4][4], float x, float y, float z,
                    float *outX, float *outY, float *outZ);
void func_80098450(float matrix[4][4], float x, float y, float z,
                   float *outX, float *outY, float *outZ);
void func_00028900(float matrix[4][4], float angle, float x, float y, float z);
#endif
