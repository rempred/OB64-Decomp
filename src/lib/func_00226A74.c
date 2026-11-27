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
extern Fx224 *D_801D081C;
void func_00226A74(void) {
    s32 i = D_801D0724;
    Fx224 *o;
    if (i == 0xFFFF) {
        return;
    }
    do {
        o = &D_801D081C[i];
        i = o->y;
        if (o->floor < i) {
            o->y -= o->speed;
            o->speed++;
            if (o->y <= o->floor) {
                o->y = o->floor;
                o->speed = 0;
            }
        }
        i = o->next;
    } while (i != 0xFFFF);
}
