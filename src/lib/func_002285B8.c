typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    f32 x;
    f32 y;
    s16 dx;
    s16 dy;
} Step224;
extern Step224 D_801E614C[];
typedef struct {
    s32 mode;
    s32 dx;
    s32 dy;
    f32 x;
    f32 y;
    u32 step;
} Walk224;
void func_002285B8(u16 msg, u8 *o, Walk224 *a) {
    switch (msg) {
        case 0:
            a->mode = 3;
            a->dy = 0;
            a->dx = 0;
            a->step = 0;
            a->x = a->y = 0.0f;
            break;
        case 0x80:
            (*(u16 *)((u8 *)(o) + (0x20))) = 0x81;
            a->x = D_801E614C[a->step].x;
            a->y = D_801E614C[a->step].y;
            a->dx = D_801E614C[a->step].dx;
            a->dy = D_801E614C[a->step].dy;
            if (++a->step >= 13) {
                a->step = 10;
                (*(u16 *)((u8 *)(o) + (0x20))) = 0x8A;
            }
            break;
        case 0x81:
            (*(u16 *)((u8 *)(o) + (0x20))) = 0x80;
            break;
        case 0x8A:
            if ((s32)--a->step < 0) {
                (*(u16 *)((u8 *)(o) + (0x20))) = 1;
            }
            break;
    }
}
