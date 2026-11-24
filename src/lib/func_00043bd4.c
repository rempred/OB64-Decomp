typedef unsigned char u8;

u8 func_00043bd4(int primary_class_id, int secondary_class_id)
{
    int alternate_class;
    int class_index;
    u8 related_class;

    related_class = *(u8 *)((primary_class_id & 0xFF) * 0x48 + 0x80187C59);
    alternate_class = secondary_class_id & 0xFF;
    if (related_class != alternate_class) {
        class_index = alternate_class * 9;
    } else {
        class_index = related_class * 9;
    }

    return *(u8 *)(class_index * 8 + 0x80187C4D);
}
