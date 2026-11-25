typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void *D_8009DD38(u32 handle);
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
extern u8 *D_8019780C;
typedef struct {
    u8 b[26];
} Note712;
typedef struct {
    u32 size;
    u8 pad4[0x1C];
} NoteState712;
typedef struct {
    u8 pad[0x54];
    NoteState712 st[16];
    u8 pad254[0x298 - 0x254];
    Note712 notes[16];
} PakNotes712;
void D_8017BDC0(void);
s32 func_00074974(void);
typedef struct {
    s16 h0;
    u8 pad2[0x18];
    s16 h1A;
    void *chunk;
    u8 pad20[4];
    s32 x24;
    s32 alpha;
    s8 step;
    u8 pad2D[3];
    s32 x30;
    s32 x34;
    s32 x38;
    s32 x3C;
    s32 x40;
    s32 x44;
    s32 x48;
    s32 x4C;
    s32 x50;
} Pak712;
s32 func_0007413c(void) {
    s32 i;
    s32 st;
    D_8017BDC0();
    {
        Pak712 *p = func_00001330(0x47C);
        D_8019780C = (u8 *)p;
        p->h0 = 0;
        p->h1A = 0;
    }
    {
        void *c = D_8009DD38(0x1DEDD82);
        Pak712 *p = (Pak712 *)D_8019780C;
        D_8019780C[4] = 0;
        p->chunk = c;
        p->x30 = 4;
        p->x34 = 0x10;
        p->x3C = 1;
        p->x24 = 0;
        p->x38 = 3;
        p->x40 = 0;
        p->x44 = 0;
        p->x48 = 0;
        p->x4C = 0;
        p->x50 = 0;
    }
    D_8019780C[0x20] = 0;
    (*(s8 *)((u8 *)(D_8019780C) + (0x2C))) = -8;
    (*(s32 *)((u8 *)(D_8019780C) + (0x28))) = (*(s8 *)((u8 *)(D_8019780C) + (0x2C))) + 0xFF;
    bzero(D_8019780C + 0x54, 0x200);
    bzero(D_8019780C + 0x254, 0x10);
    {
        u8 *b = D_8019780C;
        for (i = 0; i < 4; i++) {
            (*(s32 *)((u8 *)(b) + (i * 4 + 0x450))) = -1;
        }
    }
    for (i = 0; i < 16; i++) {
        ((PakNotes712 *)D_8019780C)->notes[i].b[0] = 0xFF;
    }
    (*(s32 *)((u8 *)(D_8019780C) + (0x46C))) = 0;
    (*(s32 *)((u8 *)(D_8019780C) + (0x460))) = 0;
    (*(s32 *)((u8 *)(D_8019780C) + (0x468))) = 0;
    (*(s32 *)((u8 *)(D_8019780C) + (0x464))) = 0;
    (*(s32 *)((u8 *)(D_8019780C) + (0x470))) = 0;
    (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = 0;
    func_000744c0();
    func_00074374();
    (*(s32 *)((u8 *)(D_8019780C) + (0x478))) = 0;
    (*(s32 *)((u8 *)(D_8019780C) + (0x474))) = 0;
    if (func_00074974() != 0) {
        goto retry;
    }
    st = (*(s32 *)((u8 *)(D_8019780C) + (0x438)));
    if (st != 1) {
        if (st != 0) {
            if (st == 2) {
                (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) = 0x6B;
            }
        } else {
            (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) = 1;
        }
    } else if (func_00074974() != 0) {
    retry:
        (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) = 0x64;
        (*(s32 *)((u8 *)(D_8019780C) + (0x4C))) = 0;
    } else {
        s32 t = (*(s32 *)((u8 *)(D_8019780C) + (0x438)));
        if (t == st) {
            goto done;
        }
        if (t == 0) {
            goto zero;
        }
        if (t == 2) {
            goto two;
        }
        return 0;
    zero:
        (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) = st;
        return 0;
    two:
        (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) = 0x6B;
        return 0;
    done:
        func_000016C4((*(void * *)((u8 *)(D_8019780C) + (0x1C))));
        func_000016C4(D_8019780C);
        D_8019780C = ((void *)0);
        return 1;
    }
    return 0;
}
void func_00074374(void);
void func_000744c0(void);
