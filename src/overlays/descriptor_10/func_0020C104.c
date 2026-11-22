typedef unsigned char u8;
typedef signed int s32;

inline s32 func_0020C104(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }
    return *(const s32 *)((const u8 *)record + 0x4C) == 1;
}
