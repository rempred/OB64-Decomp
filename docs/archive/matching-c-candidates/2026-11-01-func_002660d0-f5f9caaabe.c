#include "common/types.h"
#include "game/combat_draw_commands.h"

typedef struct E05FloatPoint { float x, y, z, w; } E05FloatPoint;
typedef struct E05Descriptor {
    void *data;
    u16 width, height, format, size;
} E05Descriptor;
typedef struct E05Geometry {
    u8 unknown_00[0x42];
    s16 value_42, value_44;
    u16 value_46, value_48, value_4A, value_4C, value_4E;
    E05Descriptor descriptor;
} E05Geometry;
extern u16 D_80220400[];
extern u16 D_80220E70[15];
extern u8 D_80220350[], D_802203A0[], D_80220E20[];
extern u8 *D_801969B0;
extern float D_801D06FC;
extern void func_80098B60(void *, float, float, float);
extern void func_800989A0(void *, void *, void *);
extern void func_80098C20(void *, float, float, float);
extern void func_002638D0(float, float, float, float *, float *);
extern void func_00265d10(E05Geometry *, float, s32, E05FloatPoint *, float, float, void *);
extern void func_002655a0(E05Descriptor *, void *, void *, s32, s32);

void func_002660d0(E05Geometry *geometry)
{
    E05FloatPoint points[2][128];
    float matrix[4][4];
    float origin[2];
    E05FloatPoint *buffers[2];
    s32 count;
    float angle;

    if (geometry->value_44 <= 0) return;
    if (geometry->value_46 > 128) return;
    if (geometry->value_48 > 2) return;
    if (geometry->descriptor.width < 320) return;
    if (geometry->descriptor.height < 240) return;
    count = geometry->value_44 / D_80220400[geometry->descriptor.size] + 1;
    count += geometry->value_44 % D_80220400[geometry->descriptor.size] != 0;
    if (count >= 128) return;

    if (geometry->value_4E) {
        COMBAT_DRAW_PAIR(0xDE000000, (u32)D_802203A0);
    } else {
        COMBAT_DRAW_PAIR(0xDE000000, (u32)D_80220350);
    }
    COMBAT_DRAW_PAIR(0xFA000000, COMBAT_DRAW_FIELD(D_80220E70[0], 24, 8) |
                     COMBAT_DRAW_FIELD(D_80220E70[1], 16, 8) |
                     COMBAT_DRAW_FIELD(D_80220E70[2], 8, 8) | 255);
    func_80098B60(matrix, D_801D06FC, D_801D06FC, D_801D06FC);
    func_800989A0(matrix, D_80220E20, matrix);
    func_800989A0(geometry, matrix, matrix);
    func_002638D0(matrix[3][0], matrix[3][1], matrix[3][2], &origin[0], &origin[1]);
    func_80098C20(D_801969B0, origin[0], origin[1], 0.0f);
    COMBAT_DRAW_PAIR(0xDA380000, (u32)D_801969B0);
    D_801969B0 += 64;
    if (geometry->value_42 > 0) {
        s32 step;
        s32 done, current;
        float angleStep;

        buffers[0] = points[0];
        buffers[1] = points[1];
        step = D_80220400[geometry->descriptor.size];
        angle = 0.0f;
        func_00265d10(geometry, angle, step, points[0], origin[0], origin[1], matrix);
        done = 0;
        current = 0;
        angleStep = 360.0f / geometry->value_46;
        do {
            s32 next;

            angle += angleStep;
            if (angle >= 360.0f) {
                angle = 0.0f;
                done = 1;
            }
            next = current ^ 1;
            func_00265d10(geometry, angle, step, buffers[next], origin[0], origin[1], matrix);
            func_002655a0(&geometry->descriptor, buffers[current], buffers[next], count,
                          geometry->value_4E);
            current = next;
        } while (!done);
    }
    COMBAT_DRAW_PAIR(0xD8380002, 64);
}
