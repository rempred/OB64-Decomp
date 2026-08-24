typedef signed char s8;
typedef unsigned char u8;

int func_00044934(u8 arg0, u8 arg1, int arg2)
{
    int offset;
    u8 threshold;
    u8 selected_class;

    selected_class = arg0;
    if (*(u8 *)((s8 *)(((selected_class & 0xFF) * 0x48) + 0x80180000) + 0x7C59) !=
        (arg1 & 0xFF)) {
        selected_class = arg1;
    }

    offset = (selected_class & 0xFF) * 0x48;
    threshold = *(u8 *)((s8 *)(offset + 0x80180000) + 0x7C56);
    if (threshold != 0xFF && (unsigned int)(arg2 & 0xFF) < threshold) {
        selected_class = *(u8 *)((s8 *)(offset + 0x80180000) + 0x7C55);
    } else {
        offset = (selected_class & 0xFF) * 0x48;
        threshold = *(u8 *)((s8 *)(offset + 0x80180000) + 0x7C58);
        if (threshold != 0xFF && (unsigned int)(arg2 & 0xFF) < threshold) {
            selected_class = *(u8 *)((s8 *)(offset + 0x80180000) + 0x7C57);
        }
    }

    return selected_class & 0xFF;
}
