#include "common/types.h"
#include "game/combat_draw.h"
#include "game/combat_draw_commands.h"

typedef struct E05Point { u16 value_00, value_02, value_04, value_06; } E05Point;
struct E05Descriptor;
extern CombatDrawVertex *D_80197178;
extern void func_00265014(struct E05Descriptor *, CombatDrawVertex *, s32);

void func_002653d8(struct E05Descriptor *descriptor, E05Point *first,
                  E05Point *second, s32 count)
{
    struct {
        E05Point *points[4];
        CombatDrawVertex *cursor;
    } work;
    s32 i, j;
    work.cursor = D_80197178;

    for (i = -1; count - 1 > ++i;) {
        s32 point;
        work.points[0] = second;
        work.points[1] = second + 1;
        work.points[2] = first + 1;
        work.points[3] = first;
        for (point = 0; point < 4; point++) {
            D_80197178->x = work.points[point]->value_00;
            D_80197178->y = work.points[point]->value_02;
            D_80197178->field_04 = 0;
            D_80197178->field_06 = 0;
            D_80197178->u = work.points[point]->value_04;
            D_80197178->v = work.points[point]->value_06;
            D_80197178->field_0C[0] = 0;
            D_80197178->field_0C[1] = 0;
            D_80197178->field_0C[2] = 0;
            D_80197178->field_0C[3] = 255;
            D_80197178++;
        }
        first++;
        second++;
    }
    count = (count - 1) * 4;
    while (count >= 4) {
        CombatDrawVertex *chunk;
        i = 32;
        if (count < 32) i = count;
        count -= i;
        chunk = work.cursor;
        COMBAT_DRAW_PAIR(0x01000000 | COMBAT_DRAW_FIELD(i, 12, 8) |
                         COMBAT_DRAW_FIELD(i, 1, 7), (u32)chunk);
        for (j = 0; j < i; j += 4) {
            func_00265014(descriptor, chunk, j);
            chunk += 4;
        }
        work.cursor = chunk;
    }
}
