typedef signed char s8;
typedef unsigned char u8;
typedef unsigned int u32;

extern void func_801DA0EC(u32, u32, u32) __attribute__((noreturn));
extern void func_801DA108(u32, u32, u32, u32) __attribute__((noreturn));

void func_0021D374(u32 offset)
{
    s8 *context;
    u8 *record;
    u32 adjustment;
    u32 size;
    u32 type;

    context = *(s8 **)0x801CE8C0;
    record = (u8 *)(context + offset + 0x10);
    type = record[0];
    adjustment = record[1];
    if (type == 0x16) {
        size = record[3] + 4;
        func_801DA108(offset, type, adjustment, size);
    } else if (type == 0x38) {
        size = record[3];
        func_801DA108(offset, type, adjustment, size);
    } else {
        func_801DA0EC(offset, type, adjustment);
    }
}
