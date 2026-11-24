typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern inline void ClearMemberFlag20(u8 u) {
    s32 k;
    for (k = 0; k < 9; k++) {
        s32 o;
        u8 m;
        o = u * 54;
        m = (D_80196AF8 + o + k)[0x1180];
        if (m != 0xFF) {
            o = m * 2;
            (D_80196AF8 + o)[0x1872] &= ~0x20;
        }
    }
}
void func_000b726c(u16 r, u16 c) {
    u8 *row = D_80196AF8 + 0x10D4 + r * 14;
    u8 *cell = row + c;
    u8 u = cell[2];
    s32 off;
    u8 t;
    if (u == 0xFF) {
        return;
    }
    off = u * 54;
    (D_80196AF8 + off)[0x117D] = 0;
    (D_80196AF8 + off)[0x117E] = 0xFF;
    cell[2] = 0xFF;
    (*(s32 *)((u8 *)(D_80196AF8) + (0x2C0)))++;
    if ((u16)(c - 1) < 2) {
        t = cell[4];
        cell[4] = 0xFF;
        cell[2] = t;
    }
    row[8]--;
    ClearMemberFlag20(u);
}
