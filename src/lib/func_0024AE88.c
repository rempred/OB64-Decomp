typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *D_8009DD38(u32 handle);
extern void *D_801D7D40;
extern void *D_801D7D44;
extern void *D_801D7D48;
extern s32 D_801D7D4C;
extern s32 D_801D7D50;
extern s32 D_801D7D54;
extern s32 D_801D7D58;
extern u8 D_80187031;
void *D_80074AD4(s32 k);
void D_800749C0(s32 k);
void D_80172368(void);
void func_0024AE88(void) {
    D_801D7D40 = D_80074AD4(0);
    D_801D7D44 = D_80074AD4(1);
    D_801D7D48 = D_8009DD38(0x1DD2486);
    D_800749C0(0xE);
    D_801D7D50 = 0;
    D_801D7D54 = 0;
    D_801D7D58 = 0;
    D_801D7D4C = D_80187031;
    D_80172368();
}
