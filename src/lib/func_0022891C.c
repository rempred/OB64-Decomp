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
typedef struct {
    s32 unk0;
    s32 timer;
    u8 alpha;
} FxCtl224;
void func_0022891C(u16 k, Fx224 *o, FxCtl224 *s) {
    s32 t;
    switch (k) {
        case 0:
            t = o->unk10;
            s->timer = 0;
            s->alpha = 0xFF;
            s->unk0 = t;
            break;
        case 0x80:
            if (s->timer++ >= 20) {
                s->timer = 10;
                o->state = 0x8A;
            }
            break;
        case 0x8A:
            s->timer--;
            s->alpha -= 25;
            if (s->timer < 0) {
                s->alpha = 0;
                o->state = 1;
            }
            break;
    }
}
