typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef struct {
    s32 r;
    s32 g;
    s32 b;
    s32 a;
} Col2B6;
extern Col2B6 D_80243D58;
extern Col2B6 D_80243D68;
s32 func_002B7B40(s32 pos, s32 p, u8 *o, Col2B6 *c1, Col2B6 *c2, s32 w);
void func_002B7D50(u8 *o, s32 k) {
    Col2B6 c1 = D_80243D58;
    Col2B6 c2 = D_80243D68;
    s32 w = 0x20;
    s32 base;
    s32 x;
    switch (o[0x83]) {
        case 0:
            break;
        case 1:
            c1.r = 0xFF;
            c1.g = 0x32;
            c1.b = 0x32;
            c2.r = 0xFF;
            c2.g = 0x32;
            c2.b = 0x32;
            break;
        case 2:
            c1.r = 0x32;
            c1.g = 0xFF;
            c1.b = 0x64;
            c2.r = 0x32;
            c2.g = 0xFF;
            c2.b = 0x64;
            break;
        case 3:
            c1.r = 0xC8;
            c1.g = 0x64;
            c1.b = 0xB4;
            c2.r = 0xC8;
            c2.g = 0x64;
            c2.b = 0xB4;
            break;
    }
    base = (*(s16 *)((u8 *)(o) + (0x80)));
    base *= 2;
    for (x = -0x82; x < ((*(s32 *)((u8 *)(o) + (0x58))) + w) * 2; x += 0x82) {
        func_002B7B40(base + x, (*(s32 *)((u8 *)(o + k * 4) + (0))) + (base + x) * 16, o, &c1, &c2, w);
    }
}
