typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct {
    u8 b[0xE];
} GroupD21;
typedef struct {
    u8 b[0x36];
} SquadD21;
typedef struct {
    u8 pad[0x10D4];
    GroupD21 grp[10];
    u8 pad1160[0x117C - 0x1160];
    SquadD21 sq[1];
} SaveD21;
void func_000daa84(u8 g, u8 slot);
void func_000daa84(u8 sq, u8 k) {
    u8 *e = ((SaveD21 *)D_80196AF8)->grp[sq].b;
    u8 *g = ((SaveD21 *)D_80196AF8)->sq[(e + k)[2]].b;
    s32 i;
    for (i = 0; i < 9; i++) {
        u8 m = (g + i)[4];
        if (m != 0xFF) {
            u8 *p = D_80196AF8 + (m * 2 + 0x1872);
            *p &= 0xDF;
        }
    }
}
