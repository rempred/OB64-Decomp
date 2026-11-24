typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *func_000016C4(void *ptr);
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
void func_0023D200(s32 i, s32 k);
void func_0023D3A0(s32 i, s32 k);
void bcopy(void *src, void *dst, s32 n);
void *D_801C8FE8(unsigned int);
void *D_801CC234(s32, s32);
void func_0023D200(s32, s32);
void func_0023D3A0(s32, s32);
void func_0023D544(s32, s32);
s32 D_801BE978(s32 siz, s32 w, s32 h);
s32 D_801C8C90(u8 *u);
s32 D_801C8C74(u8 *u);
void func_0023D888(void) {
    {
        u8 *u = D_801C8FE8(1);
        s32 n, k, i;
        u8 *img;
        Ctx23 *s;
        void **pp;
        if (D_801C8C74(u)) {
            n = 3;
            k = 1;
        } else if (D_801C8C90(u)) {
            n = 2;
            k = 4;
        } else {
            n = 1;
            k = 0;
        }
        s = D_801EFE48;
        img = D_801CC234(0x36EA02, 0);
        bcopy(img + 8, (*(u8 * *)((u8 *)(s) + (0x150))) + 8, D_801BE978(2, (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(s) + (0x150)))) + (4))), (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(s) + (0x150)))) + (6)))));
        func_000016C4(img);
        for (i = 0; i < n; i++) {
            func_0023D200(i, k);
            func_0023D544(i, 3);
            pp = &(*(void * *)((u8 *)(D_801EFE48) + (0x1AC + i * 0x18)));
            k++;
            if (*pp != ((void *)0)) {
                func_000016C4(*pp);
                *pp = ((void *)0);
            }
        }
    }
    {
        u8 *u = D_801C8FE8(2);
        s32 n, k, i;
        u8 *img;
        Ctx23 *s;
        void **pp;
        if (D_801C8C74(u)) {
            n = 3;
            k = 1;
        } else if (D_801C8C90(u)) {
            n = 2;
            k = 4;
        } else {
            n = 1;
            k = 0;
        }
        s = D_801EFE48;
        img = D_801CC234(0x36EA02, 1);
        bcopy(img + 8, (*(u8 * *)((u8 *)(s) + (0xE8))) + 8, D_801BE978(2, (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(s) + (0xE8)))) + (4))), (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(s) + (0xE8)))) + (6)))));
        func_000016C4(img);
        for (i = 3; i < n + 3; i++) {
            func_0023D3A0(i, k);
            func_0023D544(i, 2);
            pp = &(*(void * *)((u8 *)(D_801EFE48) + (0x1AC + i * 0x18)));
            k++;
            if (*pp != ((void *)0)) {
                func_000016C4(*pp);
                *pp = ((void *)0);
            }
        }
    }
}
