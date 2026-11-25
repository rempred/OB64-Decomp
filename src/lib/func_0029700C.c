typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
struct PanelContent;
extern u8 *D_8023DE34;
void D_8017C4B4(u32);
void D_801793AC(s32 a, s32 x, s32 y);
struct PanelContent * func_002952D4(struct PanelContent *, s32);
void D_8017CBE8(u8 *o, u8 *p);
void func_0029700C(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        u8 *p = (*(u8 * *)((u8 *)(o) + (0xD0)));
        func_002952D4(p, (*(u16 *)((u8 *)(D_8023DE34) + (0x1A))));
        D_8017C4B4(e[0xC]);
        D_801793AC((*(s32 *)((u8 *)((*(u8 * *)((u8 *)(o) + (0xD0)))) + (0x530))), (*(s32 *)((u8 *)(o) + (0x2C))) + 4, (*(s32 *)((u8 *)(o) + (0x30))) + 4);
        D_8017CBE8(o, p);
    }
}
