#include "game/boot_archive_record.h"

extern void *func_000016C4(void *value);

void func_0000A1F8(ResourceNode28 *node)
{
    if (node != 0) {
        func_0000A1F8(node->field_10);
        func_0000A1F8(node->field_14);
        func_0000A1F8(node->field_18);
        if (node->field_0C != 0) {
            func_000016C4(node->field_04);
            node->field_04 = 0;
        }
    }
}
