typedef unsigned char u8;
typedef signed int s32;
void D_801ADB00(void *a);
void D_801ADBC0(s32);
void func_0021EB70(void **o, s32 k) {
    void **e = (void **)(k * 4 + (s32)o);
    D_801ADB00(e[0]);
    D_801ADBC0(e[3]);
    (*(s32 *)((u8 *)(e[0]) + (0x18))) = 0;
    (*(s32 *)((u8 *)(e[3]) + (0x18))) = 0;
    e[0] = ((void *)0);
    e[3] = ((void *)0);
}
