typedef unsigned char u8;
typedef int s32;
typedef float f32;

/* Only the three observed twelve-byte points beginning at+0x28 are viewed. */
typedef struct RuntimeUnit {
    u8 pad_00[0x28];
    f32 points[3][3];
} RuntimeUnit;

extern s32 D_801F36C4, D_801F36C8, D_801F36CC;
extern s32 D_801F3658;
extern RuntimeUnit *D_801F0CB0[];
extern u8 D_800E7AC0;
extern void func_000f6b10(void *, f32 *, f32 *, f32 *);
extern f32 hypotf(f32, f32);

s32 func_00108AA0(f32 x, f32 z, s32 mode)
{
    f32 point[3];
    f32 projected_x, projected_z;
    f32 distance;
    s32 selected = -(D_801F36C4 == -1);
    RuntimeUnit **slot;
    u8 *scene_selector;
    s32 result;

    if (D_801F36C8 != -1) selected = 1;
    if (D_801F36CC != -1) selected = 2;
    if (selected == -1) return -1;

    slot = &D_801F0CB0[D_801F3658];
    point[0] = (*slot)->points[selected][0];
    point[2] = (*slot)->points[selected][2];
    point[1] = (*slot)->points[selected][1];

    /* The existing selector byte anchors the pointer table88 bytes earlier.
     * This view preserves the original owner; residency remains unresolved. */
    scene_selector = &D_800E7AC0;
    func_000f6b10(((void **)(scene_selector - 0x58))[*scene_selector],
                 point, &projected_x, &projected_z);
    distance = hypotf(projected_x - x, projected_z - z);
    /* This genuine success join has incoming edges from both thresholds. */
    if (mode != 0) {
        if (!(distance <= 25.0f)) {
            result = -1;
        } else {
            goto accepted_point;
        }
    } else {
        if (distance <= 12.0f) {
        accepted_point:
            result = 99;
            if (selected != -1) result = selected;
        } else {
            result = -1;
        }
    }
    return result;
}
