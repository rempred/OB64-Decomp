#include "game/boot_archive_record.h"

extern void *func_80071288(u32 bytes);

ContextNode24 *boot_resource_node_recursive_insert_slot_search(ContextNode24 *node, u32 key)
{
    if (node != 0) {
        if (key == node->field_00) {
            g_boot_resource_context = node;
            return node;
        }
        if (key < node->field_00) {
            node->field_10 = boot_resource_node_recursive_insert_slot_search(node->field_10, key);
        } else {
            node->field_14 = boot_resource_node_recursive_insert_slot_search(node->field_14, key);
        }
    } else {
        node = func_80071288(0x18);
        g_boot_resource_context = node;
        node->field_00 = key;
        node->field_0C = 0;
        node->field_04 = 0;
        node->field_08 = 0;
        node->field_14 = 0;
        node->field_10 = 0;
    }
    return node;
}

static ResourceNode28 **func_0000A160(ResourceNode28 **slot, u32 key)
{
    while (*slot != 0) {
        ResourceNode28 *node = *slot;
        if (key == node->field_00) {
            break;
        }
        if (node->field_00 < key) {
            slot = &node->field_18;
        } else {
            slot = &node->field_14;
        }
    }
    return slot;
}
