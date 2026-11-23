#include "game/boot_archive_record.h"

extern void *func_000016C4(void *pointer);

ResourceNode28 *boot_resource_node_recursive_cleanup_free(ResourceNode28 *node)
{
    if (node != 0) {
        boot_resource_node_recursive_cleanup_free(node->field_10);
        boot_resource_node_recursive_cleanup_free(node->field_14);
        boot_resource_node_recursive_cleanup_free(node->field_18);
        boot_resource_node_recursive_child_free(node->field_0C);
        func_000016C4(node->field_04);
        func_000016C4(node);
        node = 0;
    }
    return node;
}
