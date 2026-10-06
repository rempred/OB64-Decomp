typedef struct ChildNode24 {
    unsigned int field_00;
    void *field_04;
    unsigned int field_08;
    void *field_0C;
    struct ChildNode24 *field_10;
    struct ChildNode24 *field_14;
} ChildNode24;

extern void func_000016C4(void *pointer);

ChildNode24 *boot_resource_node_recursive_child_free(ChildNode24 *node)
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
