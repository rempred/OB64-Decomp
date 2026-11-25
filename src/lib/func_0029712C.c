typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_8017C4B4(u32);
void D_801793AC(s32 a, s32 x, s32 y);
void func_0029712C(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    s32 i;
    if (e[0xC] != 0) {
        D_8017C4B4(e[0xC]);
        for (i = 0; i < 2; i++) {
            D_801793AC(((s32 *)((*(u8 * *)((u8 *)(o) + (0xD0))) + 0x530))[i], (*(s32 *)((u8 *)(o) + (0x2C))) + 4, (*(s32 *)((u8 *)(o) + (0x30))) + 6 + i * 0x11);
        }
    }
}
