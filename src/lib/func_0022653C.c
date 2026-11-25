typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 link;
    u16 next;
    u16 prev;
    u16 unk06;
    s32 kind;
    s32 group;
    s32 unk10;
    s32 y;
    s32 floor;
    s32 speed;
    s16 state;
    u8 unk22[0x62];
} Fx224;
extern u16 D_801D0714;
extern Fx224 *D_801D081C;
Fx224 *func_0022653C(void) {
    Fx224 *o = ((void *)0);
    if (D_801D0714 != 0xFFFF) {
        o = &D_801D081C[D_801D0714];
        o->kind = 0;
        D_801D0714 = o->link;
    }
    return o;
}
