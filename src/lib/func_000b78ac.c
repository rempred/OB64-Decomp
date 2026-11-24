typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
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
void func_000b78ac(u16 sq) {
    ClearMemberFlag4(sq);
}
