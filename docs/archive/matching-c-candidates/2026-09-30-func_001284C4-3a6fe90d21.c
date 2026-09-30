typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit RuntimeUnit;

#define UNIT_FIELD(type, offset) (*(type *)((u8 *)unit + (offset)))
/* Layout-only diagnostic: the selector offset is observed, but the executed
   bank index domain and these array bounds are not accepted runtime facts. */
typedef struct { u8 *pointers[12]; u8 gap[3]; u8 selector; } BankLayoutControl;
extern BankLayoutControl D_800E7A90;
extern f32 D_801F0D98;
extern f32 D_801F0D9C;
extern f32 D_801F0DA0;
extern f32 D_801F0DA4;
extern f64 D_801EE820;
extern u16 D_801F36D8[][32];
extern u8 D_801FB520[][32];
extern f32 func_801B2708(RuntimeUnit *unit, f32 field08, f32 field10);
extern f32 func_800907F0(f32 value);
extern f32 func_8009CE20(f32 value);

/* Flat views express the observed strides without imposing a column domain
   or a capacity on either byte map. */
#define CELL_AVAILABLE() (D_801F36D8[(UNIT_FIELD(u32, 0x70) << 5) + lookup[cell]] != 0xFFFF && D_801FB520[((u32)lookup[UNIT_FIELD(s32, 0x14)] << 5) + lookup[cell]] == 0)

s32 func_001284C4(RuntimeUnit *unit, f32 *output08, f32 *output10)
{
    s32 adjustment = !(UNIT_FIELD(u32, 0x00) & 8) ? 5 : 0;
    f32 query = func_801B2708(unit, UNIT_FIELD(f32, 0x08), UNIT_FIELD(f32, 0x10));
    f64 wide;
    f32 angle;
    f32 step08;
    f32 step10;
    f32 test08;
    s32 outside;
    s32 column;
    s32 row;
    u32 cell;
    u32 selector_address;
    u8 *lookup;

    wide = (f64)(UNIT_FIELD(f32, 0x94) + UNIT_FIELD(f32, 0x94));
    wide *= D_801EE820;
    angle = (f32)wide;
    step08 = func_800907F0(angle) * ((19.0f - query) * 0.00390625f / (f32)(adjustment + 17));
    step10 = func_8009CE20(angle) * step08;
    outside = 1;
    {
    f32 candidate08 = UNIT_FIELD(f32, 0x08) + step08;
    f32 candidate10 = UNIT_FIELD(f32, 0x10) - step10;

    if (*(volatile f32 *)&D_801F0D98 < candidate08 && candidate08 < D_801F0DA0 &&
        D_801F0D9C < candidate10 && candidate10 < D_801F0DA4)
        outside = 0;
    }

    cell = 0;
    if (outside == 0) {
        f32 grid08 = ((UNIT_FIELD(f32, 0x08) + step08) - D_801F0D98) * 64.0f /
                     (D_801F0DA0 - D_801F0D98);
        f32 grid10 = ((UNIT_FIELD(f32, 0x10) - step10) - D_801F0D9C) * 64.0f /
                     (D_801F0DA4 - D_801F0D9C);
        column = (s32)grid08;
        row = (s32)grid10;
        cell = ((u32)row << 6) + (u32)column;
    }
    else {
        row = 0;
        column = 0;
    }
    lookup = D_800E7A90.pointers[D_800E7A90.selector];
    if (outside == 0) {
        s32 inside = (((u32)column < 64) & (row >= 0)) && row < 64;
        if (inside != 0) {
        if (D_801F36D8[UNIT_FIELD(u32, 0x70)][lookup[cell]] != 0xFFFF) {
            if (D_801FB520[lookup[UNIT_FIELD(s32, 0x14)]][lookup[cell]] == 0) {
        *output08 = UNIT_FIELD(f32, 0x08) + step08;
        *output10 = UNIT_FIELD(f32, 0x10) - step10;
        return 1;
            }
        }
    }

    }
    test08 = UNIT_FIELD(f32, 0x08) + step10;
    {
        f32 grid08 = (test08 - D_801F0D98) * 64.0f / (D_801F0DA0 - D_801F0D98);
        f32 grid10 = ((UNIT_FIELD(f32, 0x10) + step08) - D_801F0D9C) * 64.0f /
                     (D_801F0DA4 - D_801F0D9C);
        column = (s32)grid08;
        row = (s32)grid10;
        cell = ((u32)row << 6) + (u32)column;
    }
    outside = (((u32)column < 64) & (row >= 0)) && row < 64;
    if (outside != 0) {
        if (D_801F36D8[UNIT_FIELD(u32, 0x70)][lookup[cell]] != 0xFFFF) {
            if (D_801FB520[lookup[UNIT_FIELD(s32, 0x14)]][lookup[cell]] == 0) {
        *output08 = test08;
        *output10 = UNIT_FIELD(f32, 0x10) + step08;
        return 1;
            }
        }
    }

    step10 = UNIT_FIELD(f32, 0x08) - step10;
    {
        f32 grid08 = (step10 - D_801F0D98) * 64.0f / (D_801F0DA0 - D_801F0D98);
        f32 grid10 = ((UNIT_FIELD(f32, 0x10) - step08) - D_801F0D9C) * 64.0f /
                     (D_801F0DA4 - D_801F0D9C);
        column = (s32)grid08;
        row = (s32)grid10;
        cell = ((u32)row << 6) + (u32)column;
    }
    outside = (((u32)column < 64) & (row >= 0)) && row < 64;
    if (outside != 0) {
        if (D_801F36D8[UNIT_FIELD(u32, 0x70)][lookup[cell]] != 0xFFFF) {
            if (D_801FB520[lookup[UNIT_FIELD(s32, 0x14)]][lookup[cell]] == 0) {
        *output08 = step10;
        *output10 = UNIT_FIELD(f32, 0x10) - step08;
        return 1;
            }
        }
    }
    *output08 = UNIT_FIELD(f32, 0x08);
    *output10 = UNIT_FIELD(f32, 0x10);
    return 0;
}
