typedef struct ResourceNode {
    unsigned int field_00;
    void *field_04;
    unsigned int field_08;
    void *field_0C;
    struct ResourceNode *field_10;
    struct ResourceNode *field_14;
    struct ResourceNode *field_18;
} ResourceNode;

extern void func_000016C4(void *value);

void func_0000A1F8(ResourceNode *node)
{
    register ResourceNode *saved_node asm("$16");
    register int zero asm("$0");

    saved_node = (ResourceNode *)((unsigned int)node + zero);
    if (saved_node != 0) {
        func_0000A1F8(saved_node->field_10);
        func_0000A1F8(saved_node->field_14);
        func_0000A1F8(saved_node->field_18);
        if (saved_node->field_0C != 0) {
            asm volatile ("" : : : "memory");
            func_000016C4(saved_node->field_04);
            saved_node->field_04 = 0;
        }
    }
}
