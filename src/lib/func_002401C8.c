typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
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
    u8 id;
    u8 pad[3];
    u8 *text;
} Title23;
extern Title23 D_801EFF04[27];
extern s8 D_801EFE8C[][2];
extern s8 D_801EFE8D[][2];
extern u8 D_801EFE34[];
typedef struct {
    u8 *font;
    u8 *text;
    s16 x;
    s16 y;
} Caption23;
void func_002401C8(u8 id) {
    Ctx23 *c = D_801EFE48;
    Caption23 *cap = (Caption23 *)&c->img5C8;
    u32 i;
    u8 *s;
    s32 w;
    s32 k;
    (*(u8 * *)((u8 *)(c) + (0x5CC))) = D_801EFE34;
    for (i = 0; i < 27; i++) {
        if (D_801EFF04[i].id == id) {
            cap->text = D_801EFF04[i].text;
        }
    }
    s = cap->text;
    w = 0;
    while (*s != 0) {
        k = (*s++ - 'A') * 2;
        w -= ((s8 *)D_801EFE8C)[k];
        w += 16 - ((s8 *)D_801EFE8D)[k];
    }
    cap->x = 0x113 - w;
    cap->y = 0x1E;
}
