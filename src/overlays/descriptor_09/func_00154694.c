typedef unsigned char u8;
typedef signed int s32;
void func_00151F40(void *a, s32 b, s32 c);
void func_00151F40(void *a, s32 y, s32 k);
void func_00154694(void *a, s32 b, u8 c) {
    if (c == 3) {
        func_00151F40(a, b, 0x11);
    } else {
        func_00151F40(a, b, 0x10);
    }
}
