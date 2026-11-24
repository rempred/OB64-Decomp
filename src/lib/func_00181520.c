typedef signed short s16;
typedef signed int s32;
typedef struct {
    s32 data[0x16];
} Camera;
typedef struct {
    Camera *saved;
    s32 arg;
    s16 timer;
    s16 alpha;
    s16 *alphaPtr;
    s16 unk10;
    s32 unk14;
} Ovl17F9C0Ctx;
extern Ovl17F9C0Ctx *D_8021AF00;
s32 func_00181520(void);
s32 func_00181520(void) {
    s16 *p = D_8021AF00->alphaPtr;
    s16 target = D_8021AF00->unk10;
    s32 frames = D_8021AF00->unk14;
    s16 d;
    s16 step;
    if (p == ((void *)0)) {
        return 0;
    }
    d = target - *p;
    if (d == 0) {
        return 1;
    }
    if (d > 0) {
        step = target / frames;
    } else {
        step = -((255 - target) / frames);
    }
    *p += step;
    if (step < 0) {
        if (*p <= target) {
            *p = target;
            return 1;
        }
    } else if (*p >= target) {
        *p = target;
        return 1;
    }
    return 0;
}
