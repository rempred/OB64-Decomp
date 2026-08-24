typedef unsigned char u8;
typedef unsigned short u16;

typedef struct ClassEntry {
    u16 field_00;
    u16 field_02;
    u16 field_04;
    u16 field_06;
    u16 field_08;
    u8 unk_0A[0x0F];
    u8 related_class_19;
    u8 unk_1A[0x2E];
} ClassEntry;

u16 func_00043f84(int arg0, int arg1)
{
    ClassEntry *classes;
    int primary_class;
    int alternate_class;

    classes = (ClassEntry *)0x80187C40;
    primary_class = arg0 & 0xFF;
    alternate_class = arg1 & 0xFF;
    if (classes[primary_class].related_class_19 == alternate_class) {
        return classes[primary_class].field_08;
    }

    return classes[alternate_class].field_08;
}
