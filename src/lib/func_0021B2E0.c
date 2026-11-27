struct BattleQueueEntry;
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern f32 D_801D0700;
extern f32 D_801D0704;
extern f32 D_801D0720;
extern f32 D_801D0730;
extern u8 *D_801CE8BC;
void func_00020d40(f32 mf[4][4], f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
void D_801CCD4C(void *base, s32 n, s32 size, void *cmp);
int func_0021C8DC(struct BattleQueueEntry **, struct BattleQueueEntry **);
void func_0021B2E0(void) {
    f32 mf[4][4];
    u32 i;
    func_00020d40(mf, D_801D0720, 0.0f, D_801D0704, D_801D0730, 0.0f, D_801D0700, 0.0f, 1.0f, 0.0f);
    for (i = 0; i < (*(u32 *)((u8 *)(D_801CE8BC) + (0x56C0))); i++) {
        u8 *o = (*(u8 * *)((u8 *)(D_801CE8BC + i * 4) + (0x52C0)));
        (*(f32 *)((u8 *)(o) + (0x10))) = mf[0][2] * (*(s32 *)((u8 *)(o) + (4))) + mf[1][2] * (*(s32 *)((u8 *)(o) + (8))) + mf[2][2] * (*(s32 *)((u8 *)(o) + (0xC))) +
                              mf[3][2];
    }
    if ((*(u32 *)((u8 *)(D_801CE8BC) + (0x56C0))) != 0) {
        D_801CCD4C(D_801CE8BC + 0x52C0, (*(u32 *)((u8 *)(D_801CE8BC) + (0x56C0))), 4, func_0021C8DC);
    }
}
int func_0021C8DC(struct BattleQueueEntry **, struct BattleQueueEntry **);
