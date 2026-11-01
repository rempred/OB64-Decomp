#include "common/types.h"
#include "game/combat_draw_commands.h"

typedef struct E05Descriptor {
    void *data_00;
    u16 value_04, value_06, value_08, value_0A;
} E05Descriptor;
typedef struct E05Vertex {
    u8 unknown_00[8];
    u16 value_08, value_0A;
    u8 unknown_0C[4];
} E05Vertex;

extern s32 D_80220324[];
extern u8 D_80220320[];

#define F COMBAT_DRAW_FIELD
#define PAIR COMBAT_DRAW_PAIR
#define COORD(x, y, prefix) ((prefix) | F((u32)(x) << 2, 12, 12) | F((u32)(y) << 2, 0, 12))
#define LINE(x0, x1, size) (F((((x1) - (x0) + 1) * D_80220320[(size)] + 7) >> 3, 9, 9))
#define TYPE(prefix, format, size) ((prefix) | F((format), 21, 3) | F((size), 19, 2))

void func_00265014(E05Descriptor *descriptor, E05Vertex *vertices, s32 first)
{
    u16 values[4];
    u16 x0, x1, y0, y1;
    s32 i;

    for (i = 0; i < 4; i++) values[i] = vertices[i].value_08;
    {
    u16 *workspace = values;
    s32 pairIndex;
    for (pairIndex = 0; pairIndex < 10;) {
        s32 aIndex = D_80220324[pairIndex++];
        s32 bIndex = D_80220324[pairIndex++];
        if (workspace[bIndex] < workspace[aIndex]) {
            u16 value = workspace[bIndex];
            workspace[bIndex] = workspace[aIndex];
            workspace[aIndex] = value;
        }
    }
    }
    x0 = values[0];
    x1 = values[3];
    for (i = 0; i < 4; i++) vertices[i].value_08 = ((u32)vertices[i].value_08 - x0) << 6;

    for (i = 0; i < 4; i++) values[i] = vertices[i].value_0A;
    {
    u16 *workspace = values;
    s32 pairIndex;
    for (pairIndex = 0; pairIndex < 10;) {
        s32 aIndex = D_80220324[pairIndex++];
        s32 bIndex = D_80220324[pairIndex++];
        if (workspace[bIndex] < workspace[aIndex]) {
            u16 value = workspace[bIndex];
            workspace[bIndex] = workspace[aIndex];
            workspace[aIndex] = value;
        }
    }
    }
    y0 = values[0];
    y1 = values[3];
    for (i = 0; i < 4; i++) vertices[i].value_0A = ((u32)vertices[i].value_0A - y0) << 6;

    PAIR(TYPE(0xFD000000, descriptor->value_08, descriptor->value_0A) | ((descriptor->value_04 - 1) & 0xFFF), (u32)descriptor->data_00);
    PAIR(TYPE(0xF5000000, descriptor->value_08, descriptor->value_0A) | LINE(x0, x1, descriptor->value_0A), 0x07080200);
    PAIR(0xE6000000, 0);
    PAIR(COORD(x0, y0, 0xF4000000), COORD(x1, y1, 0x07000000));
    PAIR(0xE7000000, 0);
    PAIR(TYPE(0xF5000000, descriptor->value_08, descriptor->value_0A) | LINE(x0, x1, descriptor->value_0A), 0x00080200);
    PAIR(0xF2000000, COORD(x1 - x0, y1 - y0, 0));
    PAIR(0x06000000 | F((u32)first << 1, 16, 8) | F((u32)(first + 1) << 1, 8, 8) | F((u32)(first + 2) << 1, 0, 8),
         F((u32)first << 1, 16, 8) | F((u32)(first + 2) << 1, 8, 8) | F((u32)(first + 3) << 1, 0, 8));
}
