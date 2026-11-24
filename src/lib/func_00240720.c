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
typedef struct {
    s32 w0;
    s32 w4;
    s16 h8;
    s16 hA;
    s32 w[16];
    void *owner;
} Spr23;
void D_801AD9D4(Spr23 *s, s32 a);
void D_801ADD88(Spr23 *s, s32 x, s32 y, s32 a, s32 b);
s32 D_801C49A0(s32 x, s32 y, s16 h, s32 a, s32 b, u16 c, void *out);
s32 D_801C8B68(u8 *u);
s32 D_801C8BA4(u8 *u);
u16 D_801C8FB8(u8 *u);
s32 D_801C8C90(u8 *u);
void func_00240720(u8 *u) {
    u8 *e = (u8 *)D_801EFE48 + 0x5D4;
    s32 *xy = (s32 *)((u8 *)D_801EFE48 + 0x5DC);
    Spr23 s;
    s = *(Spr23 *)(((u8 **)u)[0] + 0x44);
    s.w0 = (*(s32 *)((u8 *)(u) + (0x50)));
    s.owner = ((u8 **)u)[0];
    D_801AD9D4(&s, 0);
    D_801ADD88(&s, (*(s32 *)((u8 *)(u) + (0x48))), (*(s32 *)((u8 *)(u) + (0x4C))), D_801C8B68(u), D_801C8BA4(u));
    (*(s32 *)((u8 *)(e) + (4))) = D_801C49A0((*(s32 *)((u8 *)(u) + (0x48))), (*(s32 *)((u8 *)(u) + (0x4C))), s.hA, D_801C8B68(u),
                                     D_801C8BA4(u), D_801C8FB8(u), xy);
    (*(u8 * *)((u8 *)(e) + (0))) = u;
    (*(s16 *)((u8 *)(e) + (0x18))) = 0xF0 - (*(s32 *)((u8 *)(e) + (0x10)));
    (*(s16 *)((u8 *)(e) + (0x1A))) = (*(s32 *)((u8 *)(e) + (0xC))) + 0x87;
    if (D_801C8C90(u) != 0) {
        e = (u8 *)D_801EFE48 + 0x5F0;
        xy = (s32 *)((u8 *)D_801EFE48 + 0x5F8);
        s = *(Spr23 *)(((u8 **)u)[1] + 0x44);
        s.w0 = (*(s32 *)((u8 *)(u) + (0x50)));
        s.owner = ((u8 **)u)[1];
        D_801AD9D4(&s, 0);
        D_801ADD88(&s, (*(s32 *)((u8 *)(u) + (0x48))), (*(s32 *)((u8 *)(u) + (0x4C))), D_801C8B68(u), D_801C8BA4(u));
        (*(s32 *)((u8 *)(e) + (4))) = D_801C49A0((*(s32 *)((u8 *)(u) + (0x48))), (*(s32 *)((u8 *)(u) + (0x4C))), s.hA, D_801C8B68(u),
                                         D_801C8BA4(u), D_801C8FB8(u), xy);
        (*(u8 * *)((u8 *)(e) + (0))) = u;
        (*(s16 *)((u8 *)(e) + (0x18))) = 0xE4 - (*(s32 *)((u8 *)(e) + (0x10)));
        (*(s16 *)((u8 *)(e) + (0x1A))) = (*(s32 *)((u8 *)(e) + (0xC))) + 0x8A;
    }
}
s32 D_801C8C90(u8 *u);
