typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_8017C4B4(int);
void func_00076b64(s32 a, s32 b);
void func_00075b50(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
    s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
    D_8017C4B4(e[0xC]);
    func_00076b64(x + 0xC, y + 0xC);
}
void func_00076b64(s32 x, s32 y);
