typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 D_801F36A0;
u8 D_8016DEC4(u8 cls, u8 base);
extern u8 D_8018F481_check1;
extern u8 D_80193BC0_copy[][0x38];
extern u8 D_80195560_copy[][0x34];
extern u16 D_801F36BC;
extern u8 D_801F401F;
s32 func_0015E498(u8 kind) {
    u8 a;
    u8 b;
    switch (kind) {
        case 0:
            if (D_801F401F >= 100 || D_801F401F == 0) {
                a = 1;
            } else if (D_801F36A0 & 1) {
                a = D_80195560_copy[D_801F401F][0x12];
            } else {
                a = D_80193BC0_copy[D_801F401F][0x12];
            }
            if (D_8018F481_check1 == 4 && a == 0x62) {
                a = 0xE0;
            }
            return a | 0x5000;
        case 4:
            b = 0;
            if (D_801F401F >= 100 || D_801F401F == 0) {
                a = 0;
            } else if (D_801F36A0 & 1) {
                a = D_80195560_copy[D_801F401F][0x11];
                b = D_80195560_copy[D_801F401F][0x12];
            } else {
                a = D_80193BC0_copy[D_801F401F][0x11];
                b = D_80193BC0_copy[D_801F401F][0x12];
            }
            return D_8016DEC4(a, b) == 2 ? 0x4005 : 0x4004;
        case 15:
            return ((D_801F36BC >> 8) + 15) | 0x4000;
        case 18:
            return ((D_801F36BC >> 8) + 18) | 0x4000;
        default:
            return 0x40000;
    }
}
