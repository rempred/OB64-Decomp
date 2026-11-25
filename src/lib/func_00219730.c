typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
s32 D_801C8E30(u8 *u);
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern StockEntry D_80196B00[];
u16 D_8016DF88(u8, u8);
u16 D_8016DFDC(u8, u8);
u16 D_8016E030(u8, u8);
u16 D_8016E084(u8, u8);
u16 D_8016B6FC(u16 id);
typedef struct {
    u8 from;
    u8 to;
    u8 element;
    u8 str;
    u8 vit;
    u8 intl;
    u8 men;
    u8 agi;
    u8 dex;
    u8 alignLo;
    u8 alignHi;
} ClassReq213;
extern ClassReq213 D_801E5B98[16];
u8 func_00219730(u8 *u) {
    u32 i;
    if (D_801C8E30(u)) {
        return 0;
    }
    for (i = 0; i < 16; i++) {
        u16 items[4];
        u16 j;
        if (D_801E5B98[i].from != (*(s32 *)((u8 *)(u) + (0x4C)))) {
            continue;
        }
        if (D_801E5B98[i].element != 8 && D_801E5B98[i].element != u[0x33]) {
            continue;
        }
        if (D_801E5B98[i].str > (*(u16 *)((u8 *)(u) + (0x24))) || D_801E5B98[i].vit > (*(u16 *)((u8 *)(u) + (0x26))) || D_801E5B98[i].intl > (*(u16 *)((u8 *)(u) + (0x28))) ||
            D_801E5B98[i].men > (*(u16 *)((u8 *)(u) + (0x2A))) || D_801E5B98[i].agi > (*(u16 *)((u8 *)(u) + (0x2C))) || D_801E5B98[i].dex > (*(u16 *)((u8 *)(u) + (0x2E))) ||
            D_801E5B98[i].alignLo > u[0x34] || D_801E5B98[i].alignHi < u[0x34]) {
            continue;
        }
        items[0] = D_8016DF88(D_801E5B98[i].to, D_801E5B98[i].to);
        items[1] = D_8016DFDC(D_801E5B98[i].to, D_801E5B98[i].to);
        items[2] = D_8016E030(D_801E5B98[i].to, D_801E5B98[i].to);
        items[3] = D_8016E084(D_801E5B98[i].to, D_801E5B98[i].to);
        for (j = 0; j < 4; j++) {
            u16 s;
            if (items[j] == 0) {
                continue;
            }
            s = D_8016B6FC(items[j]);
            if (s >= 0x117) {
                return 0;
            }
            if (items[j] == D_8016DF88(u[0x4F], u[0x4F]) || items[j] == D_8016DFDC(u[0x4F], u[0x4F]) ||
                items[j] == D_8016E030(u[0x4F], u[0x4F]) || items[j] == D_8016E084(u[0x4F], u[0x4F]) ||
                items[j] == (*(u16 *)((u8 *)(u) + (0x36))) || items[j] == (*(u16 *)((u8 *)(u) + (0x38))) ||
                items[j] == (*(u16 *)((u8 *)(u) + (0x3A))) || items[j] == (*(u16 *)((u8 *)(u) + (0x3C)))) {
                continue;
            }
            if (!(D_80196B00[s].count > D_80196B00[s].equipped)) {
                return 0;
            }
        }
        return D_801E5B98[i].to;
    }
    return 0;
}
