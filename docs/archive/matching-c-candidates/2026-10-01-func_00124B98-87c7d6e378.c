typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef struct RuntimeUnit RuntimeUnit;
typedef struct Func001072B8Object Func001072B8Object;

#define UNIT(type, offset) (*(type *)((u8 *)unit + (offset)))
extern u8 D_801971F0[][25];
extern f32 D_801F0D98, D_801F0D9C, D_801F0DA0, D_801F0DA4;
extern s32 func_0012DA10(RuntimeUnit *unit);
extern s32 func_00123E38(s32 source_word, s32 member);
extern s32 func_00124018(s32 source_word, s32 selector, s32 member);
extern s32 func_00124328(s32 source_word, s32 member);
extern s32 func_00124520(void *unit, s32 selector, s32 member);
extern s32 func_0012469C(RuntimeUnit *unit, f32 *point);
extern void func_001072B8(Func001072B8Object *unit);
extern void func_00121DA8(RuntimeUnit *unit);

s32 func_00124B98(RuntimeUnit *unit)
{
    f32 point[3];
    s32 encountered;
    s32 index;
    s32 selector;
    u8 rejected;
    u8 *record;

    if ((UNIT(u32, 0) & 0x04000000) != 0)
        return 0;

    selector = UNIT(u8, 0xBB);
    record = D_801971F0[UNIT(u8, 4)];
    rejected = func_0012DA10(unit) == 0;
    encountered = 0;
    for (index = 0; index < 5; ++index) {
        s32 member = (record + index)[2];
        s32 below_limit;
        if (member == 0)
            continue;
        below_limit = member < 100;
        if (below_limit) {
            u8 *row = (u8 *)0x80190000 + member * 52;
            if (*(u16 *)(row + 0x5578) == 0)
                continue;
        }
        if (func_00123E38(UNIT(u8, 4), member) != 0)
            return 1;
        if (below_limit) {
            u8 *row = (u8 *)0x80190000 + member * 52;
            if ((row[0x5593] & 4) != 0)
                continue;
        }
        if (func_00124018(UNIT(u8, 4), selector, member) != 0)
            return 2;
        if (func_00124328(UNIT(u8, 4), member) != 0)
            return 3;
        if (rejected != 0)
            continue;
        if ((UNIT(u32, 0) & 0xC0) == 0x40)
            continue;
        if ((UNIT(u32, 0) & 8) != 0)
            continue;
        if (func_00124520(unit, selector, member) == 0)
            continue;
        if ((UNIT(u32, 0) & 0x08000000) != 0) {
            encountered = 1;
            continue;
        }
        if (func_0012469C(unit, point) != -1) {
            f32 x, y, z;
            UNIT(u32, 0) |= 0x08000000;
            UNIT(u8, 0xBC) = UNIT(s32, 0x24);
            UNIT(f32, 0x40) = UNIT(f32, 0x4C);
            UNIT(f32, 0x44) = UNIT(f32, 0x50);
            UNIT(f32, 0x48) = UNIT(f32, 0x54);
            UNIT(s32, 0x60) = UNIT(s32, 0x64);
            if (UNIT(f32, 8) == point[0] && UNIT(f32, 0x10) == point[2]) {
                y = point[2] + 0.0001f;
                if (y < D_801F0DA4)
                    point[2] = y;
                else
                    point[2] -= 0.0001f;
            }
            x = point[0];
            y = point[1];
            z = point[2];
            func_001072B8((Func001072B8Object *)unit);
            UNIT(u8, 0x91) = 0;
            UNIT(s32, 0x84) = -1;
            UNIT(s32, 0x80) = -1;
            UNIT(s32, 0x88) = 0;
            UNIT(u8, 0x92) = 0;
            UNIT(u32, 0) &= ~2U;
            UNIT(f32, 0x28) = x;
            UNIT(f32, 0x2C) = y;
            UNIT(f32, 0x30) = z;
            z -= D_801F0D9C;
            z *= 64.0f;
            z /= D_801F0DA4 - D_801F0D9C;
            x -= D_801F0D98;
            x *= 64.0f;
            x /= D_801F0DA0 - D_801F0D98;
            UNIT(s32, 0x24) = (UNIT(u8, 0x20) = 1);
            UNIT(u8, 0x91) = 2;
            UNIT(s32, 0x88) = 90;
            UNIT(u32, 0) &= ~4U;
            UNIT(u32, 0) &= ~0x200U;
            UNIT(u32, 0) |= 2U;
            UNIT(u32, 0) &= ~0x00800000U;
            UNIT(s32, 0x84) = -1;
            UNIT(s32, 0x58) = (s32)z * 64 + (s32)x;
            return 4;
        }
    }
    if (((UNIT(u32, 0) & 0x08000000) != 0) & (encountered == 0)) {
        s32 field64;
        UNIT(u32, 0) &= ~0x08000000U;
        point[0] = UNIT(f32, 0x40);
        point[1] = UNIT(f32, 0x44);
        point[2] = UNIT(f32, 0x48);
        field64 = UNIT(s32, 0x60);
        func_00121DA8(unit);
        UNIT(s32, 0x24) = UNIT(u8, 0xBC);
        UNIT(f32, 0x4C) = point[0];
        UNIT(f32, 0x50) = point[1];
        UNIT(f32, 0x54) = point[2];
        UNIT(s32, 0x64) = field64;
    }
    return 0;
}
