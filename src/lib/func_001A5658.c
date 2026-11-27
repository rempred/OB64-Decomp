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
void func_001A5658(void) {
    Opt1A4 *o = D_80219420;
    if (D_800E9C0A.h2 == 0x100) {
        D_80219420[0].saved = 0;
    } else if (D_800E9C0A.h2 == 0x200) {
        D_80219420[0].saved = 1;
    } else {
        D_80219420[0].saved = 2;
    }
    (++o)->saved = 4 - (D_800E9C0A.h0 - 0x100) / 128;
    (++o)->saved = D_800E9C0A.b6;
    (++o)->saved = D_800E9C0A.b4;
    (++o)->saved = D_800E9C0A.b9;
    (++o)->saved = D_800E9C0A.bA;
    (++o)->saved = D_800E9C0A.bB;
    (++o)->saved = D_800E9C0A.bC;
    (++o)->saved = D_800E9C0A.b5;
    (++o)->saved = D_800E9C0A.b8;
    (++o)->saved = D_800E9C0A.bD;
    (++o)->saved = D_800E9C0A.bE;
    o[1].saved = D_800E9C0A.b7;
    D_800EA8CC(D_800E9C0A.b7 == 0);
}
