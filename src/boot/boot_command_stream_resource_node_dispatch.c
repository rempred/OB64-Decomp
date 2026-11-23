#include "game/boot_archive_record.h"
#include "game/boot_command_stream.h"

extern ResourceNode28 *g_command_resource_root;
extern ResourceNode28 **func_0000A160(ResourceNode28 **slot, u32 key);
extern void *func_000016C4(void *pointer);

#define NEXT_WORD(cursor) \
    ((cursor) = (char *)(((u32)(cursor) + 3) & ~3U) + 4, *(u32 *)((cursor) - 4))

/* KMC spills all four argument words before the frame. The named first word
 * selects the resource or whole-tree operation; optional words follow it. */
void boot_command_stream_resource_node_dispatch(u32 resourceKey, ...)
{
    u32 key = resourceKey;
    char *cursor;
    ResourceNode28 **slot;
    ResourceNode28 *node;

    switch (key) {
    case (u32)-17:
        g_command_resource_root = boot_resource_node_recursive_cleanup_free(g_command_resource_root);
        return;
    case (u32)-18:
        func_0000A1F8(g_command_resource_root);
        return;
    case (u32)-19:
        boot_resource_node_recursive_field0c_rewrite(g_command_resource_root);
        return;
    }

    slot = func_0000A160(&g_command_resource_root, key);
    if (*slot == 0) {
        return;
    }
    cursor = (char *)__builtin_next_arg(resourceKey);
    key = NEXT_WORD(cursor);
    while (key < (u32)-23) {
        ResourceNode28 *nested_node = *slot;
        slot = func_0000A160(&nested_node->field_10, ((u32 *)nested_node->field_04)[key]);
        if (*slot == 0) {
            return;
        }
        key = NEXT_WORD(cursor);
    }

    node = *slot;
    switch (key) {
    case (u32)-17:
        if (node->field_18 == 0) {
            *slot = node->field_14;
        } else if (node->field_14 == 0) {
            *slot = node->field_18;
        } else {
            ResourceNode28 **replacement_slot = &node->field_14;
            ResourceNode28 *replacement;
            while ((*replacement_slot)->field_18 != 0) {
                replacement_slot = &(*replacement_slot)->field_18;
            }
            replacement = *replacement_slot;
            *replacement_slot = replacement->field_14;
            replacement->field_14 = node->field_14;
            replacement->field_18 = node->field_18;
            *slot = replacement;
        }
        boot_resource_node_recursive_cleanup_free(node->field_10);
        boot_resource_node_recursive_child_free(node->field_0C);
        func_000016C4(node->field_04);
        func_000016C4(node);
        break;
    case (u32)-18:
        func_0000A1F8(node->field_10);
        if (node->field_0C != 0) {
            func_000016C4(node->field_04);
            node->field_04 = 0;
        }
        break;
    case (u32)-19:
        boot_resource_node_recursive_field0c_rewrite(node->field_10);
        node->field_0C = boot_resource_node_recursive_child_free(node->field_0C);
        break;
    case (u32)-20:
        boot_resource_node_recursive_key_field_clear(node->field_0C, *(u32 *)cursor);
        break;
    }
}



