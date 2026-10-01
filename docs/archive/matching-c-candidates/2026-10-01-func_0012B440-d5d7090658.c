typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit RuntimeUnit;
#define FIELD(object, type, offset) (*(type *)((u8 *)(object) + (offset)))

extern u8 D_800E7AC3, D_800E7AB9;
extern u16 D_801F36D8[];
extern u8 D_801EB520[][32];
extern f32 D_801F0D98, D_801F0D9C, D_801F0DA0, D_801F0DA4;
extern f64 D_801EE848, D_801EE850;
extern f32 func_0002CB80(f32 dx, f32 dz);
extern f32 func_800907F0(f32 value);
extern f32 func_80092DB0(f32 value);
extern f32 func_801A63FC(s32 selector, f32 x, f32 z);

/* The observed bank selector, 64-cell row and 32-byte compatibility row
 * are address strides; their runtime ranges are not established here. */
static inline s32 cell_compatible(s32 selector, s32 origin, f32 x, f32 z,
                                 f32 lowX, f32 highX, f32 lowZ, f32 highZ)
{
    f32 gridZ = (z - lowZ) * 64.0f / (highZ - lowZ);
    f32 gridX = (x - lowX) * 64.0f / (highX - lowX);
    u8 *map = *(u8 **)((u8 *)&D_800E7AC3 + D_800E7AC3 * 4 - 0x33);
    s32 index = ((s32)gridZ << 6) + (s32)gridX;
    u8 cell = map[index];
    u16 *row = (u16 *)((u32)D_801F36D8 + (selector << 6));
    return row[cell] != 0xFFFF && D_801EB520[map[origin]][cell] == 0;
}

/* The direct consumer supplies two unit pointers, a byte-valued selector,
 * two three-float points and a full word. It consumes signed status values.
 * Keep the selector as a word: this body performs no entry narrowing. */
s32 func_0012B440(RuntimeUnit *first, RuntimeUnit *second, s32 selector,
                 f32 *current, f32 *requested, s32 bypass)
{
    f32 originalZ = current[2];
    f32 lowZ = D_801F0D9C;
    f32 highZ = D_801F0DA4;
    f32 gridZ = (originalZ - lowZ) * 64.0f / (highZ - lowZ);
    f32 originalX = current[0];
    f32 lowX = D_801F0D98;
    f32 highX = D_801F0DA0;
    f32 gridX = (originalX - lowX) * 64.0f / (highX - lowX);
    s32 origin = ((s32)gridZ << 6) + (s32)gridX;
    f32 pointX, pointY, pointZ;
    f32 x = requested[0];
    f32 z;
    f32 distance;
    s32 status;

    /* Reject only the original ordered less-than tests. An unordered
     * coordinate does not satisfy one of these comparisons. */
    if (x < lowX || highX < x)
        goto second_path;
    z = requested[2];
    if (z < lowZ || highZ < z)
        goto second_path;
    if (bypass == 0 &&
        !cell_compatible(selector, origin, x, z, lowX, highX, lowZ, highZ))
        goto second_path;

    distance = func_0002CB80(x - originalX, z - originalZ);
    status = 2;
    if (0.005f < distance) {
        f32 previousX = current[0];
        f32 previousZ = current[2];
        f32 nextX = (requested[0] - previousX) * 0.005f / distance + previousX;
        f32 nextZ = (requested[2] - previousZ) * 0.005f / distance + previousZ;
        pointY = func_801A63FC(D_800E7AB9, nextX, nextZ);
        status = 1;
        pointX = nextX;
        pointZ = nextZ;
    } else {
        pointX = requested[0];
        pointY = requested[1];
        pointZ = requested[2];
    }
    lowX = D_801F0D98;
    highX = D_801F0DA0;
    lowZ = D_801F0D9C;
    highZ = D_801F0DA4;
    if (!(pointX < lowX || highX < pointX || pointZ < lowZ || highZ < pointZ)) {
        if (bypass != 0 ||
            cell_compatible(selector, origin, pointX, pointZ, lowX, highX, lowZ, highZ)) {
            current[0] = pointX;
            goto publish;
        }
    }

second_path:
    distance = func_0002CB80(FIELD(second, f32, 0x08) - current[0],
                            FIELD(second, f32, 0x10) - current[2]);
    status = -2;
    if (0.8f < distance) {
        f64 value = (f64)FIELD(second, f32, 0x18);
        f64 shifted = value - D_801EE848;
        f64 chosen;
        f32 turn;
        f32 nextX, nextZ;
        if (0.0 < shifted)
            chosen = shifted;
        else
            chosen = value + D_801EE848;
        turn = (f32)chosen;
        turn = (f32)((f64)(turn + turn) * D_801EE850);
        pointX = func_800907F0(turn) * 0.8f;
        pointZ = -(func_80092DB0(turn) * 0.8f);
        pointX += FIELD(second, f32, 0x08);
        pointZ += FIELD(second, f32, 0x10);
        pointY = func_801A63FC(D_800E7AB9, pointX, pointZ);
        distance = func_0002CB80(pointX - current[0], pointZ - current[2]);
        status = -1;
        if (0.005f < distance) {
            f32 previousX = current[0];
            f32 previousZ = current[2];
            nextX = (pointX - previousX) * 0.005f / distance + previousX;
            nextZ = (pointZ - previousZ) * 0.005f / distance + previousZ;
            pointY = func_801A63FC(D_800E7AB9, nextX, nextZ);
        } else {
            nextX = pointX;
            nextZ = pointZ;
        }
        pointX = nextX;
        pointZ = nextZ;
    } else {
        pointX = current[0];
        pointZ = current[2];
        pointY = current[1];
    }
    lowX = D_801F0D98;
    highX = D_801F0DA0;
    lowZ = D_801F0D9C;
    highZ = D_801F0DA4;
    if (!(pointX < lowX || highX < pointX || pointZ < lowZ || highZ < pointZ)) {
        if (bypass != 0 ||
            cell_compatible(selector, origin, pointX, pointZ, lowX, highX, lowZ, highZ)) {
            current[0] = pointX;
            goto publish;
        }
    }

    distance = func_0002CB80(FIELD(first, f32, 0x08) - current[0],
                            FIELD(first, f32, 0x10) - current[2]);
    status = -2;
    if (0.8f < distance) {
        f32 nextX, nextZ;
        status = -1;
        if (0.005f < distance) {
            f32 previousX = current[0];
            f32 previousZ = current[2];
            nextX = (FIELD(first, f32, 0x08) - previousX) * 0.005f / distance + previousX;
            nextZ = (FIELD(first, f32, 0x10) - previousZ) * 0.005f / distance + previousZ;
            pointY = func_801A63FC(D_800E7AB9, nextX, nextZ);
        } else {
            nextX = FIELD(first, f32, 0x08);
            nextZ = FIELD(first, f32, 0x10);
            pointY = FIELD(first, f32, 0x0C);
        }
        pointX = nextX;
        pointZ = nextZ;
    } else {
        pointX = current[0];
        pointY = current[1];
        pointZ = current[2];
    }
    if (pointX < D_801F0D98 || D_801F0DA0 < pointX ||
        pointZ < D_801F0D9C || D_801F0DA4 < pointZ)
        return 0;
    current[0] = pointX;
publish:
    current[1] = pointY;
    current[2] = pointZ;
    return status;
}
