typedef unsigned char u8;

int func_00043e18(int primary_class_id, int secondary_class_id)
{
    int primary_class;

    primary_class = primary_class_id & 0xFF;
    if ((*(u8 *)(primary_class * 6 + 0x8018ECE4) & 0x80) != 0) {
        if (*(u8 *)(primary_class * 0x48 + 0x80187C59) == (secondary_class_id & 0xFF)) {
            secondary_class_id = primary_class_id;
        }
    }

    return *(u8 *)((secondary_class_id & 0xFF) * 6 + 0x8018ECE4) & 0x3F;
}
