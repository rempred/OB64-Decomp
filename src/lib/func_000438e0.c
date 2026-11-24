typedef unsigned char u8;

typedef struct ClassEntry {
    u8 unk_00[0x22];
    u8 air_resistance_22;
    u8 unk_23[0x1E];
    u8 related_class_41;
    u8 unk_42[0x06];
} ClassEntry;

u8 func_000438e0(int primary_class_id, int secondary_class_id)
{
    ClassEntry *classes;
    int primary_class;
    int alternate_class;

    classes = (ClassEntry *)0x80187C18;
    primary_class = primary_class_id & 0xFF;
    alternate_class = secondary_class_id & 0xFF;
    if (classes[primary_class].related_class_41 == alternate_class) {
        return classes[primary_class].air_resistance_22;
    }

    return classes[alternate_class].air_resistance_22;
}
