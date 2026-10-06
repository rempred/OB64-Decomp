typedef struct KeyNode24 {
    unsigned int field_00;
    void *field_04;
    unsigned int field_08;
    void *field_0C;
    struct KeyNode24 *field_10;
    struct KeyNode24 *field_14;
} KeyNode24;

extern void func_000016C4(void *pointer);

void boot_resource_node_recursive_key_field_clear(KeyNode24 *node, unsigned int key)
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
