typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void func_000bb2f4(u8 *p, u16 k, s32 v) {
    switch (k) {
        case 1:
            (*(s16 *)((u8 *)(p) + (0x2A))) = v;
            break;
        case 2:
            (*(s16 *)((u8 *)(p) + (0x2C))) = v;
            break;
        case 3:
            (*(s16 *)((u8 *)(p) + (0x2E))) = v;
            break;
        case 4:
            (*(s16 *)((u8 *)(p) + (0x30))) = v;
            break;
    }
}
