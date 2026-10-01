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

/* The direct consumer supplies two unit pointers, a byte-valued selector,
 * two three-float points and a full word. It consumes signed status values.
 * Keep the selector as a word: this body performs no entry narrowing. */
s32 func_0012B440(RuntimeUnit *first, RuntimeUnit *second, s32 selector,
                 f32 *current, f32 *requested, s32 bypass)
{
    f32 originalZ = current[2];
    f32 lowZ = D_801F0D9C;
    f32 deltaZ = originalZ - lowZ;
    f32 factor = 64.0f;
    f32 highZ = D_801F0DA4;
    f32 spanZ = highZ - lowZ;
    f32 gridZ = deltaZ * factor / spanZ;
    f32 originalX = current[0];
    f32 lowX = D_801F0D98;
    f32 deltaX = originalX - lowX;
    f32 highX = D_801F0DA0;
    f32 spanX = highX - lowX;
    f32 gridX = deltaX * factor / spanX;
    s32 origin = ((s32)gridZ << 6) + (s32)gridX;
    f32 point[3];
    f32 x = requested[0];
    f32 z;
    f32 distance;
    s32 status;

    /* Reject only the original ordered less-than tests. An unordered
     * coordinate does not satisfy one of these comparisons. */
    if (x < lowX)
        goto second_path;
    if (highX < x)
        goto second_path;
    z = requested[2];
    if (z < lowZ)
        goto second_path;
    if (highZ < z)
        goto second_path;
    if (bypass == 0) {
        f32 cellZ = (z - lowZ) * 64.0f / (highZ - lowZ);
        f32 cellX = (x - lowX) * 64.0f / (highX - lowX);
        u8 *bankBase = &D_800E7AC3;
        u8 *map = *(u8 **)(bankBase + D_800E7AC3 * 4 - 0x33);
        s32 index = ((s32)cellZ << 6) + (s32)cellX;
        u8 cell = map[index];
        u16 *row = (u16 *)((u32)D_801F36D8 + (selector << 6));
        if (row[cell] == 0xFFFF)
            goto second_path;
        if (D_801EB520[map[origin]][cell] != 0)
            goto second_path;
    }

    distance = func_0002CB80(x - originalX, z - originalZ);
    status = 2;
    if (0.005f < distance) {
        f32 previousX = current[0];
        f32 previousZ = current[2];
        f32 nextX = (requested[0] - previousX) * 0.005f / distance + previousX;
        f32 nextZ = (requested[2] - previousZ) * 0.005f / distance + previousZ;
        point[1] = func_801A63FC(D_800E7AB9, nextX, nextZ);
        status = 1;
        point[0] = nextX;
        point[2] = nextZ;
    } else {
        point[0] = requested[0];
        point[1] = requested[1];
        point[2] = requested[2];
    }
    lowX = D_801F0D98;
    highX = D_801F0DA0;
    lowZ = D_801F0D9C;
    highZ = D_801F0DA4;
    if (point[0] < lowX) goto second_path;
    if (highX < point[0]) goto second_path;
    if (point[2] < lowZ) goto second_path;
    if (highZ < point[2]) goto second_path;
    if (bypass == 0) {
        f32 cellZ = (point[2] - lowZ) * 64.0f / (highZ - lowZ);
        f32 cellX = (point[0] - lowX) * 64.0f / (highX - lowX);
        u8 *bankBase = &D_800E7AC3;
        u8 *map = *(u8 **)(bankBase + D_800E7AC3 * 4 - 0x33);
        s32 index = ((s32)cellZ << 6) + (s32)cellX;
        u8 cell = map[index];
        u16 *row = (u16 *)((u32)D_801F36D8 + (selector << 6));
        if (row[cell] == 0xFFFF)
            goto second_path;
        if (D_801EB520[map[origin]][cell] != 0)
            goto second_path;
    }
    current[0] = point[0];
    current[1] = point[1];
    current[2] = point[2];
    return status;

second_path:
    {
    s32 secondaryStatus;
    distance = func_0002CB80(FIELD(second, f32, 0x08) - current[0],
                            FIELD(second, f32, 0x10) - current[2]);
    secondaryStatus = -2;
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
        point[0] = func_800907F0(turn) * 0.8f;
        point[2] = -(func_80092DB0(turn) * 0.8f);
        point[0] += FIELD(second, f32, 0x08);
        point[2] += FIELD(second, f32, 0x10);
        point[1] = func_801A63FC(D_800E7AB9, point[0], point[2]);
        distance = func_0002CB80(point[0] - current[0], point[2] - current[2]);
        secondaryStatus = -1;
        if (0.005f < distance) {
            f32 previousX = current[0];
            f32 previousZ = current[2];
            nextX = (point[0] - previousX) * 0.005f / distance + previousX;
            nextZ = (point[2] - previousZ) * 0.005f / distance + previousZ;
            point[1] = func_801A63FC(D_800E7AB9, nextX, nextZ);
        } else {
            nextX = point[0];
            nextZ = point[2];
        }
        point[0] = nextX;
        point[2] = nextZ;
    } else {
        point[0] = current[0];
        point[2] = current[2];
        point[1] = current[1];
    }
    lowX = D_801F0D98;
    highX = D_801F0DA0;
    lowZ = D_801F0D9C;
    highZ = D_801F0DA4;
    if (point[0] < lowX) goto first_path;
    if (highX < point[0]) goto first_path;
    if (point[2] < lowZ) goto first_path;
    if (highZ < point[2]) goto first_path;
    if (bypass == 0) {
        f32 cellZ = (point[2] - lowZ) * 64.0f / (highZ - lowZ);
        f32 cellX = (point[0] - lowX) * 64.0f / (highX - lowX);
        u8 *bankBase = &D_800E7AC3;
        u8 *map = *(u8 **)(bankBase + D_800E7AC3 * 4 - 0x33);
        s32 index = ((s32)cellZ << 6) + (s32)cellX;
        u8 cell = map[index];
        u16 *row = (u16 *)((u32)D_801F36D8 + (selector << 6));
        if (row[cell] == 0xFFFF)
            goto first_path;
        if (D_801EB520[map[origin]][cell] != 0)
            goto first_path;
    }
    current[0] = point[0];
    current[1] = point[1];
    current[2] = point[2];
    return secondaryStatus;

    }
first_path:
    {
    s32 firstStatus;
    distance = func_0002CB80(FIELD(first, f32, 0x08) - current[0],
                            FIELD(first, f32, 0x10) - current[2]);
    firstStatus = -2;
    if (0.8f < distance) {
        f32 nextX, nextZ;
        firstStatus = -1;
        if (0.005f < distance) {
            f32 previousX = current[0];
            f32 previousZ = current[2];
            nextX = (FIELD(first, f32, 0x08) - previousX) * 0.005f / distance + previousX;
            nextZ = (FIELD(first, f32, 0x10) - previousZ) * 0.005f / distance + previousZ;
            point[1] = func_801A63FC(D_800E7AB9, nextX, nextZ);
        } else {
            nextX = FIELD(first, f32, 0x08);
            nextZ = FIELD(first, f32, 0x10);
            point[1] = FIELD(first, f32, 0x0C);
        }
        point[0] = nextX;
        point[2] = nextZ;
    } else {
        point[0] = current[0];
        point[1] = current[1];
        point[2] = current[2];
    }
    if (point[0] < D_801F0D98) return 0;
    if (D_801F0DA0 < point[0]) return 0;
    if (point[2] < D_801F0D9C) return 0;
    if (D_801F0DA4 < point[2]) return 0;
    current[0] = point[0];
    current[1] = point[1];
    current[2] = point[2];
    return firstStatus;
    }
}
