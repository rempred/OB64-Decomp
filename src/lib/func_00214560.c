typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[0x11];
    u8 cls;
    u8 baseCls;
    u8 level;
    u8 gender;
    u16 maxHp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 str;
    u16 vit;
    u16 intl;
    u16 men;
    u16 agi;
    u16 dex;
    u8 luck;
    u16 items[4];
    u8 fatigue;
    u8 status;
} Character;
typedef struct {
    Character c;
    u8 pad[4];
} PlayerChar;
extern PlayerChar D_80193BC0_copy[];
extern u8 D_801976E8;
s32 D_801C8E30(u8 *u);
extern u8 D_801936A7;
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8ADC(void);
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
extern StockEntry D_80196B00[];
u8 *D_801C9380(void);
s32 D_801CC51C(s32 flag);
u16 D_8016DF88(u8, u8);
u16 D_8016DFDC(u8, u8);
u16 D_8016E030(u8, u8);
u16 D_8016E084(u8, u8);
u16 D_8016B6FC(u16 id);
s32 func_00214560(void) {
    u8 *u = D_801C9380();
    u16 ids[4];
    s32 n;
    s32 i;
    u8 g;
    u8 cl;
    u16 k;
    if (D_801C8E30(u)) {
        return 0;
    }
    if (D_80193BC0_copy[u[0xF6]].pad[3] < 100) {
        return 0;
    }
    D_80193BC0_copy[u[0xF6]].pad[3] = 99;
    if (D_801C8AEC()) {
        return 0;
    }
    if (D_801C8AFC()) {
        return 0;
    }
    if (D_801C8ADC()) {
        return 0;
    }
    for (i = 1, n = 0; i < 100; i++) {
        n += D_80193BC0_copy[i].c.cls != 0;
    }
    if (n >= 94 || (D_801936A7 == 0x27 && D_801976E8 == 0x1F)) {
        return 0;
    }
    g = D_80193BC0_copy[u[0xF6]].c.gender;
    if (D_801CC51C(0x19)) {
        g ^= 1;
    }
    if (g == 0) {
        cl = 2;
    } else {
        cl = 4;
    }
    ids[0] = D_8016DF88(cl, cl);
    ids[1] = D_8016DFDC(cl, cl);
    ids[2] = D_8016E030(cl, cl);
    ids[3] = D_8016E084(cl, cl);
    for (k = 0; k < 4; k++) {
        if (ids[k] != 0) {
            u16 s = D_8016B6FC(ids[k]);
            if (s >= 0x117) {
                return 0;
            }
            if (!(D_80196B00[s].count > D_80196B00[s].equipped)) {
                return 0;
            }
        }
    }
    return 1;
}
