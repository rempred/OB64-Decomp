#include "common/types.h"
#include "game/combat_draw_commands.h"

typedef struct E05Point { s16 x, y, value_04, value_06; } E05Point;
typedef struct E05Descriptor {
    void *data;
    u16 width, height, format, size;
} E05Descriptor;
typedef struct E05Geometry {
    u8 unknown_00[0x42];
    s16 value_42, value_44;
    u16 value_46, value_48;
    s16 value_4A, value_4C;
    u8 unknown_4E[2];
    E05Descriptor descriptor;
} E05Geometry;
extern u16 D_802203F8[];
extern u8 *D_801969B0;
extern u8 D_80220350[];
extern u16 D_80220E70[15];
extern void func_800988A0(E05Geometry *, void *);
extern void func_002657d0(E05Geometry *, float, s32, E05Point *);
extern void func_002653d8(E05Descriptor *, E05Point *, E05Point *, s32);

void func_00265a28(E05Geometry *geometry)
{
    E05Point points[2][128];
    E05Point *buffers[2];
    s32 count;

    if (geometry->value_44 <= 0) return;
    if (geometry->value_46 > 128) return;
    if (geometry->value_48 > 2) return;
    count = geometry->value_44 / D_802203F8[geometry->descriptor.size] + 1;
    count += geometry->value_44 % D_802203F8[geometry->descriptor.size] != 0;
    if (count >= 128) return;

    func_800988A0(geometry, D_801969B0);
    COMBAT_DRAW_PAIR(0xDA380000, (u32)D_801969B0);
    D_801969B0 += 64;
    COMBAT_DRAW_PAIR(0xDE000000, (u32)D_80220350);
    COMBAT_DRAW_PAIR(0xFA000000, COMBAT_DRAW_FIELD(D_80220E70[0], 24, 8) |
                     COMBAT_DRAW_FIELD(D_80220E70[1], 16, 8) |
                     COMBAT_DRAW_FIELD(D_80220E70[2], 8, 8) | 255);
    if (geometry->value_42 > 0) {
        s32 done;
        float angle;
        s32 step;
        s32 current;
        float angleStep;

        buffers[0] = points[0];
        buffers[1] = points[1];
        angle = 0.0f;
        step = D_802203F8[geometry->descriptor.size];
        func_002657d0(geometry, angle, step, buffers[0]);
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
            func_002657d0(geometry, angle, step, buffers[next]);
            func_002653d8(&geometry->descriptor, buffers[current], buffers[next], count);
            current = next;
        } while (!done);
    }
    COMBAT_DRAW_PAIR(0xD8380002, 64);
}
