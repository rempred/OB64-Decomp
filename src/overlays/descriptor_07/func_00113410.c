typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_801AB850;
extern s32 D_801F0DE0;
extern s32 D_801F3610;
extern f32 D_801F0DB8;
extern f32 D_801F0DBC;
extern f32 D_801F0DC0;
extern f32 D_801F0DC4;
extern f32 *D_8018F58C;
extern u8 D_800E7A90[];
s32 func_00131984(void);
#include "game/camera_f63_view.h"
s32 D_801AA8A4(s32 map, void *cam, f32 x, f32 y, f32 *out);
void func_00113410(f32 speed) {
    f32 p[3];
    f32 dx;
    f32 dz;
    f32 x;
    f32 z;
    u8 h = func_00131984() != 0;
    if (D_801F0DE0 != 2 && D_801F3610 != 0) {
        dx = (f32)(s8)D_801AB850[6] / 128.0f * speed;
        dz = (f32)-(s8)D_801AB850[7] / 128.0f * speed;
        if (!h) {
            D_801AAE10((CamF63 *)D_8018F58C, (*(f32 *)((u8 *)(D_801AB850) + (8))), (*(f32 *)((u8 *)(D_801AB850) + (0xC))), p);
        } else {
            D_801AA8A4(D_800E7A90[0x29], D_8018F58C, (*(f32 *)((u8 *)(D_801AB850) + (8))), (*(f32 *)((u8 *)(D_801AB850) + (0xC))), p);
        }
        x = p[0] + dx;
        z = p[2] + dz;
        if (D_801F0DB8 <= x && x <= D_801F0DC0) {
            D_8018F58C[8] += dx;
            D_8018F58C[5] += dx;
        } else {
            if (x < D_801F0DB8) {
                x = D_801F0DB8;
            } else if (D_801F0DC0 < x) {
                x = D_801F0DC0;
            }
            D_8018F58C[8] += x - p[0];
            D_8018F58C[5] += x - p[0];
            D_801AB850[6] = 0;
        }
        if (D_801F0DBC <= z && z <= D_801F0DC4) {
            D_8018F58C[10] += dz;
            D_8018F58C[7] += dz;
        } else {
            if (z < D_801F0DBC) {
                z = D_801F0DBC;
            } else if (D_801F0DC4 < z) {
                z = D_801F0DC4;
            }
            D_8018F58C[10] += z - p[2];
            D_8018F58C[7] += z - p[2];
            D_801AB850[7] = 0;
        }
    }
}
