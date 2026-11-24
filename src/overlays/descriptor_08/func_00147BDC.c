typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
typedef struct {
    u32 flags;
    u8 unk04[0x6C];
    s32 unk70;
} MapUnit;
extern u8 *D_801FDA3C;
extern s32 D_801F367C;
extern MapUnit *D_801F0CB0[];
typedef struct {
    s32 id;
    u16 flags;
    u8 unk06[5];
    u8 bB;
} MapEntry;
extern u16 D_801FDA32;
extern MapEntry **D_801FDA34;
extern inline s32 func_001461D4(MapUnit *u) {
    s32 n = D_801F367C;
    s32 i;
    for (i = 0; i < n; i++) {
        if (D_801F0CB0[i] == u) {
            return i;
        }
    }
    for (;;) {
    }
}
void func_00147BDC(void *u) {
    s32 i;
    u32 k;
    MapEntry *e;
    u8 *p;
    for (i = 0; i < D_801FDA32; i++) {
        if (D_801FDA34[i] != ((void *)0) && D_801FDA34[i]->id == (s32)u) {
            break;
        }
    }
    if (i < D_801FDA32) {
        e = D_801FDA34[i];
        p = (u8 *)e + 0x30;
        for (k = 0; k < 2; k++) {
            u8 *q = (u8 *)(k * 0x14 + (s32)p);
            q += 0x10;
            func_000016C4(((void **)q)[0]);
            func_000016C4(((void **)q)[1]);
        }
        func_000016C4(e);
        D_801FDA34[i] = ((void *)0);
        i = func_001461D4(u);
        D_801FDA3C[i * 4] &= ~1;
    }
}
