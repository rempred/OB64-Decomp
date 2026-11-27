typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A974;
void func_002B20C4(s32 i, s32 v) {
    s32 end = i + 1;
    if (i == -1) {
        i = 0;
        end = 28;
    }
    for (; i < end; i++) {
        u8 *u = ((u8 **)(D_8022A974 + 0x18))[i];
        if (u != ((void *)0)) {
            u[0x145] = (u[0x145] & 0xFE) + v;
        }
    }
}
