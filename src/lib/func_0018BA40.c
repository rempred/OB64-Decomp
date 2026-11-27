typedef unsigned short u16;
typedef signed int s32;
void func_0018BA40(u16 *p) {
    s32 i;
    for (i = 0; i < 0x100; i++) {
        u16 c = *p;
        s32 r = c >> 11;
        s32 g = (c >> 6) & 0x1F;
        s32 b = (c >> 1) & 0x1F;
        *p = ((r >> 1) << 11) + ((g >> 1) << 6) + ((b >> 1) << 1) | 1;
        p++;
    }
}
