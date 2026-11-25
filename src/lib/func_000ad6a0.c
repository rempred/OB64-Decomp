typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000ad6a0(void) {
    u8 *s = D_80196AF8;
    s32 i;
    (*(s16 *)((u8 *)(s) + (0x1BCC))) = 0;
    (*(s32 *)((u8 *)(s) + (0x1BD0))) = -1;
    for (i = 0; i < 3; i++) {
        (*(s32 *)((u8 *)(s + i * 0x5C) + (0x1B08))) = -1;
        (*(s32 *)((u8 *)(s + i * 0x5C) + (0x1B0C))) = 0;
    }
}
