typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_800EB1F0[];
void D_801B2D2C(u32 *u);
void D_800EA604(void *p, s32 k);
void func_00118D0C(u32 *u);
void func_0012A958(u32 *u);
void D_800EA604(void *bank, s32 se);
void func_00118D0C(u32 *u);
void func_00119094(u32 *a, u32 *b) {
    D_801B2D2C(a);
    *a &= ~0x10;
    func_00118D0C(a);
    func_0012A958(a);
    D_801B2D2C(b);
    *b &= ~0x10;
    D_800EA604(D_800EB1F0, 0x289);
    func_00118D0C(b);
    func_0012A958(b);
}
