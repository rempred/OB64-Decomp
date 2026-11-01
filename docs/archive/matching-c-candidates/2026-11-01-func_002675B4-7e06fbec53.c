#include "common/types.h"
#include "game/combat_draw_commands.h"

typedef struct E05Referenced {
    u8 unknown_00[0x40];
    float value_40;
} E05Referenced;
typedef struct E05Object {
    u8 unknown_00[0x1C];
    E05Referenced *value_1C;
} E05Object;
extern u8 D_802205D0[];
extern void func_002673F0(void *);

s32 func_002675B4(E05Object *object)
{
    void *embedded = (u8 *)object + 0x18;

    COMBAT_DRAW_PAIR(0xDE000000, (u32)D_802205D0);
    COMBAT_DRAW_PAIR(0xFA000000, (u32)(object->value_1C->value_40 * 255.0f) & 255);
    func_002673F0(embedded);
    return 0;
}
