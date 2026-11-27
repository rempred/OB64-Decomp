typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
extern s16 D_800E7A36;
extern s16 D_800E7A38;
extern s16 D_800E7A3A;
extern s16 D_800E7A3C;
extern u8 *D_801AB850;
extern struct {
    u8 pad[0x29];
    u8 b29;
    u8 pad2A[6];
    u8 b30;
} D_800E7A90;
extern s32 D_8018F58C;
extern s32 D_8018F590;
extern s32 D_801F0DE0;
void func_00008A74(s32 a, s32 b, s32 c, s32 d);
void D_801B0634(s32 a);
void D_801F7C40(s32 a, s32 b);
void D_802167E8(void);
void D_802154CC(void);
void D_801C0D00(void);
void D_80216380(void);
void D_80215AC8(void);
void func_000ecd24(s32 x, s32 y);
void func_000ec598(void) {
    s32 *st;
    D_8018F58C = ((s32 *)&D_800E7A90)[D_800E7A90.b30 - 10];
    func_00008A74(D_800E7A36, D_800E7A38, D_800E7A3A, D_800E7A3C);
    D_801B0634(D_8018F58C);
    if (D_801F0DE0 != 0x13) {
        D_801F7C40((*(f32 *)((u8 *)(D_801AB850) + (0x10))) < 37.0f, D_8018F58C);
    }
    st = &D_801F0DE0;
    if (*st == 0x1B) {
        D_802167E8();
    }
    func_000ecd24(D_800E7A36, D_800E7A38);
    if (*st == 0x29) {
        D_802154CC();
    }
    if (*st != 0x13) {
        D_801C0D00();
    }
    if (D_8018F590 != 0) {
        D_80216380();
        D_80215AC8();
    }
}
void func_000ecd24(s32 x, s32 y);
