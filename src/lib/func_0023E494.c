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
void guMtxIdentF(void *m);
void *D_801CC234(s32, s32);
s32 func_0023E3C8(u8 *o);
extern void *D_801EFE4C;
void D_801ADADC(void *o);
s32 func_0023E3C8(u8 *o);
void func_0023E494(void) {
    s32 img = 0;
    s32 i;
    Ent23 *e;
    D_801EFE4C = D_801CC234(0x36EA02, 2);
    for (i = 0; i < 4; i++) {
        e = &D_801EFE48->ent[i];
        e->draw = func_0023E3C8;
        e->id = i;
        e->unk62 = 0x7C;
        guMtxIdentF(e->mf);
        e->mf[3][0] = -100.0f;
        e->flags |= 0x10;
        e->mf[3][2] = 10.0f;
        switch (i) {
            case 0:
                img = 2;
                e->sx = e->sy = e->sz = -13000;
                e->unk64 = -0x57;
                e->flags |= 2;
                break;
            case 1:
                img = 2;
                e->sx = e->sy = e->sz = -10000;
                e->unk64 = 0x5A;
                e->flags |= 1;
                break;
            case 2:
                img = 1;
                e->sx = e->sy = e->sz = -11500;
                e->unk64 = 0x5A;
                e->flags |= 2;
                break;
            case 3:
                img = 0;
                e->sx = e->sy = e->sz = -12000;
                e->unk64 = 0x5A;
                e->flags |= 1;
                break;
        }
        if (i == 2 || i == 3) {
            e->img = D_801CC234(0x36EA02, img);
        } else {
            e->img = D_801EFE4C;
        }
        D_801ADADC(e);
    }
}
