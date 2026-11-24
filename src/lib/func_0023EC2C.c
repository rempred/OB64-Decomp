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
extern inline s32 fadeOut23(s16 *f, u8 step) {
    if (*f != 0xFF) {
        *f = step + *f;
        if (*f < 0xFF) {
            return 0;
        }
        *f = 0xFF;
        return 1;
    }
    return 0;
}
extern inline void close23(Ctx23 *s) {
    if (s->x1 >= s->y1) {
        s->x1 -= 8;
        if (s->x1 <= s->y1) {
            s->x1 = s->y1;
            s->y1 = 0xF2;
        }
    }
}
s32 func_0023EC2C(void) {
    Ctx23 *s = D_801EFE48;
    u8 step = 25;
    s16 *f = &s->h652;
    close23(s);
    return fadeOut23(f, step);
}
