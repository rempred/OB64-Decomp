typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;

u8 *func_80232E44(s32 arg0, s32 arg1);

s32 func_002a3198(s32 arg0, s32 arg1, s32 arg2, s32 arg3,
                  u8 *out0, u8 *out1, u8 *out2)
{
    u8 *base;
    u8 *cursor;
    u32 index;
    u32 count;
    u32 offset;
    s32 length;
    u32 unused[2];

    base = func_80232E44(arg0, arg3);
    if (base != 0) {
        offset = *(u32 *)(base + arg1 * 4);
        cursor = (u8 *)(offset + (u32)base);
    } else {
        cursor = (u8 *)0;
    }

    count = *cursor++;
    index = 0;
    if (count != 0) {
        do {
            if (index == (u32)arg2) {
                length = *(u8 *)(0x801CEEE0 + *cursor);
                switch (length) {
                case 2:
                    if (out0 != 0) {
                        *out0 = *(volatile u8 *)(cursor + 1);
                    }
                    break;
                case 3:
                    if (out0 != 0) {
                        *out0 = *(volatile u8 *)(cursor + 1);
                    }
                    if (out1 != 0) {
                        *out1 = *(volatile u8 *)(cursor + 2);
                    }
                    break;
                case 4:
                    if (out0 != 0) {
                        *out0 = *(volatile u8 *)(cursor + 1);
                    }
                    if (out1 != 0) {
                        *out1 = *(volatile u8 *)(cursor + 2);
                    }
                    if (out2 != 0) {
                        *out2 = *(volatile u8 *)(cursor + 3);
                    }
                    break;
                }
                return *(volatile u8 *)cursor;
            }
            index++;
            cursor += *(u8 *)(0x801CEEE0 + *cursor);
        } while (index < count);
    }
    return 0;
}

asm(".word 0\n.word 0\n.size func_002a3198, .-func_002a3198");
