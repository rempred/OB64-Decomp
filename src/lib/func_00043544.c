typedef unsigned char u8;
typedef unsigned short u16;

typedef struct ClassEntry {
    u8 unk_00[0x10];
    u16 intelligence_base_10;
    u8 unk_12[0x2F];
    u8 related_class_41;
    u8 unk_42[0x06];
} ClassEntry;

u16 func_00043544(int primary_class_id, int secondary_class_id)
{
    ClassEntry *classes;
    int primary_class;
    int alternate_class;

    classes = (ClassEntry *)0x80187C18;
    primary_class = primary_class_id & 0xFF;
    alternate_class = secondary_class_id & 0xFF;
    if (classes[primary_class].related_class_41 == alternate_class) {
        return classes[primary_class].intelligence_base_10;
    }

    return classes[alternate_class].intelligence_base_10;
}
