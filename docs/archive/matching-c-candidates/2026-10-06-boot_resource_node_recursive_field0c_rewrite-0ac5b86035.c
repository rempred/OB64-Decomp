typedef struct ChildNode24 ChildNode24;

typedef struct ResourceNode28 {
    unsigned int field_00;
    void *field_04;
    unsigned int field_08;
    ChildNode24 *field_0C;
    struct ResourceNode28 *field_10;
    struct ResourceNode28 *field_14;
    struct ResourceNode28 *field_18;
} ResourceNode28;

extern ChildNode24 *boot_resource_node_recursive_child_free(ChildNode24 *node);

void boot_resource_node_recursive_field0c_rewrite(ResourceNode28 *node)
{
    if (node != 0) {
        boot_resource_node_recursive_field0c_rewrite(node->field_10);
        boot_resource_node_recursive_field0c_rewrite(node->field_14);
        boot_resource_node_recursive_field0c_rewrite(node->field_18);
        node->field_0C = boot_resource_node_recursive_child_free(node->field_0C);
    }
}
