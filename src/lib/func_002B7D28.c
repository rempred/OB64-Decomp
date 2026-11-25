typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void func_002B7D28(u8 *o) {
    u16 t = (*(u16 *)((u8 *)(o) + (0x80))) + 2;
    s32 wrap;
    (*(u16 *)((u8 *)(o) + (0x80))) = t;
    wrap = (s16)t > 0x40;
    if (wrap) {
        (*(u16 *)((u8 *)(o) + (0x80))) = 0;
    }
}
