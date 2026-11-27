typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A974;
void func_002B578C(s32 i, s32 a, s32 b) {
    u8 *u = ((u8 **)(D_8022A974 + 0x19F4))[i];
    if (b != -1) {
        (*(s32 *)((u8 *)(u) + (0x54))) = b;
    } else if (a != -1) {
        (*(s32 *)((u8 *)(u) + (0x50))) = a;
    }
}
