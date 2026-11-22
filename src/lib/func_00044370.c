typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;

int func_000454e0(int value);
int func_00045934(int item0, int item1, int item2, int item3);
int func_00045a50(u16 item0, u16 item1, u16 item2, u16 item3);

u8 func_00044370(int arg0, int arg1, int arg2, int arg3, u16 arg4)
{
    int offset;
    int selected;
    u8 value;

    offset = (arg0 & 0xFF) * 0x10;
    value = *(u8 *)((s8 *)(offset + 0x80190000) - 0x557F);
    if ((value != 0xFF) & (value != 0x0F)) {
        return value;
    }

    if (*(u8 *)((s8 *)(offset + 0x80190000) - 0x5580) == 3) {
        selected = func_00045a50(arg1 & 0xFFFF, arg2 & 0xFFFF,
                                arg3 & 0xFFFF, arg4) & 0xFFFF;
    } else {
        selected = func_00045934(arg1 & 0xFFFF, arg2 & 0xFFFF,
                                arg3 & 0xFFFF, arg4) & 0xFFFF;
    }

    if (selected == 0) {
        return 0;
    }

    return func_000454e0(selected) & 0xFF;
}
