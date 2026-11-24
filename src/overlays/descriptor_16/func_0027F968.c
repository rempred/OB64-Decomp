typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[0x18];
    s32 *w18;
    s16 h1C;
    s16 h1E;
    u8 *w20;
    u8 *w24;
    s16 h28;
} Obj27;
extern Obj27 *D_8022CB20;
extern u16 D_800E9BE4[];
extern u8 D_800EB1F0[];
void D_800EA604(void *bank, s32 se);
extern s16 D_8022CB28;
extern s16 D_8022CB2A;
typedef struct {
    u8 unk00[0x18];
    s16 fade;
    u8 unk1A[0xE];
    u16 flags;
} Win27;
extern u16 D_800E79B0;
extern s16 D_8022CB28;
extern s16 D_8022CB2A;
void D_8017C384(u8 *w);
extern inline s16 ShopYesNo27(void) {
    if (D_800E79B0 & 0x8000) {
        return D_8022CB2A;
    }
    if (D_800E79B0 & 0x4000) {
        return 0;
    }
    if (D_800E9BE4[0] & 0x800) {
        if (D_8022CB2A != 1) {
            D_800EA604(D_800EB1F0, 2);
        }
        D_8022CB2A = 1;
    } else if (D_800E9BE4[0] & 0x400) {
        if (D_8022CB2A != 0) {
            D_800EA604(D_800EB1F0, 2);
        }
        D_8022CB2A = 0;
    }
    return -1;
}
s32 func_0027F968(void) {
    Obj27 *o = D_8022CB20;
    u8 *sub = (u8 *)&o->w18;
    s16 r;
    if (o->w24 == ((void *)0)) {
        return 0;
    }
    D_8022CB28 = 2;
    if (((Win27 *)o->w24)->fade <= 200) {
        return 0;
    }
    r = ShopYesNo27();
    if (r == 1) {
        D_800EA604(D_800EB1F0, 0);
        if ((*(u8 * *)((u8 *)(sub) + (0xC))) != ((void *)0) && !(((Win27 *)(*(u8 * *)((u8 *)(sub) + (0xC))))->flags & 2)) {
            D_8017C384((*(u8 * *)((u8 *)(sub) + (0xC))));
            return 1;
        }
        return 1;
    }
    if (r == 0) {
        D_800EA604(D_800EB1F0, 1);
        if ((*(u8 * *)((u8 *)(sub) + (0xC))) != ((void *)0) && !(((Win27 *)(*(u8 * *)((u8 *)(sub) + (0xC))))->flags & 2)) {
            D_8017C384((*(u8 * *)((u8 *)(sub) + (0xC))));
            return 2;
        }
        return 2;
    }
    return 0;
}
extern s16 D_8022CB2A;
