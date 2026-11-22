#include "game/boot_archive_record.h"

extern u32 func_0002DEF4(u32 key);
extern void *func_00001330(u32 bytes);
extern void *func_0002DFB8(void *destination, u32 key);

ResourceNode28 *boot_resource_node_payload_materialize(ResourceNode28 *node)
{
    if (node->field_04 == 0) {
        node->field_08 = func_0002DEF4(node->field_00);
        if (node->field_08 != 0) {
            func_0002DFB8(
                (node->field_04 = func_00001330(node->field_08)),
                node->field_00);
        }
    }
    return node;
}
