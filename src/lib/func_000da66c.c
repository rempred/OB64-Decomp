typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
u8 func_000da66c(void) {
    s32 i;
    for (i = 0; i < 10; i++) {
        if ((D_80196AF8 + i * 0xE)[0x10DC] == 0) {
            break;
        }
    }
    return i;
}
