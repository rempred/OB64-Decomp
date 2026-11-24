typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[0x5C];
    s16 h5C;
    u8 b5E;
    u8 unk5F;
    s32 w60;
    u8 b64;
    u8 b65;
    u8 unk66[2];
    s32 w68;
    s32 w6C;
    s32 w70;
    s32 w74;
    s32 w78;
    s32 w7C;
} Ctx17;
extern u8 D_80214E84;
extern Ctx17 *D_8021AA70;
typedef struct {
    u16 flags;
    u8 flags2;
    u8 flags3;
    u8 unk04[0x10];
    void (*update)(void);
    void (*draw)(void);
    void (*exit)(void);
    u16 size;
    u8 unk22[2];
    s32 w24;
} CurScene17;
extern CurScene17 D_800E7A30;
void func_00171FE8(void);
void *D_8017BFB0(s32 a, s32 b, void *c, s32 d, s32 e, s32 f, s32 g, s32 h, s32 i, s32 j, s32 k);
void D_8017C384(void *w);
void D_8020CDA0(s32 se);
extern u16 *D_800C4BDC;
extern s32 D_801F1070;
extern u8 D_801951B0[][0x24];
void func_001723B4();
void func_001726A0();
void func_00172364(void);
void func_00171FE8(void) {
    u8 *loc = D_801951B0[0];
    if ((u16)D_8021AA70->h5C < D_801F1070) {
        loc = D_801951B0[(u16)D_8021AA70->h5C];
    } else {
        D_800E7A30.flags2 |= 2;
    }
    if (!((*(u16 *)((u8 *)(loc) + (0x1C))) & 6)) {
        D_8021AA70->b5E = 0;
    } else if ((*(u16 *)((u8 *)(loc) + (0x1C))) & 2) {
        D_8021AA70->b5E = 1;
    } else {
        D_8021AA70->b5E = 2;
    }
    D_8021AA70->w60 = (s32)loc;
    switch (D_8021AA70->b64) {
        case 0:
            if (D_8021AA70->w68 == 0) {
                u8 *w;
                u8 *w2;
                w = D_8017BFB0(0, 0, func_001723B4, 100, 110, 220, 210, 80, 90, 240, 230);
                D_8021AA70->w68 = (s32)w;
                w[0x14] |= 3;
                w2 = D_8017BFB0(0, 0, func_001726A0, 80, 40, 240, 190, 60, 20, 260, 210);
                D_8021AA70->w6C = (s32)w2;
                w2[0x14] |= 3;
            }
            if (D_8021AA70->b65 >= 9) {
                D_8021AA70->b64 = 1;
                D_8021AA70->b65 = 0;
            } else {
                D_8021AA70->b65++;
            }
            break;
        case 1:
            if (*D_800C4BDC & 0xC000) {
                D_8021AA70->b64 = 2;
                D_8020CDA0(1);
            }
            break;
        case 2:
            if (D_8021AA70->w68 != 0) {
                D_8017C384((void *)D_8021AA70->w68);
                D_8017C384((void *)D_8021AA70->w6C);
                D_8021AA70->w68 = 0;
                D_8021AA70->w6C = 0;
            }
            if (D_8021AA70->b65 >= 17) {
                D_8021AA70->b64 = 3;
                D_8021AA70->b65 = 0;
            } else {
                D_8021AA70->b65++;
            }
            break;
        case 3:
            func_00172364();
            D_80214E84 = 0;
            D_800E7A30.flags2 |= 2;
            break;
    }
}
void func_00172364(void);
