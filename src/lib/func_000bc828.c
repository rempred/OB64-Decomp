typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000bc828(s32 clear, s32 keep) {
    s32 i;
    for (i = 0; i < 0x1E; i++) {
        u8 *p = &D_80196AF8[0x117C + i * 0x36];
        s32 v = p[1];
        if ((keep & v) == 0) {
            p[1] = v & ~clear;
        }
    }
}
