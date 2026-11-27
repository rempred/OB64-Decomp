typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    f32 x;
    f32 y;
} Scale224;
typedef struct {
    s32 state;
    s32 a;
    s32 b;
    f32 sx;
    f32 sy;
    s32 state2;
    s32 a2;
    s32 b2;
    f32 sx2;
    f32 sy2;
    u32 k;
    u32 k2;
} AnimPair224;
extern Scale224 D_801E63D0[];
void func_002258CC(u16 cmd, u8 *o, AnimPair224 *st) {
    switch (cmd) {
        case 0:
            st->state = 7;
            st->a = 0;
            st->b = -4;
            st->sx = st->sy = 0.0f;
            st->state2 = -1;
            st->a2 = 0;
            st->b2 = 4;
            st->sx2 = st->sy2 = 0.0f;
            st->k2 = 0;
            st->k = 0;
            break;
        case 0x80:
            st->sx = D_801E63D0[st->k].x;
            st->sy = D_801E63D0[st->k].y;
            st->k++;
            if (st->k >= 8) {
                st->k = 0;
                (*(u16 *)((u8 *)(o) + (0x20)))++;
            }
            break;
        case 0x81:
            st->state2 = 8;
            st->sx2 = D_801E63D0[st->k2].x;
            st->sy2 = D_801E63D0[st->k2].y;
            st->k2++;
            if (st->k2 >= 8) {
                st->k = 10;
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
