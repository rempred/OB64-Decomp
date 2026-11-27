typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
extern s32 D_801F0DE0;
extern u32 *D_801F0CB0[];
extern u8 D_801F365D;
void D_801B2B78(void *unit);
extern struct {
    f32 x0;
    f32 z0;
    f32 x1;
    f32 z1;
} D_801F0D98;
extern struct {
    u8 pad[0x33];
    u8 b33;
} D_800E7A90;
extern u8 D_8018F481_check1;
extern s32 D_801EACC8;
typedef struct {
    u16 v;
    u8 pad[0x3E];
} Slot11B;
extern Slot11B D_801F3706[];
void func_00120558(void) {
    s32 moved = 0;
    s32 i;
    u8 *map = (u8 *)((s32 *)&D_800E7A90)[D_800E7A90.b33];
    for (i = 0; i < 50; i++) {
        u8 *o = (u8 *)D_801F0CB0[i];
        u32 f;
        s32 c;
        D_801B2B78((u32 *)o);
        if (((*(u32 *)((u8 *)(o) + (0))) & 0x11) != 0x11) {
            continue;
        }
        if ((*(s32 *)((u8 *)(o) + (0x70))) == 1) {
            continue;
        }
        if (map[(*(s32 *)((u8 *)(o) + (0x14)))] != 0x17) {
            continue;
        }
        if (D_8018F481_check1 == 0xD) {
            (*(f32 *)((u8 *)(o) + (0x10))) -= 0.15625f;
        } else {
            (*(f32 *)((u8 *)(o) + (0x8))) -= 0.15625f;
        }
        moved = 1;
        c = ((s32)(((*(f32 *)((u8 *)(o) + (0x10))) - D_801F0D98.z0) * 64.0f /
                                     (D_801F0D98.z1 - D_801F0D98.z0))
                               << 6) +
                              (s32)(((*(f32 *)((u8 *)(o) + (0x8))) - D_801F0D98.x0) * 64.0f /
                                    (D_801F0D98.x1 - D_801F0D98.x0));
        f = (*(u32 *)((u8 *)(o) + (0)));
        (*(u32 *)((u8 *)(o) + (0))) = f & ~0x800000;
        (*(s32 *)((u8 *)(o) + (0x14))) = c;
        if (!(f & 2)) {
            (*(f32 *)((u8 *)(o) + (0x4C))) = (*(f32 *)((u8 *)(o) + (0x8)));
            (*(f32 *)((u8 *)(o) + (0x50))) = (*(f32 *)((u8 *)(o) + (0xC)));
            (*(f32 *)((u8 *)(o) + (0x54))) = (*(f32 *)((u8 *)(o) + (0x10)));
            (*(s32 *)((u8 *)(o) + (0x64))) = (*(s32 *)((u8 *)(o) + (0x14)));
        }
    }
    if (--D_801EACC8 == 0) {
        D_801EACC8++;
        if (!moved) {
            D_801EACC8 = 60;
            D_801F0DE0 = 0;
            D_801F365D &= 0xFE;
            for (i = 0; i < 8; i++) {
                D_801F3706[i].v = 0xFFFF;
            }
            D_801F0DE0 = 0x31;
            D_801F365D |= 1;
        }
    }
}
