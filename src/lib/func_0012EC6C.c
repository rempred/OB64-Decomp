/* Adapted from cosburn92/vibe_ogre_decomp src/12AE10.c,
 * func_801DA52C_ovl_101CE0 at d5fa941860cd8efeec3bacb09dcd0826c2b6e798.
 * US Rev 0 ROM 0x0012EC6C. */
typedef unsigned char u8;
typedef signed int s32;
typedef float f32;

typedef struct {
    f32 x, y, z;
} Vec3f;

typedef struct {
    u8 unk00[8];
    f32 x, y, z;
} MapUnit;

extern void func_0012EA80(s32 site, Vec3f *out);
extern f32 hypotf(f32 x, f32 z);

/* The original double remains in the shared retail data row at ROM 0x142FF8. */
extern const double D_801EE8B8;

/* Tests whether the unit is within the stored horizontal distance of site -1. */
s32 func_0012EC6C(MapUnit *unit) {
    Vec3f site_position;
    s32 within_radius;

    func_0012EA80(-1, &site_position);
    within_radius = 0;
    if (hypotf(site_position.x - unit->x, site_position.z - unit->z) < D_801EE8B8) {
        within_radius = 1;
    }
    return within_radius;
}
