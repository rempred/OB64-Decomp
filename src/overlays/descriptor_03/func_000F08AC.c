typedef signed int s32;
typedef float f32;
s32 func_000F08AC(f32 *cam, f32 (*pts)[3]) {
    f32 x = cam[0];
    f32 y = cam[1];
    f32 z = cam[2];
    s32 k;
    s32 i;
    for (k = 0; k < 4; k++) {
        f32 nx = cam[k * 3 + 18];
        f32 ny = cam[k * 3 + 19];
        f32 nz = cam[k * 3 + 20];
        for (i = 0; i < 8; i++) {
            if ((pts[i][0] - x) * nx + (pts[i][1] - y) * ny + (pts[i][2] - z) * nz >= 0.0f) {
                break;
            }
        }
        if (i == 8) {
            return 0;
        }
    }
    return 1;
}
