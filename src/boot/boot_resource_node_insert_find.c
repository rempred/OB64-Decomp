#include "game/boot_archive_record.h"

extern void *func_80071288(u32 bytes);
extern void func_00023780(void *destination, u32 bytes);
extern ResourceNode28 *g_node28_current;

ResourceNode28 *boot_resource_node_insert_find(ResourceNode28 *node, u32 key)
{
    if (node != 0) {
        if (key == node->field_00) {
            g_node28_current = node;
            return node;
        }
        if (key < node->field_00) {
            node->field_14 = boot_resource_node_insert_find(node->field_14, key);
        } else {
            node->field_18 = boot_resource_node_insert_find(node->field_18, key);
        }
    } else {
        node = func_80071288(0x1C);
        g_node28_current = node;
        func_00023780(node, 0x1C);
        node->field_00 = key;
    }
    return node;
}

