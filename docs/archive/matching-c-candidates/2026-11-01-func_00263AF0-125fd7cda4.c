#include "common/types.h"

typedef struct E05Command { u32 word0, word1; } E05Command;
typedef struct E05Transform { float matrix[4][4]; float value_40; } E05Transform;
typedef struct E05Object {
    u32 unknown_00;
    E05Transform *transform_04;
    void *list_08;
    void *segment_0C;
    u32 unknown_10;
    void *segment_14;
} E05Object;

extern E05Command *D_800E9BA0;
extern u8 *D_801969B0;
extern void func_800988A0(E05Transform *, void *);

#define E05_EMIT(a, b) do { \
    E05Command *command = D_800E9BA0++; \
    command->word0 = (a); \
    command->word1 = (u32)(b); \
} while (0)

void func_00263AF0(E05Object *object)
{
    E05_EMIT(0xFA000000, (u32)(object->transform_04->value_40 * 255.0f) & 0xFF);
    func_800988A0(object->transform_04, D_801969B0);
    E05_EMIT(0xDA380000, D_801969B0);
    if (object->segment_0C) {
        E05_EMIT(0xE7000000, 0);
        E05_EMIT(0xDB06003C, (u32)object->segment_0C - 0x80000000);
        E05_EMIT(0xE7000000, 0);
        E05_EMIT(0xDE000000, object->list_08);
    }
    E05_EMIT(0xE7000000, 0);
    E05_EMIT(0xDB060038, (u32)object->segment_14 - 0x80000000);
    E05_EMIT(0xE7000000, 0);
    E05_EMIT(0xDE000000, 0x0E000000);
    E05_EMIT(0xD8380002, 0x40);
    D_801969B0 += 0x40;
}
