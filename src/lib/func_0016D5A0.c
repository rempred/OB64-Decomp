typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8021EEF4;
void D_8017C384(void *w);
void func_0016D5A0(s32 n, u8 k) {
    s32 i;
    for (i = k; i < n + k; i++) {
        D_8017C384(((void **)(D_8021EEF4 + 0x64))[i]);
    }
}
