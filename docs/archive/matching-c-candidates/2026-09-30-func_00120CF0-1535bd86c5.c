typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;

typedef struct {
    u32 flags;
    u8 pad04[0x1C];
    u8 field20;
    u8 pad21[3];
    s32 field24;
    f32 field28;
    f32 field2C;
    f32 field30;
    u8 pad34[0x24];
    s32 field58;
    u8 pad5C[0x24];
    s32 field80;
    s32 field84;
    s32 field88;
    u8 pad8C[5];
    u8 field91;
    u8 field92;
} RuntimeUnit;

extern f32 D_801F0D98;
extern f32 D_801F0D9C;
extern f32 D_801F0DA0;
extern f32 D_801F0DA4;
extern void func_001072B8(RuntimeUnit *unit);

void func_00120CF0(RuntimeUnit *unit, f32 arg1, f32 arg2, f32 arg3)
{
    u32 flags;
    func_001072B8(unit);
    flags = unit->flags;
    unit->field84 = -1;
    unit->field80 = -1;
    unit->field91 = 0;
    unit->field88 = 0;
    unit->field92 = 0;
    unit->field28 = arg1;
    unit->field2C = arg2;
    unit->field30 = arg3;
    unit->flags = flags & ~2;
    arg3 -= D_801F0D9C;
    arg3 *= 64.0f;
    arg3 /= D_801F0DA4 - D_801F0D9C;
    arg1 -= D_801F0D98;
    arg1 *= 64.0f;
    arg1 /= D_801F0DA0 - D_801F0D98;
    unit->field20 = 1;
    unit->field24 = 1;
    unit->flags &= ~4;
    unit->flags &= ~0x200;
    unit->flags |= 2;
    unit->flags &= ~0x00800000;
    unit->field58 = ((s32)arg3 << 6) + (s32)arg1;
}
