#include "common/types.h"
#include "game/combat_draw_commands.h"

typedef struct E05Point6 { s16 x, y; u8 value_04, value_05; } E05Point6;
typedef struct E05Object {
    u8 unknown_00[0x40];
    u8 color[4];
    u16 mode_44, plane_46;
    s16 value_48, value_4A;
} E05Object;
extern u8 *D_801969B0;
extern u8 D_80220410[];
extern E05Point6 D_80220460;
extern void func_800988A0(void *, void *);
extern float func_800907F0(float);
extern float func_80092DB0(float);
extern void func_002664b0(E05Point6 *, E05Point6 *, s32, s32);

void func_002667c0(E05Object *object)
{
    E05Point6 points[128];

    if (object->value_4A > 128) return;
    COMBAT_DRAW_PAIR(0xDE000000, (u32)D_80220410);
    func_800988A0(object, D_801969B0);
    COMBAT_DRAW_PAIR(0xDA380000, (u32)D_801969B0);
    COMBAT_DRAW_PAIR(0xFA000000, (object->color[0] << 24) |
                     (object->color[1] << 16) | (object->color[2] << 8) |
                     object->color[3]);
    if (object->mode_44 == 0) {
        float angle = 0.0f;
        float radius = object->value_48;
        float step = 360.0f / object->value_4A;
        E05Point6 *cursor = points;
        float radiansPerDegree = 0.017453292f;
        s32 i = 0;

        do {
            float radians = angle * radiansPerDegree;

            cursor->x = (s32)(radius * func_800907F0(radians));
            cursor->y = (s32)(radius * func_80092DB0(radians));
            cursor->value_04 = 255;
            i++;
            cursor++;
            angle += step;
        } while (angle < 360.0f);
        func_002664b0(&D_80220460, points, i, object->plane_46);
    }
    COMBAT_DRAW_PAIR(0xD8380002, 64);
    D_801969B0 += 64;
}
