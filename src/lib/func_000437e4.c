typedef unsigned char u8;

typedef struct ClassEntry {
    u8 unk_00[0x1F];
    u8 luck_base_1F;
    u8 unk_20[0x21];
    u8 related_class_41;
    u8 unk_42[0x06];
} ClassEntry;

u8 func_000437e4(int primary_class_id, int secondary_class_id)
{
    ClassEntry *classes;
    int primary_class;
    int alternate_class;

    classes = (ClassEntry *)0x80187C18;
    primary_class = primary_class_id & 0xFF;
    alternate_class = secondary_class_id & 0xFF;
    if (classes[primary_class].related_class_41 == alternate_class) {
        return classes[primary_class].luck_base_1F;
    }

    return classes[alternate_class].luck_base_1F;
}
