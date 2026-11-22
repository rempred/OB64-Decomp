#include "game/boot_archive_record.h"

extern u32 func_0002DEF4(u32 key);
extern void *func_00001330(u32 bytes);
extern void *func_0002DFB8(void *destination, u32 key);
extern void *g_resource_context_output;

void boot_resource_node_context_materialize(ResourceNode28 *node, u32 mode)
{
    ResourceArchiveInput input;
    ResourceArchiveRequest output;
    u32 index;
    u32 limit;

    input.field_00 = 0;
    input.buffer = node->field_04;
    input.size = node->field_08;
    if (mode == (u32)-22) {
        if (node->field_04 == 0) {
            node->field_08 = func_0002DEF4(node->field_00);
            if (node->field_08 != 0) {
                func_0002DFB8(
                    (node->field_04 = func_00001330(node->field_08)),
                    node->field_00);
            }
        }
        input.buffer = node->field_04;
        input.size = node->field_08;
        index = 0;
        limit = func_0000B29C(&input);
    } else {
        index = mode;
        limit = index + 1;
    }

    for (; index < limit; index++) {
        node->field_0C = func_00009CB4(node->field_0C, index);
        if (g_boot_resource_context->field_04 == 0) {
            if (mode != (u32)-22) {
                if (node->field_04 == 0) {
                    node->field_08 = func_0002DEF4(node->field_00);
                    if (node->field_08 != 0) {
                        func_0002DFB8(
                            (node->field_04 = func_00001330(node->field_08)),
                            node->field_00);
                    }
                }
                input.buffer = node->field_04;
                input.size = node->field_08;
            }
            output.name = 0;
            output.record_index = index;
            func_8007ACB0(&input, &output, 1);
            g_boot_resource_context->field_04 = output.buffer;
            g_boot_resource_context->field_08 = output.size;
            g_boot_resource_context->field_0C = 1;
        }
    }
    {
        ContextNode24 *context = g_boot_resource_context;
        u32 value = context->field_08;
        /* The accepted sibling's late-merged branch keeps the context live
         * through allocation of this output value in v1. */
        if (context) {
            g_resource_context_output = (void *)value;
        } else {
            g_resource_context_output = (void *)value;
        }
    }
}


