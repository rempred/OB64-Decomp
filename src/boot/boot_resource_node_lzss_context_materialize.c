typedef unsigned int u32;

typedef struct ResourceNode {
    u32 field_00;
    void *field_04;
    u32 field_08;
    void *field_0C;
} ResourceNode;

typedef struct ResourceContext {
    u32 field_00;
    void *field_04;
    u32 field_08;
    u32 field_0C;
} ResourceContext;

extern void *func_00009CB4(void *node, u32 index);
extern u32 func_0002DEF4(u32 key);
extern void *func_00001330(u32 size);
extern void func_0002DFB8(void *buffer, u32 key);
extern u32 func_0000ABE0(void *buffer);
extern void func_0000A510(void *destination, void *source);

extern ResourceContext *g_boot_resource_context;
extern void *g_resource_context_output;

void func_00009EFC(ResourceNode *node)
{
    register u32 zero asm("$0");
    register u32 first_result asm("$2");

    node = (ResourceNode *)((u32)node + zero);
    asm volatile (
        ".set noreorder\n"
        "lw $4,12($16)\n"
        "jal func_00009CB4\n"
        "addu $5,$0,$0\n"
        ".set reorder\n"
        : "=r"(first_result)
        :
        : "memory");
    node->field_0C = (void *)first_result;
    if (g_boot_resource_context->field_04 == 0) {
        if (node->field_04 == 0) {
            node->field_08 = func_0002DEF4(node->field_00);
            if (node->field_08 != 0) {
                func_0002DFB8(
                    (node->field_04 = (void *)((u32)func_00001330(node->field_08 + zero) + zero)),
                    node->field_00);
            }
        }
        if (node->field_04 != 0) {
            register u32 size asm("$2");
            register u32 arg asm("$4");

            asm volatile (
                ".set noreorder\n"
                "jal func_0000ABE0\n"
                "lw $4,4($16)\n"
                ".set reorder\n"
                : "=r"(size)
                :
                : "memory");
            arg = size + zero;
            g_boot_resource_context->field_08 = arg;
            g_boot_resource_context->field_04 = func_00001330(arg);
            func_0000A510((void *)((u32)g_boot_resource_context->field_04 + zero), node->field_04);
            g_boot_resource_context->field_0C = 2;
        }
    }
    {
        register u32 output asm("$3");

        output = g_boot_resource_context->field_08;
        g_resource_context_output = (void *)output;
    }
}
