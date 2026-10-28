#include "common/types.h"

typedef struct {
    float x;
    float y;
    float z;
} E01Vec3;

extern float D_801D0710;
extern float D_801D0720;
extern float D_801D072C;
extern float D_801D0704;
extern float D_801D0730;
extern float D_801D083C;
extern float D_801D0700;
extern float D_80220E90[4][4];
extern float D_80220E20[4][4];
extern float D_80220FF0[16];
extern float D_80220EE0[16];
extern float D_80220F28[16];
extern E01Vec3 D_80220ED0;

void func_00022720(float matrix[4][4], u16 *normalization, float fovy,
                   float aspect, float near, float far, float scale);
void func_00020d40(float matrix[4][4], float ex, float ey, float ez,
                   float ax, float ay, float az, float ux, float uy, float uz);
void func_0025EEF8(E01Vec3 *left, E01Vec3 *right, E01Vec3 *result);
void func_0025EFC8(E01Vec3 *vector);

void func_0025F800(void)
{
    float basis[9];
    u16 normalization;
    E01Vec3 *up;
    E01Vec3 *direction;
    float *destination;
    float *source;
    s32 i;

    func_00022720(D_80220E90, &normalization, D_801D0710,
                  1.3333333730697632f, 1.0f, 4000.0f, 1.0f);
    func_00020d40(D_80220E20, D_801D0720, D_801D072C, D_801D0704,
                  D_801D0730, D_801D083C, D_801D0700, 0.0f, 1.0f, 0.0f);

    up = (E01Vec3 *)&basis[3];
    direction = (E01Vec3 *)&basis[6];
    up->x = 0.0f;
    up->y = 1.0f;
    up->z = 0.0f;
    direction->x = D_801D0720 - D_801D0730;
    direction->y = D_801D072C - D_801D083C;
    direction->z = D_801D0704 - D_801D0700;
    func_0025EEF8(up, direction, (E01Vec3 *)basis);
    func_0025EEF8(direction, (E01Vec3 *)basis, up);
    func_0025EFC8((E01Vec3 *)basis);
    func_0025EFC8(up);
    func_0025EFC8(direction);

    i = 0;
    destination = D_80220FF0;
    source = basis;
    for (; i < 15; i++, destination++) {
        if (((i & 3) == 3) | (i >= 12)) {
            *destination = 0.0f;
        } else {
            *destination = *source++;
        }
    }
    D_80220FF0[i] = 1.0f;

    up = (E01Vec3 *)&basis[3];
    direction = (E01Vec3 *)&basis[6];
    up->x = 0.0f;
    up->y = 1.0f;
    up->z = 0.0f;
    D_80220ED0.x = direction->x;
    D_80220ED0.y = direction->y;
    D_80220ED0.z = direction->z;
    direction->x = D_801D0720 - D_801D0730;
    direction->y = D_801D072C - D_801D083C;
    direction->z = D_801D0704 - D_801D0700;
    func_0025EEF8(up, direction, (E01Vec3 *)basis);
    func_0025EEF8((E01Vec3 *)basis, up, direction);
    func_0025EFC8((E01Vec3 *)basis);
    func_0025EFC8(direction);

    i = 0;
    destination = D_80220EE0;
    source = basis;
    for (; i < 15; i++, destination++) {
        if (((i & 3) == 3) | (i >= 12)) {
            *destination = 0.0f;
        } else {
            *destination = *source++;
        }
    }
    D_80220EE0[i] = 1.0f;

    up = (E01Vec3 *)&basis[3];
    direction = (E01Vec3 *)&basis[6];
    up->x = 0.0f;
    up->y = 1.0f;
    up->z = 0.0f;
    direction->x = D_801D0730 - D_801D0720;
    direction->y = D_801D083C - D_801D072C;
    direction->z = D_801D0700 - D_801D0704;
    func_0025EEF8(up, direction, (E01Vec3 *)basis);
    func_0025EEF8((E01Vec3 *)basis, up, direction);
    func_0025EFC8((E01Vec3 *)basis);
    func_0025EFC8(direction);

    i = 0;
    destination = D_80220F28;
    source = basis;
    for (; i < 15; i++, destination++) {
        if (((i & 3) == 3) | (i >= 12)) {
            *destination = 0.0f;
        } else {
            *destination = *source++;
        }
    }
    D_80220F28[i] = 1.0f;
}
