typedef unsigned char u8;

typedef struct ClassEntry {
    u8 unk_00[0x0B];
    u8 field_0B;
    u8 unk_0C;
    u8 field_0D;
    u8 unk_0E;
    u8 field_0F;
    u8 unk_10[9];
    u8 related_class_19;
    u8 unk_1A[0x2E];
} ClassEntry;

int func_00044130(int arg0, int arg1, int arg2)
{
    ClassEntry *classes;
    int selected_class;
    int alternate_class;
    int value;
    int result;

    classes = (ClassEntry *)0x80187C40;
    selected_class = arg0;
    alternate_class = arg1 & 0xFF;
    if (classes[selected_class & 0xFF].related_class_19 != alternate_class) {
        selected_class = arg1;
    }

    arg2 &= 0xFF;
    if (arg2 != 0) {
        goto nonzero_slot;
    }

    value = classes[selected_class & 0xFF].field_0B;
    if (value != 0xFF) {
        asm volatile(
            "# Emits no instruction: compiler barrier only.\n"
            "# It preserves retail's separate beq fallback and j return blocks.\n"
            "# The surrounding branch, value move, and jump are generated from C.");
        result = value;
        goto done;
    }
    result = classes[alternate_class].field_0B;
    goto done;

nonzero_slot:
    if (arg2 != 1) {
        goto field_0F_slot;
    }

    value = classes[selected_class & 0xFF].field_0D;
    if (value != 0xFF) {
        result = value;
        goto done;
    }
    result = classes[alternate_class].field_0D;
    goto done;

field_0F_slot:
    value = classes[selected_class & 0xFF].field_0F;
    if (value != 0xFF) {
        result = value;
        goto done;
    }
    result = classes[alternate_class].field_0F;

done:
    return result;
}
