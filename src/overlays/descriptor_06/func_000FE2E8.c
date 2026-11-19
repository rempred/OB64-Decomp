typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void func_000FE2E8(u8 *p) {
    s32 pad;
    if ((*(u16 *)((u8 *)(p) + (0))) != 0) {
        if ((*(s16 *)((u8 *)(p) + (0xE))) < (*(s16 *)((u8 *)(p) + (0x10)))) {
            (*(s16 *)((u8 *)(p) + (0xC))) = (*(s16 *)((u8 *)(p) + (0x12))) + ((*(s16 *)((u8 *)(p) + (0x14))) - (*(s16 *)((u8 *)(p) + (0x12)))) * (*(s16 *)((u8 *)(p) + (0xE))) / (*(s16 *)((u8 *)(p) + (0x10)));
            (*(s16 *)((u8 *)(p) + (0xE)))++;
        } else {
            (*(s16 *)((u8 *)(p) + (0xC))) = (*(s16 *)((u8 *)(p) + (0x14)));
        }
    }
}
