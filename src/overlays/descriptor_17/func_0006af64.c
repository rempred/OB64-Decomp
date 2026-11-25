typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_8019C8E4;
typedef struct {
    u8 *obj;
    u16 pad4;
    u16 n;
    u8 *items;
    u8 sel;
    u8 padD[3];
    u8 *help;
    u8 pad14[4];
} List699;
extern List699 D_8019C900;
extern u8 D_801936B2;
extern u8 D_801936B3;
extern u8 D_801936B4;
extern u8 D_8019C240[];
extern u8 D_8019C210[];
extern u8 D_8019C220[];
extern u8 D_8019C224[];
extern u8 D_8019C238[];
u8 *D_80228048(s32 a, u8 *b, s32 c, s32 d, s32 e, s32 f, s32 g, s32 h, s32 i, s32 j, s32 k);
void D_80227EB8(u8 *w, s32 a, s32 b, s32 c);
void D_80227F14(u32, s32 b);
u8 *D_8017C074(u16 kind, u8 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h);
void func_0006a628();
void func_0006af64(void) {
    u8 mode = D_801936B2;
    u8 *w;
    if (mode == 3) {
        D_8019C8E4 = 1;
    }
    if (D_801936B4 != 0) {
        if (mode == 2) {
            D_8019C8E4 = 1;
        }
    }
    w = D_80228048(0, D_8019C240, 0xA2, 0x1B, 0xAA, 0x125, 0xDE, 0x1B, 0xAA, 0x125, 0xDE);
    D_80227EB8(w, 0xA3, 0, 1);
    w[0x23] = 3;
    (*(s16 *)((u8 *)(w) + (0x14))) = 4;
    (*(s16 *)((u8 *)(w) + (0x46))) = 4;
    (*(s16 *)((u8 *)(w) + (0x20))) = 0x30;
    D_80227F14(0, 5);
    bzero(&D_8019C900, sizeof(List699));
    if (D_8019C8E4) {
        D_8019C900.n = 5;
        D_8019C900.items = D_8019C224;
        D_8019C900.help = D_8019C238;
    } else {
        D_8019C900.items = D_8019C210;
        D_8019C900.n = 4;
        D_8019C900.help = D_8019C220;
    }
    D_8019C900.obj =
        D_8017C074(0x400, 8, func_0006a628, 0x20, 0x14, 0xA8, D_8019C900.n * 20 + 0x18);
    D_8019C900.sel = D_801936B3;
}
