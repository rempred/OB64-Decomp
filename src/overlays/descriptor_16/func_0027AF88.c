typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
typedef struct {
    f32 x;
    f32 y;
} Scroll27;
extern Scroll27 D_801D0774;
extern u8 *D_8022D130[];
void func_0027AF88(s16 k, s16 *r) {
    u8 *u = D_8022D130[k];
    f32 *sx = &D_801D0774.x;
    if (*sx > 0.0f) {
        r[0] = (*(s32 *)((u8 *)(u) + (0x98))) + *sx + 5.0f;
        r[1] = (*(s32 *)((u8 *)(u) + (0x9C))) - D_801D0774.y - 12.0f;
        r[2] = (*(s32 *)((u8 *)(u) + (0x98))) + *sx + 5.0f;
        r[3] = (*(s32 *)((u8 *)(u) + (0x9C))) - D_801D0774.y - 60.0f;
    } else {
        r[0] = (*(s32 *)((u8 *)(u) + (0x98))) + *sx;
        r[1] = (*(s32 *)((u8 *)(u) + (0x9C))) - D_801D0774.y + 16.0f;
        r[2] = (*(s32 *)((u8 *)(u) + (0x98))) + *sx + 55.0f;
        r[3] = (*(s32 *)((u8 *)(u) + (0x9C))) - D_801D0774.y + 55.0f;
    }
}
