typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A970;
extern u8 *D_8022A974;
void func_002B3754(u8 k) {
    if (k == 1) {
        (*(s32 *)((u8 *)(D_8022A974) + (0x1C08))) = (*(s32 *)((u8 *)(D_8022A970) + (0x4C)));
    } else {
        (*(s32 *)((u8 *)(D_8022A974) + (0x1C08))) = (*(s32 *)((u8 *)(D_8022A970) + (0x50)));
    }
}
