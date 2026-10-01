typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;
typedef float f32;
typedef struct RuntimeUnit RuntimeUnit;

#define UNIT(type, offset) (*(type *)((u8 *)unit + (offset)))
extern s32 D_801F1070, D_801F361C;
extern u8 D_800E7AC3, D_8018F481;
extern f32 D_801F0D98[];
extern u16 D_801F36D8[][32];
extern void func_0012EA80(s32 index, f32 *point);
extern s32 func_0013A558(s32 first, s32 second, u8 *a, u8 *b);
extern s32 func_0013AA40(s32 first, s32 second, u8 *a, u8 *b);
extern s32 func_0013B350(s32 first, s32 second, u8 *a, u8 *b);

s32 func_0012469C(RuntimeUnit *unit, f32 *output)
{
    f32 point[3];
    /* Literal default-byte research only: retail has no visible initializer.
     * Do not activate or replace these tests with an invented zero/default skip. */
    u8 helper_output[4];
    s32 count = D_801F1070;
    s32 selected = -1;
    s32 index;
    f32 best = 1012.5f;
        if (count > 0) {
            const u8 *selector = &D_800E7AC3;
            u8 *const *banks = (u8 *const *)((u32)selector - 0x33);
            const f32 *bounds = D_801F0D98;
            for (index = 0; index < D_801F1070; ++index) {
                f32 x, z, dx, dz, distance;
                s32 column, row, kind;
                u8 *grid;
                u8 *entry = (u8 *)0x80190000 + index * 36;
                if ((*(u16 *)(entry + 0x51CC) & 4) == 0) {
                    if (entry[0x51C5] != 0)
                        continue;
                }
                func_0012EA80(index, point);
                x = point[0];
                z = point[2];
                dx = x - UNIT(f32, 8);
                dz = z - UNIT(f32, 0x10);
                distance = dx * dx + dz * dz;
                if (!(distance < best))
                    continue;
                grid = banks[*selector];
                if (x < bounds[0])
                    continue;
                if (bounds[2] < x)
                    continue;
                if (z < bounds[1])
                    continue;
                if (bounds[3] < z)
                    continue;
                x -= bounds[0];
                x *= 64.0f;
                x /= bounds[2] - bounds[0];
                z -= bounds[1];
                z *= 64.0f;
                z /= bounds[3] - bounds[1];
                column = (s32)x;
                row = (s32)z;
                kind = UNIT(s32, 0x70);
                if (D_801F36D8[kind][grid[row * 64 + column]] == 0xFFFF)
                    continue;
                if (D_801F361C != 0 && kind != 1) {
                    switch (D_8018F481) {
                    case 0x27:
                        func_0013A558(UNIT(u8, 0x17), (u8)(row * 64 + column), &helper_output[0], &helper_output[1]);
                        break;
                    case 0x2F:
                    case 0x30:
                    case 0x3C:
                    case 0x3D:
                        func_0013AA40(UNIT(u8, 0x17), (u8)(row * 64 + column), &helper_output[0], &helper_output[1]);
                        break;
                    case 0x33:
                        func_0013B350(UNIT(u8, 0x17), (u8)(row * 64 + column), &helper_output[0], &helper_output[1]);
                        break;
                    }
                    if (helper_output[1] == 0)
                        continue;
                }
                best = distance;
                selected = index;
            }
        }
    if (selected == -1) {
        count = D_801F1070;
        best = 1012.5f;
        if (count > 0) {
            const u8 *selector = &D_800E7AC3;
            u8 *const *banks = (u8 *const *)((u32)selector - 0x33);
            const f32 *bounds = D_801F0D98;
            for (index = 0; index < D_801F1070; ++index) {
                f32 x, z, dx, dz, distance;
                s32 column, row, kind;
                u8 *grid;
                func_0012EA80(index, point);
                x = point[0];
                z = point[2];
                dx = x - UNIT(f32, 8);
                dz = z - UNIT(f32, 0x10);
                distance = dx * dx + dz * dz;
                if (!(distance < best))
                    continue;
                grid = banks[*selector];
                if (x < bounds[0])
                    continue;
                if (bounds[2] < x)
                    continue;
                if (z < bounds[1])
                    continue;
                if (bounds[3] < z)
                    continue;
                x -= bounds[0];
                x *= 64.0f;
                x /= bounds[2] - bounds[0];
                z -= bounds[1];
                z *= 64.0f;
                z /= bounds[3] - bounds[1];
                column = (s32)x;
                row = (s32)z;
                kind = UNIT(s32, 0x70);
                if (D_801F36D8[kind][grid[row * 64 + column]] == 0xFFFF)
                    continue;
                if (D_801F361C != 0 && kind != 1) {
                    switch (D_8018F481) {
                    case 0x27:
                        func_0013A558(UNIT(u8, 0x17), (u8)(row * 64 + column), &helper_output[2], &helper_output[3]);
                        break;
                    case 0x2F:
                    case 0x30:
                    case 0x3C:
                    case 0x3D:
                        func_0013AA40(UNIT(u8, 0x17), (u8)(row * 64 + column), &helper_output[2], &helper_output[3]);
                        break;
                    case 0x33:
                        func_0013B350(UNIT(u8, 0x17), (u8)(row * 64 + column), &helper_output[2], &helper_output[3]);
                        break;
                    }
                    if (helper_output[3] == 0)
                        continue;
                }
                best = distance;
                selected = index;
            }
        }
    }
    if (selected != -1)
        func_0012EA80(selected, output);
    return selected;
}
