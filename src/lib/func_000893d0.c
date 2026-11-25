typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
u16 func_000be27c(s32 a, u8 item);
u16 func_000be494(s32 a, u8 item);
void func_000881dc(s32 d);
void func_000885a8(s32 x, s32 y, s32 v, s32 w);
void func_000881dc(s32 k);
void func_000885a8(s32 x, s32 y, s32 v, s32 w);
void func_000893d0(s32 x, s32 y, u8 item) {
    s32 v[4];
    v[0] = v[1] = func_000be27c(0, item);
    v[2] = v[3] = func_000be494(0, item);
    if ((*(u16 *)((u8 *)(D_80196AF8) + (0xA4))) & 0x10) {
        (*(u16 *)((u8 *)(D_80196AF8) + (0xA4))) |= 0x20;
        v[1] = func_000be27c(0, item);
        v[3] = func_000be494(0, item);
        (*(u16 *)((u8 *)(D_80196AF8) + (0xA4))) &= ~0x20;
    } else if ((*(u16 *)((u8 *)(D_80196AF8) + (0xA4))) & 0x40) {
        (*(u16 *)((u8 *)(D_80196AF8) + (0xA4))) |= 0x80;
        v[1] = func_000be27c(0, item);
        v[3] = func_000be494(0, item);
        (*(u16 *)((u8 *)(D_80196AF8) + (0xA4))) &= ~0x80;
    }
    func_000881dc(v[1] - v[0]);
    func_000885a8(x, y, (v[1] >= 1000) ? 999 : v[1], -3);
    func_000881dc(v[3] - v[2]);
    func_000885a8(x, y + 0x15, (v[3] >= 1000) ? 999 : v[3], -3);
}
