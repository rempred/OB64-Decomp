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
extern u16 D_801D0724;
extern u16 D_801D0818;
extern Fx224 *D_801D081C;
void func_002265CC(Fx224 *o) {
    u16 idx = o - D_801D081C;
    u16 prev;
    if (D_801D0724 != 0xFFFF) {
        Fx224 *q = D_801D081C + D_801D0724;
        q->prev = idx;
    }
    prev = D_801D0724;
    D_801D0724 = idx;
    o->next = prev;
    if (D_801D0818 == 0xFFFF) {
        D_801D0818 = idx;
    }
}
