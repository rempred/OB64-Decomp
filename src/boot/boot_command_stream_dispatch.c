#include "game/boot_archive_record.h"

extern ResourceNode28 *g_command_resource_root;
extern ResourceNode28 *g_node28_current;
extern void *g_resource_context_output;
extern void *func_000016C4(void *pointer);

#define NEXT_WORD(cursor) \
    ((cursor) = (char *)(((u32)(cursor) + 3) & ~3U) + 4, *(u32 *)((cursor) - 4))

/* Use the original first word directly, then start the optional-word cursor after it. */
void *boot_command_stream_dispatch(u32 resourceKey, ...)
{
    u32 key;
    char *cursor;
    ResourceNode28 *node;
    u32 result;
    u32 index;

    g_command_resource_root = boot_resource_node_insert_find(g_command_resource_root, resourceKey);
    cursor = (char *)__builtin_next_arg(resourceKey);
    key = NEXT_WORD(cursor);
    while (key < (u32)-23) {
        ResourceNode28 *current = g_node28_current;
        boot_resource_node_payload_materialize(current);
        current->field_10 = boot_resource_node_insert_find(current->field_10, ((u32 *)current->field_04)[key]);
        key = NEXT_WORD(cursor);
    }

    node = g_node28_current;
    result = 0;
    switch (key) {
    case (u32)-4:
    case (u32)-3:
        boot_resource_node_context_materialize(node, *(u32 *)cursor);
        break;
    case (u32)-6:
    case (u32)-5:
        boot_resource_node_context_materialize(node, (u32)-22);
        break;
    case (u32)-10:
    case (u32)-9:
        func_00009EFC(node);
        break;
    case (u32)-14:
    case (u32)-13:
        boot_resource_node_overlay_context_materialize(node);
        break;
    case (u32)-1:
        boot_resource_node_payload_materialize(node);
        result = (u32)node->field_04;
        g_resource_context_output = (void *)node->field_08;
        break;
    case (u32)-12:
    case (u32)-11:
    case (u32)-8:
    case (u32)-7:
    case (u32)-2:
        result = node->field_08 >> 2;
        for (index = 0; index < result; index++) {
            node->field_10 = boot_resource_node_insert_find(node->field_10, ((u32 *)node->field_04)[index]);
            boot_resource_node_payload_materialize(g_node28_current);
            switch (key) {
            case (u32)-8:
            case (u32)-7:
                boot_resource_node_context_materialize(g_node28_current, (u32)-22);
                break;
            case (u32)-12:
            case (u32)-11:
                func_00009EFC(node);
                break;
            case (u32)-16:
            case (u32)-15:
                boot_resource_node_overlay_context_materialize(node);
                break;
            }
            if ((key == (u32)-8) | (key == (u32)-12)) {
                func_000016C4(node->field_04);
                node->field_04 = 0;
            }
        }
        break;
    }
    if (result == 0) {
        result = (u32)g_boot_resource_context->field_04;
    }
    switch (key) {
    case (u32)-14:
    case (u32)-10:
    case (u32)-9:
    case (u32)-6:
    case (u32)-4:
    case (u32)-3:
        func_000016C4(node->field_04);
        node->field_04 = 0;
        break;
    }
    return (void *)result;
}
