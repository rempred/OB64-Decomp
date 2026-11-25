typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000bc7e4(s32 clear, s32 keep) {
    s32 i;
    for (i = 0; i < 0xDC; i++) {
        u8 *p = &D_80196AF8[0x1872 + i * 2];
        s32 v = *p;
        if ((keep & v) == 0) {
            *p = v & ~clear;
        }
    }
}
