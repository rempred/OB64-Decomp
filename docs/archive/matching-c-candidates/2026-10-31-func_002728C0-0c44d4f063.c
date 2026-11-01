#include "common/types.h"
#include "game/effect_math_e04.h"

typedef struct P07Vec3 { float x, y, z; } P07Vec3;
typedef struct P07Render {
    u8 unknown_00[0xA];
    u16 flags_0A;
    s32 value_0C;
    u8 unknown_10[0xC];
    float value_1C[16];
} P07Render;
typedef struct P07State728C0 {
    u32 value_00, value_04;
    P07Render *value_08[3];
    P07Render *value_14, *value_18, *value_1C;
} P07State728C0;

extern void *func_0020C478(u32);
extern P07Render *func_0026abc8(s32);
extern P07Render *func_00269798(s32);
extern void func_00262830(s32);
extern s32 func_00272790(u16, void *);

s32 func_002728C0(u16 message, P07State728C0 *state)
{
    s32 result = 0;
    P07Vec3 position;
    u32 i;
    P07Render **slot;
    s32 *resource;
    void *actor;
    P07Render *object;
    float *destination;

    if (message == 0x1000) {
        actor = func_0020C478(state->value_04);
        i = 0;
        resource = (s32 *)0x80220AA0;
        slot = state->value_08;
        func_0026C7C4(actor, &position);
        do {
            *slot = object = func_0026abc8(*resource++);
            object->value_1C[0] = position.x;
            object->value_1C[1] = position.y;
            object->value_1C[2] = position.z;
            slot++;
        } while (++i < 3);
        state->value_14 = object = func_00269798(0x183);
        object->flags_0A |= 0x1000;
        state->value_14->value_0C = -1000;
        destination = state->value_14->value_1C;
        func_0026C684(actor, destination);
        func_0025F150(destination, &position);
        state->value_18 = object = func_00269798(0x184);
        destination = object->value_1C;
        func_0026C684(actor, destination);
        func_0025F150(destination, &position);
        state->value_1C = object = func_00269798(0x185);
        destination = object->value_1C;
        func_0026C55C(actor, destination);
        func_0025F150(destination, &position);
        func_00262830(0x100A);
    } else {
        result = func_00272790(message, state);
    }
    return result;
}
