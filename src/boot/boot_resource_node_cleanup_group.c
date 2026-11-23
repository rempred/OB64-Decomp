#include "game/boot_archive_record.h"

extern void *func_000016C4(void *pointer);

void boot_resource_node_recursive_field0c_rewrite(ResourceNode28 *node)
{
    if (node != 0) {
        boot_resource_node_recursive_field0c_rewrite(node->field_10);
        boot_resource_node_recursive_field0c_rewrite(node->field_14);
        boot_resource_node_recursive_field0c_rewrite(node->field_18);
        node->field_0C = boot_resource_node_recursive_child_free(node->field_0C);
    }
}

ContextNode24 *boot_resource_node_recursive_child_free(ContextNode24 *node)
{
    if (node != 0) {
        node->field_10 = boot_resource_node_recursive_child_free(node->field_10);
        node->field_14 = boot_resource_node_recursive_child_free(node->field_14);
        func_000016C4(node->field_04);
        func_000016C4(node);
        node = 0;
    }
    return node;
}

void boot_resource_node_recursive_key_field_clear(ContextNode24 *node, unsigned int key)
{
    if (node != 0) {
        if (key < node->field_00) {
            boot_resource_node_recursive_key_field_clear(node->field_10, key);
        } else if (node->field_00 < key) {
            boot_resource_node_recursive_key_field_clear(node->field_14, key);
        } else {
            func_000016C4(node->field_04);
            node->field_04 = 0;
            node->field_08 = 0;
            node->field_0C = 0;
        }
    }
}

