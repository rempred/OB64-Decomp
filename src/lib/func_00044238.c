typedef unsigned char u8;

typedef struct ClassEntry {
    u8 unk_00[0x0C];
    u8 field_0C;
    u8 unk_0D;
    u8 field_0E;
    u8 unk_0F;
    u8 field_10;
    u8 unk_11[8];
    u8 related_class_19;
    u8 unk_1A[0x2E];
} ClassEntry;

int func_00044238(int arg0, int arg1, int arg2)
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

    value = classes[selected_class & 0xFF].field_0C;
    if (value != 0xFF) {
        result = value;
        result++;
        result--;
        goto done;
    }
    result = classes[alternate_class].field_0C;
    goto done;

nonzero_slot:
    if (arg2 != 1) {
        goto field_10_slot;
    }

    value = classes[selected_class & 0xFF].field_0E;
    if (value != 0xFF) {
        result = value;
        goto done;
    }
    result = classes[alternate_class].field_0E;
    goto done;

field_10_slot:
    value = classes[selected_class & 0xFF].field_10;
    if (value != 0xFF) {
        result = value;
        goto done;
    }
    result = classes[alternate_class].field_10;

done:
    return result;
}
