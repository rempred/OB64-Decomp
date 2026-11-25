typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    s32 state;
    s32 a;
    s32 b;
    f32 sx;
    f32 sy;
    u32 k;
} Anim224;
typedef struct {
    f32 x;
    f32 y;
} Scale224;
extern Scale224 D_801E60E0[];
u8 D_801BE0F4(s32 a, s32 b);
void func_002282A4(u16 cmd, u8 *o, Anim224 *st) {
    switch (cmd) {
        case 0:
            st->b = 0;
            st->a = 0;
            st->sx = st->sy = 0.0f;
            if (D_801BE0F4((*(s32 *)((u8 *)((*(u8 * *)((u8 *)(o) + (0xC)))) + (0x48))), (*(s32 *)((u8 *)((*(u8 * *)((u8 *)(o) + (0xC)))) + (0x4C))))) {
                st->state = 0;
            } else {
                st->state = 1;
            }
            st->k = 0;
            break;
        case 0x80:
            st->sx = D_801E60E0[st->k].x;
            st->sy = D_801E60E0[st->k].y;
            st->k++;
            if (st->k >= 10) {
                st->k = 20;
                (*(u16 *)((u8 *)(o) + (0x20))) = 0x8A;
            }
            break;
        case 0x8A:
            if ((s32)--st->k < 0) {
                (*(u16 *)((u8 *)(o) + (0x20))) = 1;
            }
            break;
    }
}
