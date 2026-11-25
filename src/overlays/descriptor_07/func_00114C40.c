typedef float f32;
extern f32 D_801F39A4;
extern f32 D_801EAC58;
void func_00114C40(void) {
    if (D_801F39A4 < 1.5f) {
        D_801F39A4 += 0.02f;
    } else {
        D_801F39A4 = 0.05f;
    }
    D_801EAC58 -= 4.0f;
    if (D_801EAC58 < 0.0f) {
        D_801EAC58 += 360.0f;
    }
}
