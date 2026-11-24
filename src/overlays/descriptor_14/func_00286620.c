typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_8022A950;
void func_00283FA8(s32 a, s32 b);
extern u8 *D_8023DE34;
extern u8 D_80197778[];
extern s32 D_8018F1A4;
void memcpy_aligned(u8 *dst, u8 *src, u32 n);
void D_8023BD88(s32 a, s32 b);
void D_8023BC1C(s32 a);
void func_00283FA8(s32 k, s32 b);
void func_00286620(void) {
    D_8022A950 = *(s32 *)D_80197778;
    memcpy_aligned(D_8023DE34 + 0x18, D_80197778 + 0x44, 6);
    memcpy_aligned(D_8023DE34 + 0x1E, D_80197778 + 0x4A, 6);
    memcpy_aligned(D_8023DE34 + 0x24, D_80197778 + 4, 0x40);
    D_8023BD88(10, 0x11);
    D_8023BC1C(10);
    D_8023BD88(11, 0x12);
    D_8023BC1C(11);
    D_8018F1A4 = 0;
    D_8023DE34[0x64] = 1;
    func_00283FA8(4, 1);
}
