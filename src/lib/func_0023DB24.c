typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
typedef struct {
    s32 (*draw)(u8 *o);
    s32 sx;
    s32 sy;
    s32 sz;
    u8 unk10[8];
    void *img;
    u8 unk1C[4];
    f32 mf[4][4];
    u16 flags;
    s16 unk62;
    s16 unk64;
    s16 id;
} Ent23;
typedef struct {
    Ent23 ent[4];
    u8 *logo;
    u8 unk1A4[0x98];
    u16 unk23C;
    u8 unk23E[0x10E];
    u8 *backdrop;
    u8 unk350[0x10];
    s32 backdropSize;
    u8 unk364[8];
    u8 unk36C[4];
    s16 x0;
    s16 x1;
    s16 y0;
    s16 y1;
    u8 unk378[0x24C];
    u8 *img5C4;
    u8 *img5C8;
    u8 unk5CC[0x40];
    u8 *img60C;
    s16 unk610;
    s16 unk612;
    u8 unk614[0x3C];
    u16 flags;
    s16 h652;
    u8 unk654[2];
    s16 fade;
} Ctx23;
extern Ctx23 *D_801EFE48;
void func_0023DB24(s32 id);
void func_0023DB24(s32 id) {
    Ent23 *e = &D_801EFE48->ent[id];
    u8 *m = (u8 *)e + 0x18;
    if (e->flags & 0x20) {
        e->unk64 -= 3;
        if (e->unk64 == 0x42) {
            e->sx -= 1000;
            e->sy -= 1000;
            e->sz -= 1000;
        }
        if (e->unk64 < -0x56) {
            e->unk64 = -0x57;
            e->flags = (e->flags & ~0x20) | 0x10;
            if (!(id & 1)) {
                Ent23 *o = D_801EFE48->ent;
                if (id / 2 == 0) {
                    o += 2;
                }
                o->unk64 = 90;
                o->sx = o->sy = o->sz = -11500;
                e->sx = e->sy = e->sz = -13000;
            } else {
                Ent23 *o;
                if ((id - 1) / 2 != 0) {
                    o = &D_801EFE48->ent[1];
                } else {
                    o = &D_801EFE48->ent[3];
                }
                o->unk64 = 90;
                (*(s16 *)((u8 *)(m) + (0x4C))) = 90;
                o->sx = o->sy = o->sz = -10000;
                e->sx = e->sy = e->sz = -12000;
            }
        }
    }
}
