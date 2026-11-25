typedef signed char s8;
typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern s8 D_80214C80[];
extern s32 D_80220EC8[];
extern u8 D_8021ED50[];
extern u8 *D_80220E60[];
extern f32 D_80220E70[][2];
extern f32 D_80220E88[];
void D_8017C2FC(u8 *o);
void func_00167C30(void) {
    s32 i;
    for (i = 0; i < 3; i++) {
        s8 st = D_80214C80[i];
        if (st == -1) {
            continue;
        }
        if (st == 2) {
            D_80214C80[i] = -1;
            D_80220EC8[i] = 0;
            D_8021ED50[i] = 0;
            continue;
        }
        (*(s32 *)((u8 *)(D_80220E60[i]) + (0x4C))) =
            D_80220E70[i][0] + D_80220E70[i][1] / 2.0f - 4.0f;
        (*(s32 *)((u8 *)(D_80220E60[i]) + (0x50))) = D_80220E88[i] + 6.0f;
        (*(s32 *)((u8 *)(D_80220E60[i]) + (0x54))) =
            D_80220E70[i][0] + D_80220E70[i][1] / 2.0f + 4.0f;
        (*(s32 *)((u8 *)(D_80220E60[i]) + (0x58))) = D_80220E88[i] + 12.0f;
        D_8017C2FC(D_80220E60[i]);
        D_80214C80[i] = -1;
        D_8021ED50[i] = 0;
        D_80220EC8[i] = 0;
    }
}
