typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 next;
    u8 kind;
    u8 state;
    u8 unk03;
    s32 key;
    u8 data[0x84];
} Rec149;
typedef struct {
    s16 t;
    u16 kind;
    s32 cb[2];
    s8 dy;
    u8 alpha;
    u8 frame;
    u8 b0F;
} Fade149;
void func_00145DC8(s32 *p, s32 v);
void func_00145DD0(s32 *p, s32 v);
void func_0014DB78(void);
void func_0014A5EC(Rec149 *e) {
    Fade149 *f = (Fade149 *)e->data;
    switch (e->state) {
        case 2:
            func_00145DC8(f->cb, (s32)func_0014DB78);
            func_00145DD0(f->cb, e->key + 0x10);
            (*(s32 * *)((u8 *)(e->key) + (0xB4))) = f->cb;
            f->dy = 0;
            f->alpha = 0;
            f->frame = 0;
            f->t = 0;
            e->state = 3;
            f->b0F = (u16)(f->kind - 6) < 2 ? 3 : 0;
        case 3: {
            s32 a = f->alpha;
            s16 q;
            if (f->t < 16) {
                a += 16;
                if (a >= 255) {
                    a = 255;
                }
            } else if (f->t >= 40) {
                a -= 16;
                if (a <= 0) {
                    a = 0;
                }
            }
            f->alpha = a;
            q = f->t / 3;
            f->frame = q % 4;
            if (f->t < 36) {
                f->dy = -f->t / 3;
            } else {
                f->dy = -12;
            }
            f->t++;
            if (f->t >= 56) {
                e->state = 4;
            }
            break;
        }
        case 4:
            (*(u32 *)((u8 *)((*(u32 * *)((u8 *)(e->key) + (0)))) + (0))) &= ~0x4000000;
            if ((*(s32 * *)((u8 *)(e->key) + (0xB4))) == f->cb) {
                (*(s32 * *)((u8 *)(e->key) + (0xB4))) = ((void *)0);
            }
            e->state = 1;
            break;
    }
}
