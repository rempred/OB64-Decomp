typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
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
extern void *D_801EFE4C;
extern s32 D_800E9C0A;
extern u8 D_801976DA;
void D_8017A714(void);
extern u8 D_801976DA;
void func_0024128C(void) {
    u8 *s;
    void **pp;
    s32 i;
    s32 off;
    (*(u8 *)((u8 *)(&D_800E9C0A) + (8))) = D_801EFE48->unk654[1];
    D_801976DA = D_801EFE48->unk654[0];
    for (i = 0, off = 0x1AC; i < 6; off += 0x18) {
        pp = (void **)((u8 *)D_801EFE48 + off);
        i++;
        if (*pp != ((void *)0)) {
            func_000016C4(*pp);
            *pp = ((void *)0);
        }
    }
    s = (u8 *)D_801EFE48;
    if ((*(void * *)((u8 *)(s) + (0x1A0))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0x1A0))));
        (*(void * *)((u8 *)(s) + (0x1A0))) = ((void *)0);
        s = (u8 *)D_801EFE48;
    }
    if ((*(void * *)((u8 *)(s) + (0x150))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0x150))));
        (*(void * *)((u8 *)(s) + (0x150))) = ((void *)0);
    }
    s = (u8 *)D_801EFE48;
    if ((*(void * *)((u8 *)(s) + (0xE8))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0xE8))));
        (*(s32 *)((u8 *)(s) + (0xE8))) = 0;
    }
    func_000016C4(D_801EFE4C);
    s = (u8 *)D_801EFE48;
    {
        void *p = (*(void * *)((u8 *)(s) + (0x36C)));
        D_801EFE4C = ((void *)0);
        if (p != ((void *)0)) {
            func_000016C4(p);
            (*(s32 *)((u8 *)(s) + (0x36C))) = 0;
        }
    }
    s = (u8 *)D_801EFE48;
    if ((*(void * *)((u8 *)(s) + (0x34C))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0x34C))));
        (*(void * *)((u8 *)(s) + (0x34C))) = ((void *)0);
        s = (u8 *)D_801EFE48;
    }
    if ((*(void * *)((u8 *)(s) + (0x244))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0x244))));
        (*(void * *)((u8 *)(s) + (0x244))) = ((void *)0);
        (*(s32 *)((u8 *)(s) + (0x248))) = 0;
    }
    s = (u8 *)D_801EFE48;
    if ((*(void * *)((u8 *)(s) + (0x60C))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0x60C))));
        (*(void * *)((u8 *)(s) + (0x60C))) = ((void *)0);
        s = (u8 *)D_801EFE48;
    }
    if ((*(void * *)((u8 *)(s) + (0x5C4))) != ((void *)0)) {
        func_000016C4((*(void * *)((u8 *)(s) + (0x5C4))));
        (*(void * *)((u8 *)(s) + (0x5C4))) = ((void *)0);
    }
    s = (u8 *)D_801EFE48;
    {
        void *p = (*(void * *)((u8 *)(s) + (0x5C8)));
        i = 0;
        if (p != ((void *)0)) {
            func_000016C4(p);
            (*(s32 *)((u8 *)(s) + (0x5C8))) = 0;
        }
    }
    for (off = 0x5D4; i < 2; off += 0x1C) {
        pp = (void **)((u8 *)D_801EFE48 + off + 4);
        i++;
        if (*pp != ((void *)0)) {
            func_000016C4(*pp);
            *pp = ((void *)0);
        }
    }
    D_8017A714();
    func_000016C4(D_801EFE48);
    D_801EFE48 = ((void *)0);
}
