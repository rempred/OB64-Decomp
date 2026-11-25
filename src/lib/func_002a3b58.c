typedef unsigned char u8;
typedef signed int s32;
extern s32 *D_80238A90;
s32 func_002a3b58(s32 k, u8 *out) {
    s32 *tbl = D_80238A90;
    s32 off = 0;
    s32 n = 0;
    if (k < tbl[0]) {
        s32 *e = (s32 *)((k * 2 + 2) * 4 + (s32)tbl);
        off = e[0];
        n = e[1];
    }
    (*(s32 * *)((u8 *)(out) + (8))) = &tbl[off];
    (*(s32 * *)((u8 *)(out) + (0xC))) = &tbl[off + n];
    (*(s32 * *)((u8 *)(out) + (0x10))) = &tbl[off + n * 2];
    return n;
}
