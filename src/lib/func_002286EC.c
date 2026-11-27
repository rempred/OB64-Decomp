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
    s32 a;
    s32 b;
} Key224;
extern Key224 D_801E61E8[];
void func_002286EC(u16 cmd, u8 *o, Anim224 *st) {
    switch (cmd) {
        case 0:
            st->state = 2;
            st->b = 0;
            st->a = 0;
            st->k = 0;
            st->sy = 1.0f;
            st->sx = 1.0f;
            break;
        case 0x80:
        case 0x81:
            st->a = D_801E61E8[st->k].a;
            st->b = D_801E61E8[st->k].b;
            st->k++;
            if (st->k >= 8) {
                if (cmd == 0x81) {
                    st->k = 10;
                    (*(u16 *)((u8 *)(o) + (0x20))) = 0x8A;
                } else {
                    st->k = 0;
                    (*(u16 *)((u8 *)(o) + (0x20)))++;
                }
            }
            break;
        case 0x8A:
            if ((s32)--st->k < 0) {
                (*(u16 *)((u8 *)(o) + (0x20))) = 1;
            }
            break;
    }
}
