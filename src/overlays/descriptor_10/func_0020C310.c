typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;

s32 func_0020C310(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }
    return (*(const u32 *)((const u8 *)record + 0x40) >> 2) & 1;
}
