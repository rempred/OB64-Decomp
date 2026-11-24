typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000bb0cc(void);
void func_000badd4(void);
void func_000b7164(u16 r);
void func_000b7164(u16 r) {
    u8 *row = D_80196AF8 + (r * 14 + 0x10D4);
    s32 c;
    s32 k;
    u8 u;
    u8 m;
    u8 *rec;
    s32 o;
    for (c = 0; c < 5; c++) {
        u = (row + c)[2];
        if (u == 0xFF) {
            continue;
        }
        rec = D_80196AF8 + (u * 54 + 0x117C);
        rec[1] = 0;
        rec[2] = 0xFF;
        (row + c)[2] = 0xFF;
        (*(s32 *)((u8 *)(D_80196AF8) + (0x2C0)))++;
        for (k = 0; k < 9; k++) {
            m = (rec + k)[4];
            if (m != 0xFF) {
                o = m * 2;
                (D_80196AF8 + o)[0x1872] &= ~0x20;
            }
        }
    }
    row[8] = 0;
    row[0] = 0;
    row[1] = 0;
    (*(s32 *)((u8 *)(D_80196AF8) + (0x5DC)))--;
    func_000bb0cc();
    func_000badd4();
}
