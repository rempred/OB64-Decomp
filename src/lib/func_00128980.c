#include "game/unit_cleanup.h"

typedef unsigned char u8;
typedef int s32;

/* This test uses the signed word at +0x88. */
void func_00128980(void *object)
{
    s32 *field_88 = (s32 *)((u8 *)object + 0x88);

    if (*field_88 < 0) {
        func_001072B8(object);
        *field_88 = 0x5A;
    }
}
