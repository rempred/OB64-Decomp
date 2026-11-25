typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A970;
extern u8 *D_8022A974;
extern u8 D_8022A997;
void D_8022B414(s32 i);
void D_8022B414(s32 k);
void func_002B4B88(void) {
    s32 i;
    D_8022A997--;
    (*(u8 *)((u8 *)(D_8022A970) + (0x83F))) = 0;
    for (i = 0; i < 4; i++) {
        ((s32 *)(D_8022A974 + 0x1AC0))[29 - i] = ((s32 *)(D_8022A970 + 0xA8))[i];
        D_8022B414(29 - i);
    }
}
