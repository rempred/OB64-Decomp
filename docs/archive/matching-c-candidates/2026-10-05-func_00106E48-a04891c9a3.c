typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef struct RuntimeUnit RuntimeUnit;

#define UNIT_FIELD(type, offset) (*(type *)((u8 *)unit + (offset)))

extern u8 D_800E7AC3;
extern f32 D_801F0D98;
extern f32 D_801F0D9C;
extern f32 D_801F0DA0;
extern f32 D_801F0DA4;
extern u16 D_801F36D8[];
extern f32 D_801E862C[];

/* Flat indexing preserves the observed strides without asserting table bounds. */
f32 func_00106E48(RuntimeUnit *unit, f32 field08, f32 field10)
{
    f32 grid08 = (field08 - D_801F0D98) * 64.0f /
                 (D_801F0DA0 - D_801F0D98);
    f32 grid10 = (field10 - D_801F0D9C) * 64.0f /
                 (D_801F0DA4 - D_801F0D9C);
    u32 selector_address = (u32)&D_800E7AC3;
    u8 *lookup = *(u8 **)(selector_address +
                         ((u32)*(u8 *)selector_address << 2) - 0x33);
    s32 column = (s32)grid08;
    s32 row = (s32)grid10;
    u32 cell = ((u32)row << 6) + (u32)column;
    u16 value = D_801F36D8[(UNIT_FIELD(u32, 0x70) << 5) + lookup[cell]];
    f32 result;

    if ((value != 0) & (value < 16))
        result = D_801E862C[value];
    else
        result = 2.0f;
    return result + result;
}
