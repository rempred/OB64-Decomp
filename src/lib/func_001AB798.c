typedef unsigned char u8;
typedef signed int s32;
void *func_00001330(s32 size);
void func_001AB798(u8 *o, s32 a) {
    u8 *w = func_00001330(0x604);
    (*(u8 * *)((u8 *)(o) + (0xD0))) = w;
    (*(s32 *)((u8 *)(w) + (0x600))) = a;
    w[0x5F0] = 0xFF;
}
