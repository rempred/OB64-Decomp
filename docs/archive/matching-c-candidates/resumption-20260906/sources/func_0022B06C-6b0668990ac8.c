typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
s32 func_0020C1B4(void *arg0);
s32 func_0020C2C0(void *arg0);
s32 func_0020C32C(void *arg0);
void *func_0020C478(s32 arg0);
void func_0021D784(void *arg0);
void func_0021D7A8(void *arg0);
void func_0021D7CC(void *arg0);
s32 func_002224F4(void);

void func_0022B06C(void *arg0, u8 *arg1)
{
    s32 result;
    s32 index;
    s32 flags;
    if (func_0020C2C0(arg0) != 0 && *arg1 != 7) {
        *arg1 = 0;
        return;
    }
    switch (*arg1) {
    case 3:
        if (func_0020C32C(arg0) != 0) {
            *arg1 = 0;
            break;
        }
        *(s32 *)((u8 *)arg0 + 0x40) |= 2;
        result = func_002224F4();
        *(u16 *)((u8 *)*(void **)0x801CE8BC + 0x606A) = result;
        index = 0;
        if ((u16)result != 0) {
            for (;;) {
                arg0 = func_0020C478(index);
                result = func_0020C2C0(arg0);
                index++;
                if (result == 0) {
                    *(s32 *)((u8 *)arg0 + 0x6C) = *(s32 *)((u8 *)arg0 + 0x70);
                }
                if (index >= 20) break;
            }
        }
        break;
    case 8:
        flags = *(s32 *)((u8 *)arg0 + 0x40);
        if (flags & 0xA) { *arg1 = 0; break; }
        *(s32 *)((u8 *)arg0 + 0x40) = flags | 8;
        break;
    case 4:
        flags = *(s32 *)((u8 *)arg0 + 0x40);
        if (flags & 0xE) { *arg1 = 0; break; }
        *(s32 *)((u8 *)arg0 + 0x40) = flags | 4;
        break;
    case 10:
        flags = *(s32 *)((u8 *)arg0 + 0x40);
        if (flags & 0x1E) { *arg1 = 0; break; }
        result = flags | 0x10;
        goto store_flags;
    case 5:
        func_0021D784(arg0);
        break;
    case 6:
        func_0021D7A8(arg0);
        break;
    case 11:
        flags = *(s32 *)((u8 *)arg0 + 0x40);
        if (!(flags & 0x3E)) goto clear;
        result = flags & ~0x3E;
store_flags:
        *(s32 *)((u8 *)arg0 + 0x40) = result;
        func_0021D7CC(arg0);
        break;
    case 7:
        if (func_0020C1B4(arg0) != 0) break;
    case 2:
clear:
        *arg1 = 0;
        break;
    }
}
