typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 pad0[8];
    u8 value;
    u8 saved;
    u8 pad10[6];
} Opt1A4;
extern Opt1A4 D_80219420[13];
extern struct {
    u16 h0;
    u16 h2;
    u8 b4;
    u8 b5;
    u8 b6;
    u8 b7;
    u8 b8;
    u8 b9;
    u8 bA;
    u8 bB;
    u8 bC;
    u8 bD;
    u8 bE;
} D_800E9C0A;
void D_800EA8CC(s32 on);
void func_001A578C(void) {
    s32 i;
    Opt1A4 *o = D_80219420;
    for (i = 0; i < 13; i++) {
        (o + i)->saved = (o + i)->value;
    }
    D_800E9C0A.h2 = ((2 - D_80219420[0].saved) << 8) + 0x100;
    D_800E9C0A.h0 = ((4 - D_80219420[1].saved) << 7) + 0x100;
    D_800E9C0A.b6 = D_80219420[2].saved;
    D_800E9C0A.b4 = D_80219420[3].saved;
    D_800E9C0A.b9 = D_80219420[4].saved;
    D_800E9C0A.bA = D_80219420[5].saved;
    D_800E9C0A.bB = D_80219420[6].saved;
    D_800E9C0A.bC = D_80219420[7].saved;
    D_800E9C0A.b5 = D_80219420[8].saved;
    D_800E9C0A.b8 = D_80219420[9].saved;
    D_800E9C0A.bD = D_80219420[10].saved;
    D_800E9C0A.bE = D_80219420[11].saved;
    D_800E9C0A.b7 = D_80219420[12].saved;
    D_800EA8CC(D_80219420[12].saved == 0);
}
