typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
s32 func_0020C104(void *arg0);
s32 func_0020C2C0(void *arg0);
void *func_0020C478(s32 arg0);
s32 func_0020D444(s32 arg0, s32 arg1);
s32 func_002224F4(void);
void func_0022A414(void *arg0);
void func_0022A7B8(void *arg0, s32 arg1, s32 arg2, s32 arg3, s32 arg4, s32 arg5)
{
    s32 result;
    s32 first;
    s32 second;
    s32 mask;
    s32 clearIndex;
    u8 *cursor;
    s32 remaining;
    s32 updated;
    void *entry;
    if (func_0020C104(arg0) != 0) {
        remaining = *(u16 *)((u8 *)arg0 + 0x20);
        if (arg3 >= remaining) {
            clearIndex = 0;
            do {
                ((s32 *)arg0)[clearIndex] = 0;
                ((s32 *)arg0)[clearIndex + 3] = 0;
                clearIndex++;
            } while (clearIndex < 3);
            *(u16 *)((u8 *)arg0 + 0x20) = 0;
            *(s32 *)((u8 *)arg0 + 0x94) = arg2;
            *(s32 *)((u8 *)arg0 + 0x40) = (*(s32 *)((u8 *)arg0 + 0x40) & ~0x3E) | 1;
            return;
        }
        first = func_0020D444(remaining - arg3, *(u16 *)((u8 *)arg0 + 0x22));
        second = func_0020D444(*(u16 *)((u8 *)arg0 + 0x20) - arg3, *(u16 *)((u8 *)arg0 + 0x22));
        remaining = 0;
        if (second != first) {
            mask = ((1 << second) - 1) ^ ((1 << first) - 1);
            cursor = arg0;
            do {
                result = (mask >> remaining) & 1;
                remaining++;
                if (result) {
                    *(s32 *)cursor = 0;
                    *(s32 *)(cursor + 0xC) = 0;
                }
                cursor += 4;
            } while ((u32)remaining < 3);
        }
        updated = *(u16 *)((u8 *)arg0 + 0x20) - arg3;
        goto store_remaining;
    }
    mask = *(u16 *)((u8 *)arg0 + 0x20);
    if (arg3 < mask) {
        updated = mask - arg3;
store_remaining:
        *(u16 *)((u8 *)arg0 + 0x20) = updated;
        if (arg5 != 0) func_0022A414(arg0);
        *(s32 *)((u8 *)arg0 + 0x94) = arg2;
        return;
    }
    *(u16 *)((u8 *)arg0 + 0x20) = 0;
    *(s32 *)((u8 *)arg0 + 0x94) = arg2;
    *(s32 *)((u8 *)arg0 + 0x40) = (*(s32 *)((u8 *)arg0 + 0x40) & ~0x3E) | 1;
    result = func_002224F4();
    *(u16 *)((u8 *)*(void **)0x801CE8BC + 0x606A) = result;
    first = 0;
    if ((u16)result) {
        do {
            entry = func_0020C478(first);
            result = func_0020C2C0(entry);
            first++;
            if (result == 0) {
                *(s32 *)((u8 *)entry + 0x6C) = *(s32 *)((u8 *)entry + 0x70);
            }
        } while (first < 20);
    }
}
