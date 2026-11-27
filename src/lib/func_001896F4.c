typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 D_8021B484[];
extern void *D_8021B538[];
extern void *D_8021B568[];
extern void *D_80214E80;
void func_001896F4(void) {
    s32 i;
    for (i = 4; i >= 0; i--) {
        if (D_8021B484[i] != 0) {
            func_000016C4(D_8021B538[i - 4]);
        }
        func_000016C4(D_8021B568[i - 4]);
    }
    func_000016C4(D_80214E80);
}
