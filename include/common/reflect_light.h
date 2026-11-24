#ifndef OB64_COMMON_REFLECT_LIGHT_H
#define OB64_COMMON_REFLECT_LIGHT_H
typedef struct { unsigned char color[3], pad, copy[3], pad2; signed char dir[3]; unsigned char unused[5]; } ReflectLight;
typedef struct { int x1, y1, x2, y2; } Hilite;
void func_00021dd4(void *m, ReflectLight light[2], Hilite *hilite,
 float ex, float ey, float ez, float ax, float ay, float az,
 float ux, float uy, float uz, float l1x, float l1y, float l1z,
 float l2x, float l2y, float l2z, int width, int height);
#endif
