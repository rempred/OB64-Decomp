typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
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
void func_000b7978(u16 sa, u16 a, u16 sb, u16 b) {
    u8 moved = 0;
    u8 *pa;
    u8 *pb;
    u8 *row;
    u8 t;
    if (a >= 9) {
        pa = D_80196AF8 + (a + 0x1A21);
    } else {
        row = D_80196AF8 + (sa * 0x36 + 0x117C);
        pa = row + (a + 4);
        if (row[3] == a) {
            row[3] = b;
            moved = 1;
        }
    }
    if (b >= 9) {
        pb = D_80196AF8 + (b + 0x1A21);
    } else {
        row = D_80196AF8 + (sb * 0x36 + 0x117C);
        pb = row + (b + 4);
        if (!moved && row[3] == b) {
            row[3] = a;
        }
    }
    if (*pb == 0xFF) {
        *pb = *pa;
        *pa = 0xFF;
    } else {
        t = *pa;
        *pa = *pb;
        *pb = t;
    }
    ClearMemberFlag4(sa);
    ClearMemberFlag4(sb);
    func_000b3210(sa);
    func_000b3210(sb);
}
