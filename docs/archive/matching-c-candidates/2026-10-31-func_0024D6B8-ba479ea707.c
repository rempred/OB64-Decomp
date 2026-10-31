#include "common/types.h"
#include "game/effect_math_e04.h"

typedef struct P05Vec3 {
    float x, y, z;
} P05Vec3;

typedef struct P05BuilderSpec {
    u16 value_00;
    u8 attributes_02;
    u8 unknown_03;
    u16 flags_04;
} P05BuilderSpec;

/* Partial view. The transform paths use storage at +0x1C as a matrix. */
typedef struct P05BuilderObject {
    u8 unknown_00[10];
    u16 flags_0A;
    s32 value_0C;
    u8 unknown_10[12];
    P05Vec3 position;
    P05Vec3 scale;
} P05BuilderObject;

typedef P05BuilderObject *(*P05BuilderFactory)(u32);
extern P05BuilderFactory D_80209718[];
extern P05Vec3 D_8020A230;
extern float D_80220EE0[];

static __inline__ void p05_uniform_scale(float scale, void *matrix)
{
    P05Vec3 scaling;

    scaling.x = scaling.y = scaling.z = scale;
    func_0025F080(&scaling, matrix, matrix);
}

P05BuilderObject *func_0024D6B8(P05Vec3 *vector, P05BuilderSpec *spec, float scale)
{
    s32 mode = spec->attributes_02 & 3;

    switch ((u8)mode) {
    case 0: {
        P05BuilderObject *object;
        u16 flags;
        s16 value;

        object = D_80209718[0](spec->value_00);
        flags = spec->flags_04;
        object->flags_0A |= flags & 0xD000;
        if (flags & 0x1000) {
            if (flags & 0x400) {
                if (flags & 0x800) value = 10000;
                else value = -10000;
            } else {
                if (flags & 0x800) value = 1000;
                else value = -1000;
            }
            object->value_0C = value;
        }
        object->position.x = vector->x;
        object->position.y = vector->y;
        object->position.z = vector->z;
        object->scale.x = object->scale.y = object->scale.z = scale;
        return object;
    }
    case 1: {
        P05BuilderObject *object;
        u16 flags;
        s16 value;
        u8 attributes;
        P05Vec3 basis;
        P05Vec3 *position;

        object = D_80209718[1](spec->value_00);
        flags = spec->flags_04;
        object->flags_0A |= flags & 0xD000;
        if (flags & 0x1000) {
            if (flags & 0x400) {
                if (flags & 0x800) value = 10000;
                else value = -10000;
            } else {
                if (flags & 0x800) value = 1000;
                else value = -1000;
            }
            object->value_0C = value;
        }
        attributes = spec->attributes_02;
        basis = D_8020A230;
        position = &object->position;
        if (attributes & 0x40) {
            func_0025F058(D_80220EE0, position);
        } else {
            if (attributes & 0x80) {
                basis.x = -vector->x < 0.0f ? -1.0f : 1.0f;
            }
            func_0026C230(&basis, position);
        }
        func_0025F150(position, vector);
        p05_uniform_scale(scale, position);
        return (P05BuilderObject *)((u8 *)position - 0x1C);
    }
    case 2: {
        P05BuilderObject *object;
        u16 flags;
        s16 value;
        u8 attributes;
        P05Vec3 basis;
        P05Vec3 *position;

        object = D_80209718[2](spec->value_00);
        flags = spec->flags_04;
        object->flags_0A |= flags & 0xD000;
        if (flags & 0x1000) {
            if (flags & 0x400) {
                if (flags & 0x800) value = 10000;
                else value = -10000;
            } else {
                if (flags & 0x800) value = 1000;
                else value = -1000;
            }
            object->value_0C = value;
        }
        attributes = spec->attributes_02;
        basis = D_8020A230;
        position = &object->position;
        if (attributes & 0x40) {
            func_0025F058(D_80220EE0, position);
        } else {
            if (attributes & 0x80) {
                basis.x = -vector->x < 0.0f ? -1.0f : 1.0f;
            }
            func_0026C230(&basis, position);
        }
        func_0025F150(position, vector);
        p05_uniform_scale(scale, position);
        return (P05BuilderObject *)((u8 *)position - 0x1C);
    }
    }
    return 0;
}
