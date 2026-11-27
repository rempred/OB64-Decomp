typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void func_0018B9CC(u16 *p) {
    s32 i;
    for (i = 0; i < 0x100; i++) {
        u32 c = *p;
        s32 v = (s32)((c >> 11) + ((c & 0x7C0) >> 6) + ((c & 0x3E) >> 1)) / 3;
        c = (v << 11) + (v << 6) + (v << 1) | 1;
        *p = c;
        p++;
    }
}
