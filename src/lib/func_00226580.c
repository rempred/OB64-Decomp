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
inline void func_00226580(Fx224 *o) {
    o->kind = 0;
    o->link = D_801D0714;
    D_801D0714 = o - D_801D081C;
}
