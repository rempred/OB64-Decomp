typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 D_8021EF04;
extern u8 D_8021EF06;
void D_8020CDA0(s32 k);
extern u8 D_800E7A32[];
extern u8 *D_8021EF00;
void func_0016D7E8(void);
extern u8 D_8021EF05;
extern u16 *D_800C4BDC;
extern u16 *D_800C4BAC;
u8 func_0016DB68(u16 *b);
extern u16 *D_800E8108;
extern u16 *D_800C4C0C;
void func_0016D7E8(void) {
    u8 *st = &D_8021EF04;
    switch (*st) {
        case 1:
            if (D_8021EF00[0x65] < 25) {
                D_8021EF00[0x65] += 3;
            } else {
                *st = 2;
            }
            break;
        case 2:
            if (*D_800C4BDC & 0x8000) {
                *st = 3;
                D_8021EF05 = 0;
                D_8021EF06 = D_8021EF00[0x5C];
                D_8020CDA0(6);
            } else if (*D_800C4BDC & 0x4000) {
                *st = 3;
                D_8021EF05 = 0xFF;
                D_8020CDA0(1);
            } else {
                u8 d = func_0016DB68(D_800C4BAC);
                u8 *o;
                u8 cur;
                u8 tgt;
                if (d != 0xFF) {
                    D_8021EF00[0x69] = d;
                } else if (*D_800E8108 & 0x2030) {
                    D_8021EF00[0x64] &= 0x7F;
                    if (*D_800C4C0C & 0x10) {
                        u8 *q = D_8021EF00;
                        u8 v = q[0x69];
                        if (v != 0) {
                            v--;
                        } else {
                            v = 7;
                        }
                        q[0x69] = v;
                    } else if (*D_800C4C0C & 0x2020) {
                        D_8021EF00[0x69] = (D_8021EF00[0x69] + 1) % 8;
                    }
                }
                o = D_8021EF00;
                cur = o[0x5C];
                tgt = o[0x69];
                if (tgt != cur) {
                    if (!(o[0x64] & 0x80)) {
                        if (cur < 4) {
                            o[0x5C] = (u32)(tgt - cur - 1) < 3 ? cur + 1 : cur - 1;
                        } else {
                            o[0x5C] = (u32)(tgt - cur + 4) < 4 ? cur - 1 : cur + 1;
                        }
                        D_8021EF00[0x5C] &= 7;
                        D_8020CDA0(5);
                    }
                    D_8021EF00[0x64] ^= 0x80;
                } else {
                    o[0x64] &= 0x7F;
                }
            }
            break;
        case 3:
            if (D_8021EF00[0x65] >= 14) {
                D_8021EF00[0x65] -= 3;
            } else {
                *st = 0;
                D_800E7A32[0] |= 2;
            }
            break;
    }
    {
        u8 *o = D_8021EF00;
        u8 f = o[0x64];
        o[0x64] = (u8)((f & 0x7F) + 1) % 60 | (f & 0x80);
    }
}
u8 func_0016DB68(u16 *b);
