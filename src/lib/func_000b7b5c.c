typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern s32 func_000bd154(s32);
void func_000b3210(s32 sq);
extern inline void ClearMemberFlag4(u16 sq) {
    s32 i;
    for (i = 0; i < 9; i++) {
        s32 o;
        u8 m;
        o = sq * 0x36;
        m = (D_80196AF8 + o + i)[0x1180];
        if (m != 0xFF) {
            o = m * 2;
            (D_80196AF8 + o)[0x1872] &= ~4;
        }
    }
}
void func_000b7b5c(s32 sq, s32 a, s32 b) {
    u8 *s = D_80196AF8 + ((u16)sq * 0x36 + 0x117C);
    u8 *pb = s + (u16)b;
    u8 t = pb[4];
    if (t == 0xFF) {
        u8 *pa = s + (u16)a;
        pb[4] = pa[4];
        pa[4] = 0xFF;
    } else {
        u8 *pa = s + (u16)a;
        u8 x = pa[4];
        pa[4] = t;
        pb[4] = x;
    }
    if (s[3] == (u16)a) {
        s[3] = b;
    } else if (s[3] == (u16)b) {
        s[3] = a;
    }
    ClearMemberFlag4(sq);
    s[0x1D] = func_000bd154((u16)sq);
    func_000b3210((u16)sq);
}
